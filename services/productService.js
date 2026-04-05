import { api } from "@/utils/api";

export const productService = {
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/products?${query}`);
  },
  
  getFeaturedProducts: (limit = 10) => {
    return api.get(`/products/featured?limit=${limit}`);
  },

  getTrendingProducts: (limit = 10) => {
    return api.get(`/products/trending?limit=${limit}`);
  },

  getProductBySlug: (slug) => {
    return api.get(`/products/slug/${slug}`);
  },

  getProductById: (id) => {
    return api.get(`/products/${id}`);
  },
};
