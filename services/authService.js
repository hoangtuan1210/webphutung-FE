import { api } from "@/utils/api";

export const authService = {

  login: (data) => {
    return api.post("/auth/login", data);
  },

  register: (data) => {
    return api.post("/auth/register", data);
  },

  forgotPassword: (email) => {
    return api.post("/auth/forgot-password", { email });
  },
}