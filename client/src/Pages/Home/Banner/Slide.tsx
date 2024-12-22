interface SlideProps {
    image: string;
  }
  
  const Slide: React.FC<SlideProps> = ({ image }) => {
    return (
      <div
        className="bg-center bg-cover h-[20rem] sm:h-[24rem] md:h-[28rem] lg:h-[32rem] xl:h-[36rem]"
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        <div className="flex items-center justify-center h-full bg-black bg-opacity-30">
          <div className="text-center px-4 sm:px-6 md:px-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white">
              Your Slide Title
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white mt-2">
              Your slide description goes here.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Slide;
  