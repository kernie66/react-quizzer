// Sets the path relative to the base directory
export default function (path) {
  return new URL(path, import.meta.url).pathname;
}
