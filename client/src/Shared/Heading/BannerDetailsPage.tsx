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
      <div className="relative w-full lg:h-[600px] md:h-[600px] sm:h-[500px]">
        <img
          src={imageURL}
          alt="banner"
          className="object-cover w-full h-full"
        />

      
        <div className="w-full h-full bg-gradient-to-b  from-[#b4b0b09f] to-[#ffffff] dark:to-[#111827] absolute top-0"></div>
        <div className="absolute w-full h-full flex justify-center items-center top-0">
          <div className="text-center space-y-2">
            <h1 className="lg:text-6xl text-4xl text-[#42A5F5]  font-bold">
           
                {headingText}
             
            </h1>

            <p className="text-lg text-gray-700 dark:text-gray-300">
              
                {subheadingText}
              
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerDetailsPage;
