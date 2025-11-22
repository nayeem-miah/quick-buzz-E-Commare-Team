import axios, { AxiosInstance } from "axios";

const axiosPublic: AxiosInstance = axios.create({
  // baseURL: 'https://quick-bazz.vercel.app'
  baseURL: "http://localhost:3000/api/v1",
});


const useAxiosPublic = (): AxiosInstance => {
  return axiosPublic;
};

export default useAxiosPublic;
