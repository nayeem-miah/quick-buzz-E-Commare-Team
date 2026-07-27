import { Link } from "react-router-dom";
import Services from "../../assets/Image/service.jpg";
import mission from "../../assets/Image/mission.jpg";
import nayeemImage from "../../assets/Image/Nayeem.png";
import rakibImage from "../../assets/Image/rakib1.jpg";
import { useEffect } from "react";
import "aos/dist/aos.css";
import Aos from "aos";
import { Helmet } from "react-helmet-async";

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
      position: "Full Stack Developer",
      image: nayeemImage,
      portfolio: "https://nayeem-miah.vercel.app",
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
    Aos.init({ once: true });
  }, []);

  return (
    <div className="text-gray-800 font-sans max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Helmet>
        <title>quickBuzz | About Page </title>
      </Helmet>

      {/* Minimal Header Section */}
      <div className="text-center pt-16 pb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
          About Us
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mt-4">
          Empowering Your Online Shopping Experience
        </h1>
        <p className="mt-3 text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Our mission is to be the leading online shopping destination, delivering exceptional service, prioritizing quality, and offering unparalleled convenience to our customers.
        </p>
        <a href="#meet" className="inline-block mt-4">
          <button className="px-6 py-2.5 text-white bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition duration-300">
            Meet Our Team
          </button>
        </a>
      </div>

      {/* Our Services */}
      <section className="my-16" data-aos="fade-up">
        <div className="flex flex-col lg:flex-row items-center gap-12 py-8">
          <div className="lg:w-1/2 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500">Our Services</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-950">
              Explore Our Range of Quality Services
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We offer a diverse range of high-quality products, backed by fast and reliable delivery, secure payment methods, and 24/7 customer support. Enjoy exclusive deals, hassle-free returns, and easy refunds. Discover style, gadgets, and essentials curated with uncompromised quality.
            </p>
            <Link to="/product" className="inline-block pt-2">
              <button className="px-6 py-2.5 text-white bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition duration-300">
                Shop Now
              </button>
            </Link>
          </div>
          <div className="lg:w-1/2">
            <img
              className="w-full rounded-xl border border-gray-100 shadow-sm"
              src={Services}
              alt="Services"
            />
          </div>
        </div>
      </section>

      {/* Our mission Section */}
      <section className="my-16" data-aos="fade-up">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 py-8">
          {/* Text Content on the Left */}
          <div className="lg:w-1/2 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500">Our Mission</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-950">
              Delivering Excellence in Every Order
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our mission is to redefine online shopping by offering a curated collection of products that meet the highest standards of quality and affordability, backed by a dedication to transparency and customer care. We strive to empower our customers with an enjoyable, convenient, and secure shopping experience that keeps them returning time and again.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Driven by Purpose, Focused on You
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Empowering You Through Exceptional Shopping
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Committed to Delivering the Best Shopping Experience
              </li>
            </ul>
            <Link to="/product" className="inline-block pt-2">
              <button className="px-6 py-2.5 text-white bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition duration-300">
                Order Now
              </button>
            </Link>
          </div>

          {/* Image on the Right */}
          <div className="lg:w-1/2">
            <img
              className="w-full rounded-xl border border-gray-100 shadow-sm"
              src={mission}
              alt="Our mission"
            />
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section id="meet" className="py-12" data-aos="fade-up">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500">Core Team</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-950 mt-1">Meet Our Team</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <Link
              to={member.portfolio}
              key={index}
              className="p-6 bg-white rounded-xl border border-gray-100 hover:border-orange-200 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 mb-4 rounded-full overflow-hidden border border-gray-200">
                <img
                  src={member.image}
                  alt={member.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-base font-bold text-gray-900">{member.name}</h3>
              <p className="text-xs text-orange-500 font-semibold mt-0.5">{member.position}</p>
              <p className="text-xs text-gray-400 italic mt-1 leading-relaxed">{member.education}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
