const API_URL = "http://localhost:5000/api";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("oceanguard_token");

  // Create Headers object
  const headers = new Headers(options.headers || {});

  // Set default Content-Type if not providing FormData
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Add authentication token
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
      throw new Error(data.message || `API request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}
