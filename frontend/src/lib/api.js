import { axiosInstance } from "./axios.js";

export const register = async (registerData) => {
  const response = await axiosInstance.post("/auth/register", registerData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const updatePassword = async (updateData) => {
  const response = await axiosInstance.patch("/auth/update-password", updateData);
  return response.data;
};

export const getAuthUser = async () => {
  const response = await axiosInstance.get("/auth/auth-user");
  return response.data;
};


// API for normal user
export const getAllStores = async () => {
  const response = await axiosInstance.get("/user/getstores");
  return response.data;
};

export const submitRatingRequest = async (submitRatingData) => {
  const response = await axiosInstance.post("/user/ratings", submitRatingData);
  return response.data;
};

export const updateRatingRequest = async (updateRatingData) => {
  const response = await axiosInstance.put("/user/ratings", updateRatingData);
  return response.data;
};


// store owner
export const getAverageRating = async () => {
  const response = await axiosInstance.get("/store-owner/average-rating");
  return response.data;
};

export const getUsersWhoRatedStore = async () => {
  const response = await axiosInstance.get("/store-owner/store-ratings");
  return response.data;
};


// admin

export const addStore = async (payload) => {
  const response = await axiosInstance.post("/admin/addstore", payload);
  return response.data;
};

export const addUser = async (payload) => {
  const response = await axiosInstance.post("/admin/adduser", payload);
  return response.data;
};

export const addAdmin = async (payload) => {
  const response = await axiosInstance.post("/admin/addadmin", payload);
  return response.data;
};

export const getAdminDashboard = async () => {
  const response = await axiosInstance.get("/admin/dashboard");
  return response.data;
};

export const changeRole = async (payload) => {
  const response = await axiosInstance.patch("/admin/change-role", payload);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axiosInstance.get("/admin/users");
  return response.data;
};

export const getAllStoresForAdmin = async () => {
  const response = await axiosInstance.get("/admin/allstores");
  return response.data;
};