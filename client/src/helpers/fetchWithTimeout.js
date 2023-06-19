/* Function that fetches the URL with a timeout if there is no response. */
/* Usage: fetchWithTimeout(URL, {timeout: 8000}) */

export default function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options;
  
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeout);
  const response = fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(timerId);
  return response;
}