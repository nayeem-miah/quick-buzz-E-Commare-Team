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
            <Link to="">
              <button className="mt-3 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
                Meet Our Team
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Our Mission */}
      <section className="py-12 bg-gray-50 animate-slideIn">
        <Heading title="Our Mission" subtitle=""/>
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Our mission is to redefine online shopping by offering an extensive
            selection of quality products and a seamless shopping experience. We
            are dedicated to customer satisfaction, providing reliable service,
            secure payment options, and timely delivery. We strive to make every
            interaction with our store convenient, enjoyable, and rewarding.
          </p>
        </div>
      </section>

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
              <button className="px-5 py-2 text-white bg-blue-600 rounded-lg transition duration-300 transform hover:bg-blue-500 hover:scale-105">
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

      {/* Meet Our Team */}
      <section className="bg-gray-50 py-12 animate-slideIn">
        <Heading title="Meet Our Team" subtitle=""/>
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
