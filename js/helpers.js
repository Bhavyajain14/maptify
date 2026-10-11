export const allNumbers = (...values) =>
  values.every(value => Number.isFinite(value));

export const allPositive = (...values) => values.every(value => value > 0);

// 135 -> "2 h 15 min"
export function formatMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return hours ? `${hours} h ${minutes} min` : `${minutes} min`;
}
