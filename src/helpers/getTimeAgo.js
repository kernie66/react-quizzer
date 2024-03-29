/* Function that determines the best unit and update interval for a */
/* date relative to now. The update interval returned is in seconds */

const secondsTable = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

export default function getTimeAgo(date) {
  const seconds = Math.round((date.getTime() - new Date().getTime()) / 1000);
  const absSeconds = Math.abs(seconds);
  let bestUnit, bestTime, bestInterval;
  for (let [unit, unitSeconds] of secondsTable) {
    if (absSeconds >= unitSeconds) {
      bestUnit = unit;
      bestTime = Math.round(seconds / unitSeconds);
      bestInterval = unitSeconds / 2;
      break;
    }
  }
  if (!bestUnit) {
    bestUnit = "second";
    bestTime = parseInt(seconds / 10) * 10;
    bestInterval = 10;
  }
  return [bestTime, bestUnit, bestInterval];
}
