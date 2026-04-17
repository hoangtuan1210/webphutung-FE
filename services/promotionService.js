import { api } from "@/utils/api";


export const promotionService = {
  /** Lấy tất cả promotion banners */
  getPromotions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/promotions${query ? `?${query}` : ""}`);
  },

  /** Lấy promotion banners theo vị trí (ví dụ: home_middle) */
  getPromotionsByPosition: (position) => {
    return api.get(`/promotions?position=${position}&isActive=true`);
  },

  /** Lấy promotion banner theo ID */
  getPromotionById: (id) => {
    return api.get(`/promotions/${id}`);
  },
};
