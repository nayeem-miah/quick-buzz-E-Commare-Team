
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
const axiosSecure = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
});

axiosSecure.interceptors.request.use(
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

const UseAxiosSecure = () => {
    return axiosSecure;
};

export default UseAxiosSecure;
