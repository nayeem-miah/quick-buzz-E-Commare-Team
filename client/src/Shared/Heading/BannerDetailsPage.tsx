const BannerDetailsPage = ({
  headingText,
  subheadingText,
  imageURL,
}: {
  headingText: string;
  subheadingText: string;
  imageURL: string;
}) => {
  return (
    <div>
      <div className="relative w-full h-[600px] ">
        <img
          src={imageURL}
          alt="banner"
          className="object-cover w-full h-full"
        />

        {/* <div className="w-full h-full  bg-gradient-to-b from-[#5eaaf590] absolute top-0"></div> */}
        <div className="w-full h-full bg-gradient-to-b  from-[#b4b0b09f] to-[#ffffff] dark:to-[#111827] absolute top-0"></div>
        <div className="absolute w-full h-full flex justify-center items-center top-0">
          <div className="text-center space-y-2">
            <h1 className="lg:text-6xl text-4xl   font-bold">
              <span className="bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 text-transparent bg-clip-text animate-gradient">
                {headingText}
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-blue-800 to-green-600 text-transparent bg-clip-text animate-gradient">
                {subheadingText}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerDetailsPage;
