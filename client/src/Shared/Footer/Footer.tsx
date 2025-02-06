import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaGithub,
  FaLinkedinIn,
  FaLocationArrow,
  FaPhone,
} from "react-icons/fa";
import { MdOutlineAttachEmail } from "react-icons/md";
import icon from "../../../src/assets/Image/logo2.png";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div
      className="bg-gray-800 text-white 
"
    >
      <hr className="" />
      <footer className=" divide-y font-bold ">
        <div className=" flex flex-col justify-between py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0">
          <div className="lg:w-1/3">
            <Link
              rel="noopener noreferrer"
           to={'/'}
              className="flex justify-center space-x-3 lg:justify-start"
            >
              <div className="flex bg-white items-center justify-center md:w-40 md:h-40 lg:w-40 lg:h-40 h-32 w-32 rounded-full ">
                <img src={icon} alt="" />
              </div>
            </Link>
          </div>
          <div className="grid grid-cols-2 text-sm gap-x-3 gap-y-8 lg:w-2/3 sm:grid-cols-4 font-bold">
            <div className="space-y-3">
              <h3 className="tracking-wide uppercase font-bold">
                Our Services
              </h3>

              <ul>
                <li>
                  <Link className="hover:text-blue-700 hover:underline" to="/contact">
                    24/7 Customer Support.
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-blue-700 hover:underline" to="/about">
                    Shipping Information
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-blue-700 hover:underline" to="/">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-blue-700 hover:underline" to="/product">
                    Order Tracking
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3 font-bold">
              <h3 className="tracking-wide uppercase font-bold">pages</h3>
              <ul className="space-y-1">
                <li className="hover:text-blue-700 hover:underline">
                  <Link to={"/"}>Home</Link>
                </li>
                <li className="hover:text-blue-700 hover:underline">
                  <Link to={"/product"}>Product</Link>
                </li>
                <li className="hover:text-blue-700 hover:underline">
                  <Link to={"/about"}>about</Link>
                </li>
                <li className="hover:text-blue-700 hover:underline">
                  <Link to={"/contact"}>contact</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="uppercase font-bold">Developers</h3>
              <ul className="space-y-1">
                <li>
                  <a
                    className="hover:text-blue-700 hover:underline"
                    target="_blank"
                    href="https://nayeem-miah.vercel.app"
                  >
                    Nayeem
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-blue-700 hover:underline"
                    target="_blank"
                    href="https://rakibul-xi.vercel.app/"
                  >
                    Rakib
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="uppercase font-bold">contact us</div>
              <ul>
                <li className="flex items-center gap-2 font-bold ">
                  <MdOutlineAttachEmail />
                  <span className="">support.com</span>
                </li>
                <li className="flex items-center gap-2 font-bold">
                  <FaPhone /> <span>+8801849317388</span>
                </li>
                <li className="flex items-center gap-2 font-bold">
                  {" "}
                  <FaLocationArrow />
                  <span>Dhaka,Bangladesh</span>
                </li>
              </ul>
              <div className="flex justify-start space-x-3">
                <a
                target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.facebook.com/na.ye.em.711869/"
                  title="Facebook"
                  className="flex items-center p-1 text-xl"
                >
                  <FaFacebook />
                </a>
                <a
                  rel="noopener noreferrer"
                  href="#"
                  title="Linkedin"
                  className="flex items-center p-1 text-xl"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href="https://github.com/nayeem-miah"
                  target="_blank"
                  title="Github"
                  className="flex items-center p-1 text-xl"
                >
                  <FaGithub />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="py-6 text-sm text-center ">
          {" "}
          <p>© {currentYear} quickBuzz. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
