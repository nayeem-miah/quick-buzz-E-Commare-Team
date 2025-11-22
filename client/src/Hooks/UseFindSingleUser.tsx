/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "./UseAxiosSecure";

interface User {
    id: string;
    name: string;
    email: string;
    [key: string]: any;
}

const useFetchSingleUser = (email: string) => {
    const axiosSecure = UseAxiosSecure();

    const { data: singleUser, isLoading: loading } = useQuery<User>({
        queryKey: [email, 'singleUserInfo'],
        queryFn: async () => {
            if (!email) {
                throw new Error("Email is required");
            }
            const res = await axiosSecure.get<User>(`/users/${email}`);
            return res?.data?.data;
        },
        enabled: !!email,
    });

    return { singleUser, loading };
};

export default useFetchSingleUser;
