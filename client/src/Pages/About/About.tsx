import { Link } from "react-router-dom";
import Heading from "../../Shared/Heading/Heading";
import aboutImage from "../../assets/Image/about.jpg";
import nayeemImage from "../../assets/Image/Nayeem.png";

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
      portfolio: "",
      education: "B.Sc. in Computer Science",
    },
    {
      name: "MD Rakibul Hasan",
      position: "MERN Stack Developer",
      image: nayeemImage,
      portfolio: "",
      education: "B.Sc. in Software Engineering",
    },
  ];

  return (
    <div className="bg-white text-gray-800 font-sans">
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
      <section className="my-10 px-4 md:px-0">
        <Heading
          title="Our Services"
          subtitle="We offer a diverse range of high-quality products, backed by fast and reliable delivery, secure payment methods, and 24/7 customer support. Enjoy exclusive deals, hassle-free returns, and easy refunds."
        />
        <div className="container mx-auto bg-white text-black">
          <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-6 animate-slideIn">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                Best place to choose your{" "}
                <span className="text-blue-500">clothes</span>
              </h2>
              <p className="text-gray-600">
                Discover an extensive selection of clothing, curated to fit
                every style and occasion. We bring you the latest trends with
                uncompromised quality.
              </p>
              <button
                className=" px-6 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
               border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-1050"
              >
                Shop Now
              </button>
            </div>
            <div className="lg:w-1/2 mt-6 lg:mt-0">
              <img
                className="w-full lg:max-w-3xl rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300"
                src="https://merakiui.com/images/components/Catalogue-pana.svg"
                alt="Catalogue"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Our mission Section */}
      <section className="my-10 px-4 md:px-0 bg-white">
        <Heading title={"Our mission"} subtitle={""}/>
        <div className="container mx-auto text-black py-16 flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Image on the Left */}
          <div className="lg:w-1/2">
            <img
              className="w-full lg:max-w-lg rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300"
              src="https://merakiui.com/images/components/Catalogue-pana.svg"
              alt="Our Services Catalogue"
            />
          </div>

          {/* Text Content on the Right */}
          <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Discover the Best in{" "}
              <span className="text-blue-500">Clothing</span>
            </h2>
            <p className="text-gray-600">
              Explore a wide range of clothing that suits every style and
              occasion. With our commitment to quality, enjoy the latest trends
              with uncompromised value.
            </p>
            <Link to="/shop">
              <button className="mt-3 px-6 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105">
                Order Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section id="meet" className="bg-gray-50 py-12 animate-slideIn">
        <Heading title="Meet Our Team" subtitle="" />
        <div className="container mx-auto px-6 text-center">
          <div className="grid gap-8 md:grid-cols-2">
            {teamMembers.map((member, index) => (
              <Link
                to={member.portfolio}
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 hover:shadow-xl transform hover:scale-105"
              >
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 mb-4 rounded-full overflow-hidden ring ring-offset-2 ring-blue-400">
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
