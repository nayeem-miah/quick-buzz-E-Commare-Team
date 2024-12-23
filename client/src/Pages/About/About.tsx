import { Link } from "react-router-dom";
import Heading from "../../Shared/Heading/Heading";
import aboutImage from "../../assets/Image/about.jpg";
import Services from "../../assets/Image/service.jpg";
import mission from "../../assets/Image/mission.jpg";
import nayeemImage from "../../assets/Image/Nayeem.png";
import rakibImage from "../../assets/Image/rakib1.jpg";
import { useEffect } from "react";
import "aos/dist/aos.css";
import Aos from "aos";
interface TeamMember {
  name: string;
  position: string;
  image: string;
  portfolio: string;
  education: string;
}

const About: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "MD Nayeem Miah",
      position: "MERN Stack Developer",
      image: nayeemImage,
      portfolio: "https://github.com/nayeem-miah",
      education: "Diploma in Engineering in Computer Science",
    },
    {
      name: "MD Rakibul Hasan",
      position: "MERN Stack Developer",
      image: rakibImage,
      portfolio: "https://github.com/rakibul561",
      education: "Diploma in Engineering in Computer Science",
    },
  ];

  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <div className=" text-gray-800 font-sans m-4">
      {/* Banner */}
      <div
        className="w-full h-[400px] md:h-[500px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${aboutImage})` }}
      >
        <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
          <div className="text-center text-white space-y-4 animate-fadeIn">
            <h1 className="text-3xl md:text-4xl font-semibold">About Us</h1>
            <p className="text-base md:text-lg max-w-xl mx-auto">
              Our mission is to be the leading online shopping destination,
              delivering exceptional service, prioritizing quality, and offering
              unparalleled convenience to our customers.
            </p>
            <a href="#meet">
              <button
                className="mt-3 px-6  py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
               border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-1050"
              >
                Meet Our Team
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Our Services */}
      <section className="my-10 px-4 md:px-0" data-aos="flip-left">
        <Heading
          title="Our Services"
          subtitle="We offer a diverse range of high-quality products, backed by fast and reliable delivery, secure payment methods, and 24/7 customer support. Enjoy exclusive deals, hassle-free returns, and easy refunds."
        />
        <div className="container mx-auto text-black py-10 flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
          <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-6 animate-slideIn">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                Explore Our Range of Quality Services
              </h2>
              <p className="text-gray-600">
                Discover an extensive selection of clothing, curated to fit
                every style and occasion. We bring you the latest trends with
                uncompressed quality.
              </p>
              <Link to={"/product"}>
                <button
                  className=" px-6 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
               border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-1050"
                >
                  Shop Now
                </button>
              </Link>
            </div>
            <div className="lg:w-1/2">
              <img
                className="w-full lg:max-w-lg rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300"
                src={Services}
                alt="Services"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Our mission Section */}
      <section className="my-10 px-4 md:px-0 " data-aos="flip-left">
        <Heading
          title={"Our mission"}
          subtitle={
            "Our mission is to redefine online shopping by offering a curated collection of products that meet the highest standards of quality and affordability, backed by a dedication to transparency and customer care. We strive to empower our customers with an enjoyable, convenient, and secure shopping experience that keeps them returning time and again."
          }
        />
        <div className="container mx-auto text-black py-10 flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Image on the Left */}
          <div className="lg:w-1/2">
            <img
              className="w-full lg:max-w-lg rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300"
              src={mission}
              alt="Our mission"
            />
          </div>

          {/* Text Content on the Right */}
          <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Our Mission: Delivering Excellence in Every Order
            </h2>
            <p className="text-gray-600">
              <ul className="list-disc pl-5 text-left">
                <li>Driven by Purpose, Focused on You</li>
                <li>Empowering You Through Exceptional Shopping</li>
                <li>Committed to Delivering the Best Shopping Experience</li>
              </ul>
            </p>

            <Link to="/product">
              <button className="mt-3 px-6 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105">
                Order Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section id="meet" className=" py-8 animate-slideIn" data-aos="flip-left">
        <Heading title="Meet Our Team" subtitle="" />
        <div className="container mx-auto px-6 text-center">
          <div className="grid gap-8 md:grid-cols-2">
            {teamMembers.map((member, index) => (
              <Link
                to={member.portfolio}
                key={index}
                className=" p-6 rounded-lg shadow-lg transition-transform duration-300 hover:shadow-xl transform hover:scale-105"
              >
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 mb-4 rounded-full overflow-hidden ring ring-offset-2 ring-purple-500   hover:shadow-[0_0_20px_5px_rgba(255,165,0,0.8)]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700">
                    {member.name}
                  </h3>
                  <p className="text-gray-500">{member.position}</p>
                  <p className="text-sm text-gray-400 italic">
                    {member.education}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
