/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import useAxiosPublic from "../../Hooks/UsePublic";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/UseAuth";
import { useQuery } from "@tanstack/react-query";
import useFetchSingleUser from "../../Hooks/UseFindSingleUser";
import { Link } from "react-router-dom";
import { ImSpinner } from "react-icons/im";
import LoadingSpinner from "../../Shared/Loading";

interface ReviewItem {
  _id?: string;
  id?: string;
  photo?: string;
  name?: string;
  comment?: string;
  review?: string;
  rating?: number;
  date?: string;
  timestamp?: string;
}
import { FaStar } from "react-icons/fa";

const Review: React.FC<{ id: string }> = ({ id }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState<string>("");
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { singleUser } = useFetchSingleUser(user?.email as string);
  const name = user?.displayName;
  const photo = user?.photoURL;
  const email = user?.email;

  const handleSubmit = async () => {
    if (rating && review) {
      const currentTime = new Date().toLocaleString();
      const data = {
        rating,
        productid: id,
        review,
        name,
        photo,
        email,
        timestamp: currentTime,
      };
      setLoading(true);
      axiosPublic
        .post("/review", data, {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          if (res.data.statusCode === 201) {
            toast.success("Thank you for your feedback!");
            setLoading(false);
          } else {
            toast.error("Please try again");
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error posting data:", error);
          toast.error("Server error occurred.");
          setLoading(false);
        });
    }
  };

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReview(e.target.value);
  };

  const { data: reviewdata = [], isLoading } = useQuery({
    queryKey: ["review"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/review/${id}`);
      return data.data;
    },
  });
  // console.log(reviewdata);
  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 mt-12">
      <div className="flex flex-col lg:flex-row gap-12 justify-between">
        
        {/* Review Form */}
        <div className="lg:w-1/3 w-full bg-white p-6 md:p-8 shadow-sm border border-gray-100 rounded-3xl h-fit">
          <div className="flex flex-col w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Write a Review
            </h2>
            <p className="text-gray-500 text-sm mb-8">Share your experience with others.</p>
            
            <div className="mb-8">
              <span className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Rating</span>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    title={`Rate ${star} stars`}
                    aria-label={`Rate ${star} stars`}
                    onClick={() => handleRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill={rating && rating >= star ? "#FBBF24" : "#E5E7EB"}
                      className="w-10 h-10 transition-colors duration-200 drop-shadow-sm"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <span className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Your Feedback</span>
                <textarea
                  placeholder="What did you like or dislike?"
                  value={review}
                  onChange={handleInputChange as any}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-gray-50/50 resize-none h-32 text-gray-800 shadow-inner"
                />
              </div>
              
              {user ? (
                <button
                  onClick={handleSubmit}
                  disabled={singleUser?.role === "admin" || singleUser?.role === "Host"}
                  className={`w-full text-white font-semibold shadow-md shadow-blue-500/20 py-4 rounded-xl transition-all duration-300 ease-in-out ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5"
                  } ${
                    singleUser?.role === "Host" || singleUser?.role === "admin"
                      ? "opacity-50 cursor-not-allowed hover:translate-y-0"
                      : ""
                  }`}
                >
                  {loading ? (
                    <ImSpinner size={20} className="animate-spin mx-auto" />
                  ) : (
                    "Submit Review"
                  )}
                </button>
              ) : (
                <Link to={"/login"} className="block w-full">
                  <button className="w-full text-white font-semibold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/30 py-4 rounded-xl transition-all duration-300 ease-in-out hover:-translate-y-0.5">
                    Login to Review
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Display All Reviews */}
        <div className="lg:w-2/3 w-full bg-white p-6 md:p-8 border border-gray-100 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">
              Customer Reviews
            </h2>
            <span className="bg-blue-100 text-blue-700 font-bold px-4 py-1.5 rounded-full text-sm">
              {reviewdata?.length || 0} Reviews
            </span>
          </div>
          
          <div className="space-y-8">
            {reviewdata?.length > 0 ? reviewdata.map((item: ReviewItem) => (
              <div key={item._id || item.id} className="pb-8 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex items-start gap-5">
                  <img src={item.photo} alt={item.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex text-yellow-400 text-sm">
                            {Array.from({ length: 5 }, (_, index) => (
                              <FaStar key={index} className={index < (item.rating ?? 0) ? "text-yellow-400 drop-shadow-sm" : "text-gray-200"} />
                            ))}
                          </div>
                          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">{item.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600 text-base leading-relaxed bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                      {item.review}
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <FaStar className="text-gray-300 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-500 max-w-sm">Be the first to share your experience with this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
