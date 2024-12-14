import React from "react";

const ReviewShow: React.FC = ({item}) => {
    console.log(item);
    
  return (
    <div>
      <h2 className="text-center text-3xl ">All Review </h2>
      <div className="divider divider-start divider-neutral text-black"></div>

      <div>
        <div className="flex space-x-4 text-xl ">
          <div className="avatar">
            <div className="w-12 rounded-full ml-4">
              <img src={reviewdata.photo} alt="" />
            </div>
          </div>
          <h2>
            hello
            <br />
            <span className="text-sm">hello</span>
          </h2>
        </div>
        <h2 className="text-sm ml-20">description</h2>
        <h2 className="text-xl ml-20">reating</h2>
      </div>
    </div>
  );
};

export default ReviewShow;
