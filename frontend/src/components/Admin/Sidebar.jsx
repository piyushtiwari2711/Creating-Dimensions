import React from "react";
import {
  LogOut,
  FileText,
  Upload,
  Menu,
  ChevronLeft,
  IndianRupee,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, toggleSidebar, onNavigate, activeView }) => {
  const {logOut} = useAuth();
  const navItems = [
    { id: 'upload', icon: Upload, label: 'Upload Notes' },
    { id: 'manage', icon: FileText, label: 'Manage Notes' },
    { id: 'transactions', icon: IndianRupee, label: 'Transactions' },
  ];

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg hover:bg-gray-50 transition-colors duration-200"
        aria-label="Toggle Sidebar"
      >
        <Menu size={22} className="text-gray-700" />
      </button>

      <aside
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-gray-800 to-gray-900 text-white transition-all duration-300 ease-in-out z-40
          shadow-2xl backdrop-blur-sm
          ${isOpen ? "w-64" : "w-20"} 
          ${window.innerWidth < 1024 && !isOpen ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        <div className="p-5 h-full flex flex-col relative">
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex absolute -right-3 top-8 bg-gray-800 rounded-full p-1.5 transform translate-x-full hover:bg-gray-700 transition-colors duration-200"
            aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <ChevronLeft
              size={18}
              className={`transform transition-transform duration-300 ${
                isOpen ? "" : "rotate-180"
              }`}
            />
          </button>

          <div className="flex items-center mb-8 gap-3">
            <LayoutDashboard size={28} className="text-blue-400 flex-shrink-0" />
            <h2
              className={`text-xl font-bold overflow-hidden transition-all duration-300 ${
                isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
              }`}
            >
              Admin Panel
            </h2>
          </div>

          <nav className="space-y-2 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`
                  flex items-center p-3 rounded-lg transition-all duration-200 w-full text-left
                  group relative
                  ${activeView === item.id 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-700/50 text-gray-300 hover:text-white"}
                `}
                title={!isOpen ? item.label : ""}
              >
                <item.icon 
                  size={20} 
                  className={`flex-shrink-0 transition-transform duration-200 ${
                    activeView === item.id ? "transform scale-110" : ""
                  }`}
                />
                <span
                  className={`ml-3 transition-all duration-300 ${
                    isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"
                  }`}
                >
                  {item.label}
                </span>
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {item.label}
                  </div>
                )}
              </button>
            ))}
          </nav>

          <button
            className="flex items-center p-3 rounded-lg transition-all duration-200 w-full text-left mt-auto
              group relative hover:bg-red-500/10 text-gray-300 hover:text-red-400"
            title={!isOpen ? "Logout" : ""}
            onClick={logOut}
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span
              className={`ml-3 transition-all duration-300 ${
                isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"
              }`}
            >
              Logout
            </span>
            {!isOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;