import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { BookOpen, Menu, X } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";
export function Navbar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed w-full bg-white shadow-sm z-50">
      <div className="container max-w-[1400px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <ScrollLink
            to="hero-section"
            smooth={true}
            duration={500}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">
              Creating Dimensions
            </span>
          </ScrollLink>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ScrollLink
              to="hero-section"
              smooth={true}
              duration={500}
              className="text-gray-600 hover:text-blue-600 transition cursor-pointer"
            >
              Home
            </ScrollLink>
            <ScrollLink
              to="mentor-section"
              smooth={true}
              duration={500}
              className="text-gray-600 hover:text-blue-600 transition cursor-pointer"
            >
              Mentors
            </ScrollLink>
            <ScrollLink
              to="contact-section"
              smooth={true}
              duration={500}
              className="text-gray-600 hover:text-blue-600 transition cursor-pointer"
            >
              Contact
            </ScrollLink>
            {user ? (
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/signin"
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:hidden mt-4 pb-4 border-t border-gray-200`}
        >
          <div className="flex flex-col space-y-4 pt-4">
            <ScrollLink
              to="hero-section"
              smooth={true}
              duration={500}
              className="text-gray-600 hover:text-blue-600 transition cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Home
            </ScrollLink>
            <ScrollLink
              to="mentor-section"
              smooth={true}
              duration={500}
              className="text-gray-600 hover:text-blue-600 transition cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Mentors
            </ScrollLink>
            <ScrollLink
              to="contact-section"
              smooth={true}
              duration={500}
              className="text-gray-600 hover:text-blue-600 transition cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </ScrollLink>
            {user ? (
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition inline-block text-center"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/signin"
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition inline-block text-center"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
