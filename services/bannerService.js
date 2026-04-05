import { api } from "@/utils/api";

export const bannerService = {
  getBanners: () => {
    return api.get("/banners");
  },

  getBannerById: (id) => {
    return api.get(`/banners/${id}`);
  },
};
