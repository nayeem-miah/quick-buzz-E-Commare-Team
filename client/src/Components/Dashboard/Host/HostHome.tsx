import { FaUserAlt, FaDollarSign } from "react-icons/fa";
import { BsFillCartPlusFill } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/UseAuth";
import useAxiosPublic from "../../../Hooks/UsePublic";
import EnhancedBarChart from "./Chart/EnhancedBarChart";
import LoadingSpinner from "../../../Shared/Loading";
import PiChart from "./Chart/PiChart";

const HostHome: React.FC = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Fetch payment history using email
  const { data: PaymentHistoryData = [], isLoading } = useQuery({
    queryKey: ["PaymentHistoryData"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/payments/host-payment-history/${user?.email}`);
      return res.data.data;
    },
  });

  // successful payment
  const successfulPaymentCount = PaymentHistoryData.filter(
    (item: any) => item.status === "success"
  );
  // Calculate the total amount of successful payments
  const totalAmount = successfulPaymentCount.reduce(
    (total: number, item: { totalPrice: number }) => total + item.totalPrice,
    0
  );
  // console.log("Total Amount of Successful Payments:", totalAmount);

  // get all product
  const { data = [] } = useQuery({
    queryKey: ["allProduct"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/products/host-product/${user?.email}`);
      return res.data.data;
    },
  });

  const adminManageProduct = data.filter(
    (item: any) => item.adminIsApproved === "approve"
  );



  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <div className="mt-12">
        {/* Small cards */}
        <div className="mb-12 grid gap-y-10 gap-x-6  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {/* Sales Card */}
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
            <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-[#0A0D34] to-orange-400 text-white shadow-orange-500/40">
              <FaDollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="p-4 text-right">
              <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
                Total Sales
              </p>
              <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
                ${totalAmount}
              </h4>
            </div>
          </div>

          {/* Total product */}
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
            <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-[#0A0D34] to-blue-400 text-white shadow-blue-500/40">
              <BsFillCartPlusFill className="w-6 h-6 text-white" />
            </div>
            <div className="p-4 text-right">
              <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
                Total product
              </p>
              <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
                {data?.length}
              </h4>
            </div>
          </div>

          {/* admin manage product Card */}
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
            <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-[#221537] to-green-400 text-white shadow-green-500/40">
              <FaUserAlt className="w-6 h-6 text-white" />
            </div>
            <div className="p-4 text-right">
              <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
                Total success product
              </p>
              <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
                {adminManageProduct?.length}
              </h4>
            </div>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3">
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2">
            <div className=" text-center ">
              <EnhancedBarChart />
            </div>
          </div>
          <div className="">
            <PiChart data={data} adminManageProduct={adminManageProduct} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostHome;
