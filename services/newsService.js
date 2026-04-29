import { api } from "@/utils/api";

export const newsService = {
  getPublicNews: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/news/public?${queryString}`);
  },

  getFeaturedNews: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/news/featured?${queryString}`);
  },

  getNewsBySlug: async (slug) => {
    return api.get(`/news/slug/${slug}`);
  },
};
