
import axios from 'axios';
// import { useNavigate } from "react-router-dom";
// import UseAuth from "./UseAuth";

const axiosSecure = axios.create({
    baseURL: 'https://quick-bazz.vercel.app',
});

const UseAxiosSecure = () => {
    // const navigate = useNavigate();
    // const { logOut } = UseAuth();

    // useEffect(() => {
    //     // Request interceptor
    //     axiosSecure.interceptors.request.use(
    //         (config: AxiosRequestConfig) => {
    //             const token = localStorage.getItem('access-token');
    //             if (token) {
    //                 config.headers = {
    //                     ...config.headers,
    //                     Authorization: `Bearer ${token}`,
    //                 };
    //             }
    //             return config;
    //         },
    //         (error: AxiosError) => {
    //             return Promise.reject(error);
    //         }
    //     );

    //     // Response interceptor
    //     axiosSecure.interceptors.response.use(
    //         (response: AxiosResponse) => {
    //             return response;
    //         },
    //         async (error: AxiosError) => {
    //             const status = error.response?.status;
    //             // console.log('status error in the interceptors', status);
    //             if (status === 401 || status === 403) {
    //                 // Handle 401 or 403 errors here
    //                 // For example: Redirect to login page
    //                 await logOut();
    //                 navigate('/login');
    //             }
    //             return Promise.reject(error);
    //         }
    //     );
    // }, [logOut, navigate]);

    return axiosSecure;
};

export default UseAxiosSecure;
