import axios, { AxiosInstance } from "axios";
import { API_BASE_URL } from "../utils/api";

const axiosPublic: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
});


const useAxiosPublic = (): AxiosInstance => {
  return axiosPublic;
};

export default useAxiosPublic;
