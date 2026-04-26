const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://feichi-api.htechsoft.vn";

const formatDataUrls = (data) => {
  if (typeof data === "string") {
    if (data.startsWith("/uploads/")) {
      return `${BASE_URL}${data}`;
    }
    if (data.includes('src="/uploads/')) {
      return data.replace(/src="\/uploads\//g, `src="${BASE_URL}/uploads/`);
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
