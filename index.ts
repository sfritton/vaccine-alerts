function main() {
  RECIPIENTS.forEach(findVaccinesForRecipient);
}

/** Search for vaccines matching a person's criteria and send them an alert if they exist.*/
async function findVaccinesForRecipient(recipient: Recipient) {
  const response = await getAppointments();

  const availableLocations = filterLocations(response, recipient);

  // Do nothing if no vaccines were found
  if (availableLocations.length < 1) {
    Logger.log("No locations found");
    return;
  }

  // We found some! Send an email alert
  sendAlert(availableLocations, recipient);
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
function filterLocations(response: AppointmentsResponse, recipient: Recipient) {
  return response.features
    .reduce<VaccineLocation[]>((validLocations, location) => {
      // No appointments available, skip this location
      if (!location.properties.appointments_available) return validLocations;

      const distance = getDistance(
        location.geometry.coordinates,
        recipient.coordinates
      );

      // Too far away, skip this location
      if (distance > recipient.radius) return validLocations;

      return [...validLocations, { ...location, distance }];
    }, [])
    .sort((a, b) => a.distance - b.distance);
}

/** Send an alert that there are vaccines available */
function sendAlert(locations: VaccineLocation[], recipient: Recipient) {
  const plainBody = EmailPlainBodyTemplate(locations);
  const htmlBody = EmailHTMLBodyTemplate(locations, recipient);
  const threads = GmailApp.search(recipient.emailAddress);

  if (threads.length < 1) {
    // We haven't sent them an alert yet, start a new thread
    GmailApp.sendEmail(
      recipient.emailAddress,
      "Nearby Vaccines Spotted",
      plainBody,
      { htmlBody }
    );

    return;
  }

  // Reply to the existing thread. (This keeps us from spamming the inbox)
  threads[0].replyAll(plainBody, { htmlBody });
}
