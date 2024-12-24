import { FaUserAlt, FaDollarSign } from "react-icons/fa";
import { BsFillCartPlusFill } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/UseAuth";
import useAxiosPublic from "../../../Hooks/UsePublic";
import EnhancedBarChart from "./Chart/EnhancedBarChart";

interface StatData {
  totalSale: number;
  userCount: number;
  bookingCount: number;
  roomCount: number;
  chartData: any[];
}

const HostHome: React.FC = () => {
  // Dummy static data for statics page
  const statData: StatData = {
    totalSale: 12000,
    userCount: 452,
    bookingCount: 148,
    roomCount: 85,
    chartData: [], // Add dummy data if needed for the chart
  };

  const { user } = useAuth();
  const axiosSecure = useAxiosPublic();

  // Fetch products for the specific host email
  const { data: productsData = [] } = useQuery({
    queryKey: ["products"], // Include email in queryKey
    queryFn: async () => {
      const res = await axiosSecure.get(`/host-product/${user?.email}`);
      // return res.data;
      console.log(res);
    },
  });

  // total price
  //  // Fetch payment history using email
  // const { data: PaymentHistoryData = [], isLoading } = useQuery({
  //   queryKey: ["PaymentHistoryData", email], // email as dependency
  //   queryFn: async () => {
  //     const res = await axiosSecure.get(`/host-payment-history/${email}`);
  //     return res.data;
  //   },
  // });

  // // Filter for successful payments made to this host email
  // const successfulPayments = PaymentHistoryData.filter(
  //   (item: { status: string; hostEmail: string[] }) =>
  //     item.status === "success" && item.hostEmail.some((Host) => Host === email)
  // );
  // console.log(successfulPayments);

  // // Count the number of successful payments
  // const successfulPaymentCount = successfulPayments.length;

  // // Calculate the total amount of successful payments
  // const totalAmount = successfulPayments.reduce(
  //   (total: number, item: { totalPrice: number }) => total + item.totalPrice,
  //   0
  // );

  // // Output
  // console.log("Successful Payment Count:", successfulPaymentCount);
  // console.log("Total Amount of Successful Payments:", totalAmount);

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
                ${statData.totalSale}
              </h4>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
            <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-[#0A0D34] to-blue-400 text-white shadow-blue-500/40">
              <BsFillCartPlusFill className="w-6 h-6 text-white" />
            </div>
            <div className="p-4 text-right">
              <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
                Total Bookings
              </p>
              <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
                {/* {data?.length} */}
              </h4>
            </div>
          </div>

          {/* Users Card */}
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
            <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-[#221537] to-green-400 text-white shadow-green-500/40">
              <FaUserAlt className="w-6 h-6 text-white" />
            </div>
            <div className="p-4 text-right">
              <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
                Total User
              </p>
              <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
                user
              </h4>
            </div>
          </div>

          {/* Total Rooms */}
        </div>

        <div className="mb-4 grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3">
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2">
            <div className="p-4 text-center ">
              <EnhancedBarChart />
            </div>
          </div>
          <div>
            pi chart
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostHome;
