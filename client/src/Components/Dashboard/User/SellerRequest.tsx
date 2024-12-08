import React from "react";
import useAuth from "../../../Hooks/UseAuth";
import useAxiosPublic from "../../../Hooks/UsePublic";
import { useQuery } from "@tanstack/react-query";
import Heading from "../../../Shared/Heading/Heading";

const SellerRequest: React.FC = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

 

  //    get host request data in every single email
  const { data: singleSeller = [] } = useQuery({
    queryKey: ["sellerData"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/single-seller/${user?.email}`);
      return res.data;
    },
  });

  return (
    <div>
      <section className="">
        <Heading title={"Seller Request data"} subtitle={""}></Heading>

        <div>
          {singleSeller?.map((singleData: any) => (
            <div className="border border-green-400">{singleData.address}</div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SellerRequest;
