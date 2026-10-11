export const allNumbers = (...values) =>
  values.every(value => Number.isFinite(value));

export const allPositive = (...values) => values.every(value => value > 0);
