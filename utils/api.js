const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-feichi.htechp.com/api";

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

  const result = await response.json();

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
