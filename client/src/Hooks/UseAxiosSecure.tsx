
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
const axiosSecure = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
});

const UseAxiosSecure = () => {
    return axiosSecure;
};

export default UseAxiosSecure;
