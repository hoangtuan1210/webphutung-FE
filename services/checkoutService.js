import { api } from "@/utils/api";

export const checkoutService = {
  createGuestOrder: (data) => {
    return api.post("/orders/guest", data);
  },
  createOrder: (data) => {
    return api.post("/orders", data);
  }
};
