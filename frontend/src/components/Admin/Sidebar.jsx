import React from "react";
import {
  LogOut,
  FileText,
  Upload,
  Menu,
  ChevronLeft,
  DollarSign,
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar, onNavigate, activeView }) => {
  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        <Menu size={24} />
      </button>

      <div
        className={`
        fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-300 ease-in-out z-40
        ${isOpen ? "w-64" : "w-20"} 
        ${
          window.innerWidth < 1024 && !isOpen
            ? "-translate-x-full"
            : "translate-x-0"
        }
      `}
      >
        <div className="p-5 relative">
          <button
            onClick={toggleSidebar}
            className="hidden lg:block absolute -right-3 top-5 bg-gray-800 rounded-full p-1 transform translate-x-full"
          >
            <ChevronLeft
              size={20}
              className={`transform transition-transform ${
                isOpen ? "" : "rotate-180"
              }`}
            />
          </button>

          <h2
            className={`text-2xl font-bold mb-8 overflow-hidden transition-all ${
              isOpen ? "opacity-100" : "opacity-0 w-0"
            }`}
          >
            Admin Panel
          </h2>

          <nav className="space-y-4">
            <button
              onClick={() => {
                onNavigate("upload");
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors w-full text-left
                ${activeView === "upload" ? "bg-gray-700" : ""}`}
              title={!isOpen ? "Upload Notes" : ""}
            >
              <Upload size={20} />
              <span
                className={`ml-3 transition-all ${
                  isOpen ? "opacity-100" : "opacity-0 w-0 hidden"
                }`}
              >
                Upload Notes
              </span>
            </button>

            <button
              onClick={() => {
                onNavigate("manage");
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors w-full text-left
                ${activeView === "manage" ? "bg-gray-700" : ""}`}
              title={!isOpen ? "Manage Notes" : ""}
            >
              <FileText size={20} />
              <span
                className={`ml-3 transition-all ${
                  isOpen ? "opacity-100" : "opacity-0 w-0 hidden"
                }`}
              >
                Manage Notes
              </span>
            </button>

            <button
              onClick={() => {
                onNavigate("transactions");
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors w-full text-left
                ${activeView === "transactions" ? "bg-gray-700" : ""}`}
              title={!isOpen ? "Transactions" : ""}
            >
              <DollarSign size={20} />
              <span
                className={`ml-3 transition-all ${
                  isOpen ? "opacity-100" : "opacity-0 w-0 hidden"
                }`}
              >
                Transactions
              </span>
            </button>

            <button
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors w-full mt-auto"
              title={!isOpen ? "Logout" : ""}
            >
              <LogOut size={20} />
              <span
                className={`ml-3 transition-all ${
                  isOpen ? "opacity-100" : "opacity-0 w-0 hidden"
                }`}
              >
                Logout
              </span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
