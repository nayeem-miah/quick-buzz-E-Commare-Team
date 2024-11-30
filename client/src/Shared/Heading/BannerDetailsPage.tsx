
const BannerDetailsPage = ({
  headingText,
  subheadingText,

}: {
  headingText: string;
  subheadingText: string;
}) => {
  return (
    <div>
      <div className="relative w-full h-[600px] ">
       
        {/* <div className="w-full h-full  bg-gradient-to-b from-[#5eaaf590] absolute top-0"></div> */}
        <div className="w-full h-full bg-gradient-to-b  from-[#b4b0b09f] to-[#ffffff] dark:to-[#111827] absolute top-0"></div>
        <div className="absolute w-full h-full flex justify-center items-center top-0">
          <div className="text-center space-y-2">
            <h1 className="lg:text-6xl text-4xl   font-bold dark:text-white text-gray-700">
              {headingText}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {subheadingText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerDetailsPage;
