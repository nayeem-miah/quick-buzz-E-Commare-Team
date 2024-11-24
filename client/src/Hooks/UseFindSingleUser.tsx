/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "./UseAxiosSecure";

interface User {
    id: string;
    name: string;
    email: string;
    [key: string]: any; 
}

const useFetchSingleUser = (email?: string) => {
    const axiosSecure = UseAxiosSecure();

    const { data: singleUser, isLoading: loading } = useQuery<User>({
        queryKey: [email, 'singleUserInfo'],
        queryFn: async () => {
            if (!email) {
                throw new Error("Email is required");
            }
            const res = await axiosSecure.get<User>(`/single-user/${email}`);
            // console.log("Single User Data:", singleUser);
            return res?.data;
        },
        enabled: !!email, // email না থাকলে query চলবে না
    });

    return { singleUser, loading };
};

export default useFetchSingleUser;
