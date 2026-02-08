import fetch from "node-fetch";

export async function httpRequest({ url, method = "GET", headers = {}, body }) {
  const options = { method, headers };
  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
    if (!headers["Content-Type"]) {
      options.headers["Content-Type"] = "application/json";
    }
  }
  const res = await fetch(url, options);
  const data = await res.json();
  return { status: res.status, data };
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

