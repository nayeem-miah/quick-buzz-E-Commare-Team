import React from "react";
import useAxiosPublic from "../../../Hooks/UsePublic";
import { useQuery } from "@tanstack/react-query";

const MyAddedProduct: React.FC = () => {
  const axiosPublic = useAxiosPublic();
  const { data } = useQuery({
    queryKey: ["allProduct"],
    queryFn: async () => {
      const res = await axiosPublic.get("/products");
      return res.data;
    },
  });

  console.log(data);
  return (
    <div>
      <h3>My add Product {data?.length}</h3>
    </div>
  );
};

export default MyAddedProduct;
