import axios, { AxiosInstance } from "axios";
import { API_BASE_URL } from "../utils/api";

const axiosPublic: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
});


axiosPublic.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const useAxiosPublic = (): AxiosInstance => {
  return axiosPublic;
};

export default useAxiosPublic;
