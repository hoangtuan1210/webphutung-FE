export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getFullUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  if (!BASE_URL) return url;
  const cleanBaseUrl = BASE_URL.replace("/api", "");

  if (url.startsWith(cleanBaseUrl)) return url;

  if (url.startsWith("/uploads/")) {
    return `${cleanBaseUrl}${url}`;
  }

  if (url.includes("/uploads/") && !url.includes(" ") && !url.includes("<")) {
    const parts = url.split("/uploads/");
    return `${cleanBaseUrl}/uploads/${parts.slice(1).join("/uploads/")}`;
  }

  return url;
};

const formatDataUrls = (data) => {
  if (typeof data === "string") {
    if (data.includes("<") && data.includes(">")) {
      if (data.includes("/uploads/") && BASE_URL) {
        const cleanBaseUrl = BASE_URL.replace("/api", "");
        return data.replace(/src=(["'])\/uploads\//g, `src=$1${cleanBaseUrl}/uploads/`);
      }
      return data;
    }

    const formatted = getFullUrl(data);
    if (formatted !== data) return formatted;

    return data;
  }

  if (Array.isArray(data)) {
    return data.map(formatDataUrls);
  }

  if (data !== null && typeof data === "object") {
    const formatted = {};
    for (const key in data) {
      formatted[key] = formatDataUrls(data[key]);
    }
    return formatted;
  }

  return data;
};

export const fetcher = async (url, options = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  let result = await response.json();
  result = formatDataUrls(result);

  if (!response.ok) {
    throw new Error(result.error?.message || result.message || "An error occurred");
  }

  return result;
};

export const api = {
  get: (url, options) => fetcher(url, { ...options, method: "GET" }),
  post: (url, body, options) => fetcher(url, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: (url, body, options) => fetcher(url, { ...options, method: "PUT", body: JSON.stringify(body) }),
  delete: (url, options) => fetcher(url, { ...options, method: "DELETE" }),
};
