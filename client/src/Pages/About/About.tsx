import { Link } from "react-router-dom";
import Heading from "../../Shared/Heading/Heading";
import about from "../../assets/Image/about.jpg";
import nayeem from "../../assets/Image/Nayeem.png";
const About: React.FC = () => {
  const teamMembers = [
    {
      name: "MD Nayeem Miah",
      position: "MERN Stack Developer",
      image: `${nayeem}`,
      portfolio: ""
    },
    {
      name: "MD Rakibul Hasan",
      position: "MERN Stack Developer",
      image: `${nayeem}`,
      portfolio: "",
    },
  ];

  return (
    <div className="">
      {/* banner  */}
      <div
        className="w-full bg-center bg-cover h-[400px] md:h-[500px]"
        style={{
          backgroundImage: `url(${about})`,
        }}
      >
        <div className="flex items-center justify-center w-full h-full bg-gray-900/40">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-white lg:text-4xl">
              About Now
            </h1>
            <p className="text-white md:text-xl sm:text-xs text-center">
              Our mission is to be the leading online shopping destination,
              delivering exceptional service, prioritizing quality, and offering
              unparalleled convenience to our customers, making every purchase a
              delightful experience
            </p>
            <Link to={""}>
              <button
                className="relative my-3  px-4 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
               border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-1050"
              >
                meet our team member
              </button>
            </Link>
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

      {/* meet our team member */}
      <div>
        <Heading title={"Meet Our Team Member"} subtitle={""} />

        <section className="bg-gray-100 py-12">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Meet Our Team
            </h2>
            <div className="grid gap-8 md:grid-cols-2 ">
              {teamMembers.map((member, index) => (
                <Link
                  to={`${member?.portfolio}`}
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="avatar">
                    <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
                      <img src={member?.image} />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-700">
                    {member.name}
                  </h3>
                  <p className="text-gray-500">{member?.position}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
