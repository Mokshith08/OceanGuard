let API_URL = import.meta.env.VITE_API_URL || "https://oceanguard-kkrv.onrender.com/api";

// Ensure /api is included only once
if (API_URL && !API_URL.endsWith("/api") && !API_URL.endsWith("/api/")) {
  API_URL = `${API_URL.replace(/\/$/, "")}/api`;
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

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
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