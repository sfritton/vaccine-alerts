function EmailHTMLBodyTemplate(
  locations: VaccineLocation[],
  recipient: Recipient
) {
  return `
  <div>
    <h3>Appointments available at ${locations.length} location${addS(
    locations
  )}</h3>
    <ul>
      ${locations.map(LocationListItem).join("")}
    </ul>
    See more details on <a href="https://www.vaccinespotter.org/MN/?zip=${
      recipient.zipCode
    }&radius=${recipient.radius}">Vaccine Spotter</a>.
  </div>
  `;
}

function LocationListItem({
  distance,
  properties: { url, provider_brand_name, name, city, postal_code },
}: VaccineLocation) {
  const linkOpen = url ? `<a href="${url}">` : "";
  const linkClose = url ? `</a>` : "";

  return `
    <li>
      <b>${linkOpen}${provider_brand_name ?? ""} ${name ?? ""}${linkClose}</b>
      - ${city ?? ""}, MN ${postal_code ?? ""} (${Math.round(distance)} mi)
    </li>
`;
}

function EmailPlainBodyTemplate(locations: VaccineLocation[]) {
  return `Appointments available at ${locations.length} location${addS(
    locations
  )}:\n${locations.map(locationToString).join("\n")}`;
}

function locationToString(location: VaccineLocation) {
  return `\t• ${location.properties.provider_brand_name} ${
    location.properties.name
  } - ${location.properties.city}, MN ${
    location.properties.postal_code
  } (${Math.round(location.distance)} mi)`;
}

function addS(arr: any[]) {
  if (arr.length === 1) return "";

  return "s";
}
