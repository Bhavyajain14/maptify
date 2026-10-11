export const allNumbers = (...values) =>
  values.every(value => Number.isFinite(value));

export const allPositive = (...values) => values.every(value => value > 0);

// 135 -> "2 h 15 min"
export function formatMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return hours ? `${hours} h ${minutes} min` : `${minutes} min`;
}

// Distance in km between two [lat, lng] points (haversine formula)
function distanceKm([lat1, lng1], [lat2, lng2]) {
  const toRad = deg => (deg * Math.PI) / 180;
  const EARTH_RADIUS_KM = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

// Total length in km of a route made of [lat, lng] points
export function routeDistanceKm(route) {
  let total = 0;
  for (let i = 1; i < route.length; i++) total += distanceKm(route[i - 1], route[i]);
  return total;
}
