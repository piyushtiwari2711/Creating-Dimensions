import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import NotesSection from "../components/NotesSection";
import PurchasedNotes from "../components/PurchasedNotes";
import TransactionHistory from "../components/TransactionHistory";
import Profile from "../components/Profile";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("notes");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "notes":
        return <NotesSection />;
      case "purchased":
        return <PurchasedNotes />;
      case "history":
        return <TransactionHistory />;
      case "profile":
        return <Profile />;
      default:
        return <NotesSection />;
    }
  };

  return (
    <div className="flex relative min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {renderContent()}
      </main>
    </div>
  );
}

export default Dashboard;
