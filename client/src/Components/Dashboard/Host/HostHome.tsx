/* eslint-disable @typescript-eslint/no-explicit-any */

import { FaUserAlt, FaDollarSign } from 'react-icons/fa';
import { BsFillCartPlusFill, BsFillHouseDoorFill } from 'react-icons/bs';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import MyChartComponent from './HostChart';
import ApexCart from '../Admin/Chart/Simple';

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




       
  const axiosSecure = UseAxiosSecure();
  const { data: users = [] } = useQuery({
    queryKey: ["alluser"],
    queryFn: async () => {
      const res = await axiosSecure.get("/alluser");
      return res.data;
    },
  });

  // total product
  // get all product
  const { data } = useQuery({
    queryKey: ["allProduct"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      return res.data;
    },
  });






  return (
    <div>
      <div className='mt-12'>
        {/* Small cards */}
        <div className='mb-12 grid gap-y-10 gap-x-6  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
          {/* Sales Card */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md'>
            <div className='bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-[#0A0D34] to-orange-400 text-white shadow-orange-500/40'>
              <FaDollarSign className='w-6 h-6 text-white' />
            </div>
            <div className='p-4 text-right'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600'>
                Total Sales
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900'>
                ${statData.totalSale}
              </h4>
            </div>
          </div>

           {/* Total Bookings */}
           <div className='relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md'>
            <div className='bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-[#0A0D34] to-blue-400 text-white shadow-blue-500/40'>
              <BsFillCartPlusFill className='w-6 h-6 text-white' />
            </div>
            <div className='p-4 text-right'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600'>
                Total Bookings
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900'>
                {data?.length}
              </h4>
            </div>
          </div>

          {/* Users Card */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md'>
            <div className='bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-[#221537] to-green-400 text-white shadow-green-500/40'>
              <FaUserAlt className='w-6 h-6 text-white' />
            </div>
            <div className='p-4 text-right'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600'>
                Total User
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900'>
                {users?.length}
              </h4>
            </div>
          </div>

         

          {/* Total Rooms */}
       
        </div>

        <div className='mb-4 grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3'>
      
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2'>
            <div className='p-4 text-center '>
            <MyChartComponent></MyChartComponent>
            </div>
          </div>
          <div >
           <ApexCart data={data} users={users}></ApexCart>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default HostHome;
