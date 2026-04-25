import { api } from "@/utils/api";

export const videoService = {
  getActiveVideos: () => {
    return api.get("/videos/active");
  },
};
