// Sets the path relative to the base directory
export default function (path) {
  // Compensate for the directory of this file
  return new URL("../../" + path, import.meta.url).pathname;
}
