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
  GmailApp.sendEmail(
    EMAIL_ADDRESS,
    "Nearby Vaccines Spotted",
    `Found ${locations.length} location${addS(locations)}:\n${locations
      .map(locationToString)
      .join("\n")}`,
    { htmlBody: locationsToHtml(locations) }
  );
}

function locationToString(location: VaccineLocation) {
  return `\t• ${location.properties.provider_brand_name} ${
    location.properties.name
  } - ${location.properties.city}, MN ${
    location.properties.postal_code
  } (${Math.round(location.distance)} mi)`;
}

function locationsToHtml(locations: VaccineLocation[]) {
  return `
  <div>
    <h3>Found ${locations.length} location${addS(locations)}</h3>
    <ul>
      ${locations.map(
        (location) => `
      <li>
        <b><a href="${location.properties.url}">${
          location.properties.provider_brand_name
        } ${location.properties.name}</a></b>
        - ${location.properties.city}, MN ${
          location.properties.postal_code
        } (${Math.round(location.distance)} mi)
      </li>
      `
      )}
    </ul>
    See more details on <a href="https://www.vaccinespotter.org/MN/?zip=55406&radius=${RADIUS}">Vaccine Spotter</a>.
  </div>
  `;
}

function addS(arr: any[]) {
  if (arr.length === 1) return "";

  return "s";
}
