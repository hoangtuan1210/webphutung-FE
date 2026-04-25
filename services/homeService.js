
import { api } from "@/utils/api";

export const homeService = {
  getWhyChooseUs: async () => {
    return {
      success: true,
      data: {
        videoUrl: "https://www.youtube.com/embed/jWjhlpMpetc",
        experienceYears: 10,
        title: "Tại sao nên chọn Feichi",
        description: "Chúng tôi không chỉ bán phụ tùng, chúng tôi cung cấp giải pháp an tâm tuyệt đối cho khách hàng."
      }
    };
  },

  getActiveVideos: async () => {
    return api.get("/videos/active");
  }
};

