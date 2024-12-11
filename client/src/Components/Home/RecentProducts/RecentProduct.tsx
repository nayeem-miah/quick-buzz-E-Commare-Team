import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/UsePublic";
import LoadingSpinner from "../../../Shared/Loading";
import Heading from "../../../Shared/Heading/Heading";
import NoData from "../../../Shared/NoDataFound/NoData";
import Card from "../../../Pages/Product/Card";

interface Product {
  _id: number;
  brandName: string;
  productImage: string;
  name: string;
  price: number;
  description: string;
  adminIsApproved: string;
  discount: number;
  productTitle: string;
}

const RecentProduct: React.FC = () => {
  const axiosPublic = useAxiosPublic();

  //   data fetching using tanstack query
  const { data: RecentData = [], isLoading } = useQuery({
    queryKey: ["productData"],
    queryFn: async () => {
      const res = await axiosPublic.get("/recent-product");
      return res.data;
    },
  });

  console.log(RecentData, "recent 20 data");
  if (isLoading) return <LoadingSpinner />;
  //   if(isError) return <div>error</div>
  return (
    <div>
      <Heading title={"recent data"} subtitle={""} />
      {RecentData.length == 0 ? (
        <NoData />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-4">
          {RecentData?.map(
            (product: Product) =>
              product?.adminIsApproved === "approve" && (
                <Card product={product} key={product._id} />
              )
          )}
        </div>
      )}
    </div>
  );
};

export default RecentProduct;
