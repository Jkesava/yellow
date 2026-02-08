// functions/retry-exponential-backoff.js

import { httpRequest, sleep } from "../beeceptorClient.js";

export async function retryWithBackoff(input) {
  const {
    url,
    method = "GET",
    headers = {},
    body = {},
    maxRetries = 3,
    baseDelayMs = 500
  } = input;

  let attempt = 0;
  let lastError = null;

  while (attempt <= maxRetries) {
    try {
      const res = await httpRequest({ url, method, headers, body });
      if (res.status >= 200 && res.status < 300) {
        return { success: true, data: res.data };
      }
      lastError = new Error("HTTP " + res.status);
    } catch (err) {
      lastError = err;
    }

    const delay = baseDelayMs * Math.pow(2, attempt);
    console.log(`Retry attempt ${attempt + 1}, waiting ${delay} ms...`);
    await sleep(delay);
    attempt += 1;
  }

  return { success: false, error: String(lastError) };
}
