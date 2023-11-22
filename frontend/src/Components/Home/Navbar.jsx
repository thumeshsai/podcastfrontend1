/* eslint-disable react/prop-types */
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

const Navbar = ({ onOpen }) => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-blue-100 p-3 shadow container m-auto flex justify-between items-center">
        <div className="flex items-center ml-3">
          <Link to="/" className="flex items-center">
            <img
              src="/logo.gif"
              alt="Logo"
              className="h-10 w-10 md:h-10 md:w-10 mr-2 object-cover"
            />
            <span className="text-2xl font-bold">PodCast</span>
          </Link>
        </div>
        <div className="hidden md:flex space-x-6">
          <button
            onClick={() => scrollToSection("popular")}
            className="group relative px-2 py-1"
          >
            Popular
            <span className="absolute left-0 bottom-0 h-1 bg-blue-300 w-0 transition-all duration-500 group-hover:w-full"></span>
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="group relative px-2 py-1"
          >
            Contact Us
            <span className="absolute left-0 bottom-0 h-1 bg-blue-300 w-0 transition-all duration-500 group-hover:w-full"></span>
          </button>
          <button
            onClick={() => onOpen("User")}
            className="bg-blue-500 text-white rounded-lg px-2 py-2 hover:bg-gray-500"
          >
            LogIn/Register
          </button>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="hover:text-blue-300"
          >
            {!isMenuOpen && <MenuIcon />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-top justify-end z-50 bg-white bg-opacity-70">
          <div className="bg-blue-500 text-white pt-6 p-4 shadow-md">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-2 right-2 hover:text-gray-700"
            >
              <CloseIcon />
            </button>
            <button
              onClick={() => scrollToSection("popular")}
              className="block px-4 py-2 text-lg"
            >
              Popular
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block px-4 py-2 text-lg"
            >
              Contact Us
            </button>
            <button
              onClick={() => onOpen("User")}
              className="block px-4 py-2 text-lg"
            >
              Login/Register
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
