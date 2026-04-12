import { api } from "@/utils/api";

export const userService = {
  getProfile: () => {
    return api.get("/users/profile");
  },

  updateProfile: (data) => {
    return api.put("/users/profile", data);
  },

  changePassword: (data) => {
    return api.post("/auth/change-password", data);
  },

  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/orders?${query}`);
  },

  getAddresses: () => {
    return api.get("/addresses");
  },

  createAddress: (data) => {
    return api.post("/addresses", data);
  },

  getAddressById: (id) => {
    return api.get(`/addresses/${id}`);
  },

  updateAddress: (id, data) => {
    return api.put(`/addresses/${id}`, data);
  },

  deleteAddress: (id) => {
    return api.delete(`/addresses/${id}`);
  },

  setDefaultAddress: (id) => {
    return api.put(`/addresses/${id}/set-default`);
  },

};
