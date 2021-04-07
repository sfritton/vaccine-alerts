/** The main function to be executed periodically. */
async function main() {
  const response = await getAppointments();

  const availableLocations = filterLocations(response);

  // Do nothing if no vaccines were found
  if (availableLocations.length < 1) return;

  // We found some! Send an email alert
  sendAlert(availableLocations);
}

/** Fetch a list of pharmacies from https://github.com/GUI/covid-vaccine-spotter */
async function getAppointments() {
  const response = await fetch(
    "https://www.vaccinespotter.org/api/v0/states/MN.json"
  );

  const json = await response.json();

  return json as AppointmentsResponse;
}

/** Returns a list of nearby vaccines. */
function filterLocations(response: AppointmentsResponse) {
  const radius = RADIUS * MILE_TO_KM;

  return response.features
    .reduce<VaccineLocation[]>((validLocations, location) => {
      // No appointments available, skip this location
      if (!location.properties.appointments_available) return validLocations;

      const distance = getDistance(location.geometry.coordinates, CENTER);

      // Too far away, skip this location
      if (distance > radius) return validLocations;

      return [...validLocations, { ...location, distance }];
    }, [])
    .sort((a, b) => a.distance - b.distance);
}

/** Send me an alert that there are vaccines available */
function sendAlert(locations: VaccineLocation[]) {
  GmailApp.sendEmail(
    EMAIL_ADDRESS,
    "Nearby Vaccines Spotted",
    `Found ${locations.length} locations:\n${locations
      .map(locationToString)
      .join("\n")}`
  );
}

function locationToString(location: VaccineLocation) {
  return `\t${location.properties.name} - ${location.properties.city}, MN (${location.distance} mi)`;
}
