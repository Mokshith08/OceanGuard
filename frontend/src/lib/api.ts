// Clean the base URL and ensure it ends with /api (without trailing slash)
let API_URL = import.meta.env.VITE_API_URL || "https://oceanguard-lezd.onrender.com/api";
API_URL = API_URL.replace(/\/+$/, ""); // remove trailing slashes
if (!API_URL.endsWith("/api")) {
  API_URL = `${API_URL}/api`;
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("oceanguard_token");

  const headers = new Headers(options.headers || {});

  // Set Content-Type if not FormData
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Add token if exists
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Ensure endpoint starts with a slash
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${API_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || `API request failed with status ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}