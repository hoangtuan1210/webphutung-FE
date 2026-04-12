import { api } from "@/utils/api";

export const orderService = {
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/orders?${query}`);
  },

  getOrderById: (id) => {
    return api.get(`/orders/${id}`);
  },
};
