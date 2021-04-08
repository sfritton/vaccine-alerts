/** The main function to be executed periodically. */
async function main() {
  const response = await getAppointments();

  const availableLocations = filterLocations(response);

  // Do nothing if no vaccines were found
  if (availableLocations.length < 1) {
    Logger.log("No locations found");
    return;
  }

  // We found some! Send an email alert
  sendAlert(availableLocations);
}

/** Fetch a list of pharmacies from https://github.com/GUI/covid-vaccine-spotter */
async function getAppointments() {
  const response = UrlFetchApp.fetch(
    "https://www.vaccinespotter.org/api/v0/states/MN.json"
  ).getContentText();
  const json = JSON.parse(response);

  return json as AppointmentsResponse;
}

/** Returns a list of nearby vaccines. */
function filterLocations(response: AppointmentsResponse) {
  return response.features
    .reduce<VaccineLocation[]>((validLocations, location) => {
      // No appointments available, skip this location
      if (!location.properties.appointments_available) return validLocations;

      const distance = getDistance(location.geometry.coordinates, CENTER);

      // Too far away, skip this location
      if (distance > RADIUS) return validLocations;

      return [...validLocations, { ...location, distance }];
    }, [])
    .sort((a, b) => a.distance - b.distance);
}

/** Send me an alert that there are vaccines available */
function sendAlert(locations: VaccineLocation[]) {
  // Find the thread that we've already sent...
  const thread = GmailApp.getThreadById(THREAD_ID);

  // ...and reply to it. (This keeps us from spamming the inbox)
  thread.replyAll(EmailPlainBodyTemplate(locations), {
    htmlBody: EmailHTMLBodyTemplate(locations),
  });
}
