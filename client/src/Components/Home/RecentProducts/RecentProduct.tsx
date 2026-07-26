/* eslint-disable @typescript-eslint/no-explicit-any */

import Card from '../../../Pages/Product/Card';
import Heading from '../../../Shared/Heading/Heading';
import LoadingSpinner from '../../../Shared/Loading';
import NoData from '../../../Shared/NoDataFound/NoData';

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
  recentData: any;
  isLoading: boolean;
};

const RecentProduct: React.FC<ChildComponentProps> = ({
  recentData,
  isLoading,
}) => {
  if (isLoading) return <LoadingSpinner />;

  return (
    <div id="recentData" className="space-y-6">
      <Heading
        title={'New Arrivals'}
        subtitle={'Latest approved products ready for quick shopping.'}
      />
      {recentData.length == 0 ? (
        <NoData />
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {recentData?.map(
            (product: Product) =>
              product?.adminIsApproved === 'approve' && (
                <Card product={product} key={product._id} />
              ),
          )}
        </div>
      )}
    </div>
  );
};

export default RecentProduct;
