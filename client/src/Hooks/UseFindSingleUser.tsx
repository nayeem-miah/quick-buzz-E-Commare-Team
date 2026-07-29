import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "./UseAxiosSecure";

export interface User {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    image?: string;
    status?: string;
    [key: string]: unknown;
}

interface ApiResponse<T> {
    statusCode?: number;
    success?: boolean;
    message?: string;
    data: T;
}

const useFetchSingleUser = (email: string) => {
    const axiosSecure = UseAxiosSecure();

    const { data: singleUser, isLoading: loading } = useQuery<User>({
        queryKey: [email, 'singleUserInfo'],
        queryFn: async () => {
            if (!email) {
                throw new Error("Email is required");
            }
            const res = await axiosSecure.get<ApiResponse<User>>(`/users/${email}`);
            return res?.data?.data;
        },
        enabled: !!email,
    });

    return { singleUser, loading };
};

export default useFetchSingleUser;
