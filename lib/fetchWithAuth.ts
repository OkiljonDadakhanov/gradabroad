// lib/fetchWithAuth.ts

const API_BASE = "https://api.gradabroad.net";

export async function refreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/token/refresh/`, {
      method: "POST",
      credentials: "include", // for cookie-based refresh
    });

    if (!res.ok) return false;

    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem("accessToken", data.access_token);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let token = localStorage.getItem("accessToken");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status !== 401) {
    return res;
  }

  // Try to refresh token
  const refreshed = await refreshToken();
  if (!refreshed) {
    throw new Error("Session expired");
  }

  token = localStorage.getItem("accessToken");

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
