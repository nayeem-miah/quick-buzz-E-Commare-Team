import React from "react";
import { useParams } from "react-router-dom";
import useAxiosPublic from "../../Hooks/UsePublic";
import { useQuery } from "@tanstack/react-query";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const axiosPublic = useAxiosPublic();

  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/product/${id}`);
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div>
      <h1>{product?.name || "Product Name"}</h1>
      <p>{product?.description || "No description available"}</p>
      <p>Price: {product?.price || "N/A"}</p>
    </div>
  );
};

export default ProductPage;
