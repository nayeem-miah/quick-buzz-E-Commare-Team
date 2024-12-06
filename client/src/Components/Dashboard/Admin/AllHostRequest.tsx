import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/UsePublic";
import Heading from "../../../Shared/Heading/Heading";
import LoadingSpinner from "../../../Shared/Loading";
import { MdDeleteForever } from "react-icons/md";


interface SellerDetails {
    sellerName: string;
    sellerEmail: string;
    sellerPhoto: string;
    imageUrl: string;
    mobile: number;
    reason:string;
    other:string;
    address:string;
    _id:number;
    
}
const AllHostRequest: React.FC = () => {
  const axiosPublic = useAxiosPublic();
  //    get host request data
  const { data: sellerData = [], isLoading } = useQuery({
    queryKey: ["sellerData"],
    queryFn: async () => {
      const res = await axiosPublic.get("/seller");
      return res.data;
    },
  });
//   console.log(sellerData);


// delete
const handleDelete =(id:any)=>{
    console.log(id);
}


  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <Heading title={"All seller request"} subtitle={""} />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-400 text-white">
            <tr>
              <th className="py-3 px-4 text-sm font-medium text-left">sl</th>
              <th className="py-3 px-4 text-sm font-medium text-left">Name</th>
              <th className="py-3 px-4 text-sm font-medium text-left">email</th>
              {/* <th className="py-3 px-4 text-sm font-medium text-left">passport img</th> */}
              <th className="py-3 px-4 text-sm font-medium text-left">
                status
              </th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                delete
              </th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {sellerData?.map((sellerData: SellerDetails, id: number) => (
              <tr
                key={sellerData._id}
                className="border-b hover:bg-gray-50 transition duration-300"
              >
                <td className="py-4 px-4 text-sm text-gray-600">
                  {(id = id + 1)}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {sellerData?.sellerName}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  ${sellerData?.sellerEmail}
                </td>
               
                {/* <td className="py-4 px-4 text-sm text-gray-600">
                  <img
                    src={sellerData?.imageUrl}
                    alt={"no image founded"}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td> */}
                

                <td className="py-4 px-4 text-sm text-gray-600">
                  {sellerData?.adminIsApproved === "approve" ? (
                    "Approve"
                  ) : (
                    <button
                      onClick={() => {
                        // handleApproved(sellerData);
                      }}
                      className="px-4 sm:py-0 md:py-2 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
                      border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                    >
                      approve 
                    </button>
                  )}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  <button
                    onClick={() => {
                      handleDelete(sellerData?._id);
                    }}
                    className="px-4 py-2   text-2xl rounded-lg hover:text-red-700 transition duration-300 focus:outline-none"
                  >
                    <MdDeleteForever />
                  </button>
                </td>
                <td className="py-4 px-4 text-sm">
                  <button
                    // onClick={() => handleDetailsClick(sellerData)}
                    className="  px-4 sm:py-0 md:py-2 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
                    border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                  >
                     Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
    </div>
  );
};

export default AllHostRequest;
