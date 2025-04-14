const apiKey = "6c8bfe82b05888d6d0a206c3b1be09b4";
const baseUrl = `https://api.themoviedb.org/3/`;

const bToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YzhiZmU4MmIwNTg4OGQ2ZDBhMjA2YzNiMWJlMDliNCIsIm5iZiI6MTc0NDE1OTQ3NS45Njg5OTk5LCJzdWIiOiI2N2Y1YzJmMzMxYzlmMjcyOTlhZDgxMWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.cMA-zhByMehW6GitAxNYw9WHYgfoXN2BR9mKvEBVW7s";
export { apiKey, baseUrl, bToken };
export default async function baseApi<T>(
  url: RequestInfo | URL,
  options?: RequestInit
) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = (await response.json()) as T;
  return data;
}
