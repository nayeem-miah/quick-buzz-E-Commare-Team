import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/UseAuth";
import useAxiosPublic from "../../Hooks/UsePublic";
import { ImSpinner } from "react-icons/im";
import SellerStatusView from "./components/SellerStatusView";
import SellerApplyForm from "./components/SellerApplyForm";

const BecomeSellerForm: React.FC = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Fetch current user seller application status
  const { data: sellerRequest = null, isLoading: isStatusLoading, refetch } = useQuery({
    queryKey: ["sellerRequest", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/seller/single-seller/${user?.email}`);
      return res.data.data;
    },
    enabled: !!user?.email,
  });

  if (isStatusLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <ImSpinner className="animate-spin text-orange-500" size={36} />
      </div>
    );
  }

  return (
    <div className="py-2">
      {sellerRequest ? (
        <SellerStatusView sellerRequest={sellerRequest} refetch={refetch} />
      ) : (
        <SellerApplyForm refetch={refetch} />
      )}
    </div>
  );
};

export default BecomeSellerForm;
