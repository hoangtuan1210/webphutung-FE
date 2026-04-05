import { api } from "@/utils/api";

export const categoryService = {
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
