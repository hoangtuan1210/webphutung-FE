export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const formatDataUrls = (data) => {
  if (typeof data === "string") {
    if (data.startsWith("/uploads/") && BASE_URL) {
      return `${BASE_URL.replace('/api', '')}${data}`;
    }
    if (data.includes('src="/uploads/') && BASE_URL) {
      return data.replace(/src="\/uploads\//g, `src="${BASE_URL.replace('/api', '')}/uploads/`);
    }
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
