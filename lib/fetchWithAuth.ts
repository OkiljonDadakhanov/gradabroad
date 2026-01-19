export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.gradabroad.net";

// Check if user is authenticated (has valid access token)
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("accessToken");
  return !!token;
}

// Logout user by clearing tokens
export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("universityId");
  window.location.href = "/";
}

// Fetch without authentication for public endpoints
export async function fetchPublic(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const resolvedUrl = resolveUrl(url);
  return fetch(resolvedUrl, options);
}

// Helper to resolve URL - prepends API_BASE if URL starts with /api or is relative
function resolveUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // Already absolute URL - replace production URL with configured base
    return url.replace("https://api.gradabroad.net", API_BASE);
  }
  if (url.startsWith("/")) {
    return `${API_BASE}${url}`;
  }
  return url;
}

export async function refreshToken(): Promise<boolean> {
  const refresh = localStorage.getItem("refreshToken");

  if (!refresh) return false;

  try {
    const res = await fetch(`${API_BASE}/api/auth/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    if (data.access) {
      localStorage.setItem("accessToken", data.access);
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
  const resolvedUrl = resolveUrl(url);

  const res = await fetch(resolvedUrl, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status !== 401) {
    return res;
  }

  // Token expired: try refresh
  const refreshed = await refreshToken();
  if (!refreshed) {
    throw new Error("Session expired");
  }

  token = localStorage.getItem("accessToken");

  return fetch(resolvedUrl, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
