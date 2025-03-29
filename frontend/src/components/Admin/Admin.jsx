import React, { useState } from "react";
import Sidebar from "./Sidebar";
import NoteForm from "./NoteForm";
import NoteCard from "./NoteCard";
import PdfPreview from "./PdfPreview";
import Transactions from "./Transaction";

const mockNotes = [
  {
    id: "1",
    title: "Introduction to Calculus",
    description:
      "Comprehensive notes covering basic calculus concepts including limits, derivatives, and integrals.",
    price: 29.99,
    category: "Mathematics",
    subject: "Calculus",
    imageUrl:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
    pdfUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "2",
    title: "Organic Chemistry Fundamentals",
    description:
      "Detailed notes on organic chemistry basics, including molecular structures and reactions.",
    price: 34.99,
    category: "Science",
    subject: "Chemistry",
    imageUrl:
      "https://images.unsplash.com/photo-1532634993-15f421e42ec0?auto=format&fit=crop&q=80&w=800",
    pdfUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
];

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("manage");
  const [notes, setNotes] = useState(mockNotes);
  const [editingNote, setEditingNote] = useState(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);

  const handleNoteSubmit = (formData) => {
    console.log("Form submitted:", formData);
    setActiveView("manage");
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setActiveView("upload");
  };

  const handleDelete = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleNavigate = (view) => {
    setActiveView(view);
    if (view === "manage") {
      setEditingNote(null);
    }
  };

  const handlePreviewPdf = (pdfUrl) => {
    setPreviewPdfUrl(pdfUrl);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigate={handleNavigate}
        activeView={activeView}
      />

      <main
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        } p-8`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeView === "upload"
                ? editingNote
                  ? "Edit Note"
                  : "Upload New Note"
                : activeView === "transactions"
                ? "Transactions"
                : "Manage Notes"}
            </h1>
            {activeView === "manage" && (
              <button
                onClick={() => handleNavigate("upload")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Upload New Note
              </button>
            )}
          </div>

          {activeView === "upload" ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <NoteForm
                onSubmit={handleNoteSubmit}
                initialData={editingNote || undefined}
                isEdit={!!editingNote}
              />
            </div>
          ) : activeView === "transactions" ? (
            <Transactions />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPreview={handlePreviewPdf}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {previewPdfUrl && (
        <PdfPreview
          pdfUrl={previewPdfUrl}
          onClose={() => setPreviewPdfUrl(null)}
        />
      )}
    </div>
  );
};

export default Admin;
