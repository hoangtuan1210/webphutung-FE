import { api } from "@/utils/api";

export const categoryService = {
  getPublicCategories: (depth = 3) => {
    return api.get(`/categories?includeChildren=${depth}`);
  },

  getCategories: () => {
    return api.get("/categories");
  },

  getCategoriesFlat: () => {
    return api.get("/categories/flat");
  },

  getCategoryBySlug: (slug) => {
    return api.get(`/categories/slug/${slug}`);
  },

  getCategoryById: (id) => {
    return api.get(`/categories/${id}`);
  },
};
