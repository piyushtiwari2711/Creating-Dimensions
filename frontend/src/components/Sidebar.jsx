import React from "react";
import {
  Menu,
  X,
  BookOpen,
  ShoppingCart,
  History,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router";

const Sidebar = ({
  isOpen,
  toggleSidebar,
  activeSection,
  setActiveSection,
}) => {
  const { logOut, user } = useAuth();
  const menuItems = [
    { id: "notes", label: "Notes", icon: BookOpen },
    { id: "purchased", label: "Purchased Notes", icon: ShoppingCart },
    { id: "history", label: "Transaction History", icon: History },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-white shadow-lg transition-all duration-300 z-50 flex flex-col
      ${isOpen ? "w-64" : "w-16"}`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
        <Link
          to={"/"}
          className={`font-bold text-xl cursor-pointer text-blue-600 transition-opacity duration-200 
          ${isOpen ? "opacity-100" : "hidden"}`}
        >
          Notes App
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-lg mb-2 transition-all
              ${
                activeSection === item.id
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <Icon size={20} />
              <span
                className={`transition-opacity duration-200
                ${isOpen ? "opacity-100" : "opacity-0 w-0 hidden"}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div
        className={`p-4 border-t border-gray-100 transition-opacity duration-200
  ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            {/* <User size={16} className="text-blue-600" /> */}
            <img
              src={user.photoURL || "/user.png"}
              alt={user.displayName || "User"}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">
              {user.displayName}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => {
            logOut();
          }}
          className="mt-3 w-full bg-red-200 rounded-2xl py-2 cursor-pointer text-sm font-medium text-red-600 hover:text-red-800 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
