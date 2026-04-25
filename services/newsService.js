import { api } from "@/utils/api";

export const newsService = {
  getPublicNews: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/news/public?${queryString}`);
  },

  getFeaturedNews: async () => {
    return api.get("/news/featured");
  },

  getNewsBySlug: async (slug) => {
    return api.get(`/news/slug/${slug}`);
  },
};
