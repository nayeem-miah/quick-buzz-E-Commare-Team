import React, { useState } from 'react';
import useAxiosPublic from '../../Hooks/UsePublic';
import toast from 'react-hot-toast';
import useAuth from '../../Hooks/UseAuth';
import { useQuery } from '@tanstack/react-query';

const Review: React.FC = ({id}) => {
 
    
    const [rating, setRating] = useState<number | null>(null); 
    const [review, setReview] = useState<string>(''); 
    const axiosPublic = useAxiosPublic();
    const {user} = useAuth();
    const name = user?. displayName;
    const photo = user?.photoURL;
    const email = user?.email;

   
    const handleSubmit = async () => {
        if (rating && review) {
            const currentTime = new Date().toISOString();
            const data = { 
                rating, 
                productid:id,
                review, 
                name,
                photo,
                email,
                timestamp: currentTime 
            };
           console.log(data);
           
            
            axiosPublic
            .post("/reviews", data, {
                headers: { 'Content-Type': 'application/json' } 
            })
            .then((res) => {
                console.log(res);
                if (res.status === 201) {
                    toast.success("Thank you for your feedback!");
                } else {
                    toast.error("Please try again");
                }
            })
            .catch((error) => {
                console.error("Error posting data:", error);
                toast.error("Server error occurred.");
            });
        
    };
}
    
    const handleRating = (rate: number) => {
        setRating(rate);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReview(e.target.value);
    };

  
     
  const {
    data: reviewdata = [] } = useQuery({
    queryKey: ["review",],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/review/${id}`);
    //   return data;
    console.log(data);
    
    },
   
  });





    return (
        <div className="flex flex-col items-center w-full">
            <h2 className="text-3xl font-semibold text-center">
                Your opinion matters!
            </h2>
            <div className="flex flex-col items-center py-6 space-y-3">
                <span className="text-center">How was your experience?</span>
                <div className="flex space-x-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            title={`Rate ${star} stars`}
                            aria-label={`Rate ${star} stars`}
                            onClick={() => handleRating(star)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill={rating && rating >= star ? 'yellow' : 'gray'}
                                className="w-10 h-10"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                        </button>
                    ))}
                </div>
            </div>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Type here"
                    value={review}
                    onChange={handleInputChange}
                    className="input input-bordered w-full max-w-xs"
                />
                <button
                    onClick={handleSubmit}
                    className="mt-2 px-10 py-2 text-2xl text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
                      border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                >
                    Review
                </button>
            </div>
        </div>
    );
};

export default Review;
