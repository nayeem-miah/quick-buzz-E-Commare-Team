import Heading from "../../Shared/Heading/Heading";
import contact from "../Contact/Contact";
const About: React.FC = () => {
  return (
    <div className="">
      {/* banner  */}
      <div
        className="w-full bg-center bg-cover h-[400px] md:h-[500px]"
        style={{
          backgroundImage: `url(${contact})`,
        }}
      >
        <div className="flex items-center justify-center w-full h-full bg-gray-900/40">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-white lg:text-4xl">
              About Now
            </h1>
            <p>Our mission is to be the leading online shopping destination, delivering exceptional service, prioritizing quality, and offering unparalleled convenience to our customers, making every purchase a delightful experience</p>
            <button className="w-full px-5 py-2 mt-4 text-sm font-medium text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
              meet our team member
            </button>
          </div>
        </div>
      </div>
      {/* Our Services */}
      <Heading
        title={"Our Services"}
        subtitle={
          "We offer a diverse range of high-quality products, backed by fast and reliable delivery. With secure payment methods and 24/7 customer support, your shopping experience is smooth and worry-free. Enjoy exclusive deals, hassle-free returns, and easy refunds, making every purchase simple and rewarding"
        }
      />
      <div className=" my-10">
        <div className="container px-6  mx-auto bg-white text-black">
          <div className="items-center lg:flex">
            <div className="w-full lg:w-1/2">
              <div className="lg:max-w-lg">
                <h1 className="text-3xl font-semibold text-gray-800 lg:text-4xl">
                  Best place to choose <br /> your
                  <span className="text-blue-500">clothes</span>
                </h1>
                <p className="mt-3 text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Porro beatae error laborum ab amet sunt recusandae? Reiciendis
                  natus perspiciatis optio.
                </p>
                <button className="w-full px-5 py-2 mt-6 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform bg-blue-600 rounded-lg lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                  Shop Now
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
              <img
                className="w-full h-full lg:max-w-3xl"
                src="https://merakiui.com/images/components/Catalogue-pana.svg"
                alt="Catalogue"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
