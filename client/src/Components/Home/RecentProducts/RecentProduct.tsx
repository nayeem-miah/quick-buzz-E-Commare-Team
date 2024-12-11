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

type ChildComponentProps = {
  recentData: Product[];
  isLoading: boolean;
};

const RecentProduct: React.FC<ChildComponentProps>= ({recentData, isLoading}) => {
  console.log(recentData);
 
  if (isLoading) return <LoadingSpinner />;
  //   if(isError) return <div>error</div>
  return (
    <div>
      <Heading title={"recent data"} subtitle={""} />
      {recentData.length == 0 ? (
        <NoData />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-4">
          {recentData?.map(
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
