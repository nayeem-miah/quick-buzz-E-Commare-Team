/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
  
import img1 from '../../../assets/banner/Delivari.jpg'
import img2 from '../../../assets/banner/primium.jpg'
import img3 from '../../../assets/banner/comtact.jpg'
import { Link } from "react-router-dom";
 

const Uniqe: React.FC = () => {
  return (
    <div>
      <div className="unique-section bg-gray-100 py-12 px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Our Unique Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="feature-card bg-white rounded-lg shadow-lg p-6">
            <img
              src={img1}
              alt="Fast Delivery"
              className="w-44 h-32 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
              Fast Delivery
            </h3>
            <p className="text-gray-600 text-center">
              Get your orders delivered within 24 hours with our lightning-fast
              delivery system.
            </p>
          </div>
        {/*  */}
          {/* Feature 2 */}
       <Link        
        to='/product'
       
       >
            <div className="feature-card bg-white rounded-lg hover:translate-y-2 shadow-lg p-6">
            <img
              src={img2}
              alt="Premium Quality"
              className="w-44 h-32 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
              Premium Quality
            </h3>
            <p className="text-gray-600 text-center">
              We ensure top-notch quality in all our products to satisfy our
              customers.
            </p>
          </div>
       </Link>

          {/* Feature 3 */}
         <Link 
         to='/contact'
         >
         
         <div className="feature-card bg-white rounded-lg shadow-lg p-6">
            <img
              src={img3}
              alt="24/7 Support"
              className="w-44 h-32 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
              24/7 Support
            </h3>
            <p className="text-gray-600 text-center">
              Our support team is available round-the-clock to assist you with
              any queries.
            </p>
          </div>
         </Link>
        </div>
      </div>
    </div>
  );
};

export default Uniqe;
