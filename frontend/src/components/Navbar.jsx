import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { BookOpen, Menu, X } from "lucide-react";
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
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">
              Creating Dimensions
            </span>
          </div>

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
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Home
            </Link>
            <Link
              to="/mentors"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Mentors
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Contact
            </Link>
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
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 transition"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/mentors"
              className="text-gray-600 hover:text-blue-600 transition"
              onClick={() => setIsOpen(false)}
            >
              Mentors
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-blue-600 transition"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
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
