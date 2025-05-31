export function getUrlMaps(
  startLocation,
  endLocation,
  pickupLocations = [],
  dropoffLocations = [],
) {
  const encodedStart = encodeURIComponent(startLocation);
  const encodedEnd = encodeURIComponent(endLocation);

  // Combine pickup and dropoff locations in order
  const waypoints = [...pickupLocations, ...dropoffLocations]
    .map((location) => encodeURIComponent(location))
    .join("/");

  // If there are waypoints, add them to the URL
  const waypointsPath = waypoints ? `/${waypoints}` : "";

  return `https://www.google.com/maps/dir/${encodedStart}${waypointsPath}/${encodedEnd}`;
}
