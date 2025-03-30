import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import NoteForm from "./NoteForm";
import NoteCard from "./NoteCard";
import PdfPreview from "./PdfPreview";
import Transactions from "./Transaction";
import { useAdmin } from "../../context/AdminContext";
import toast from "react-hot-toast";

const Admin = () => {
  const { fetchNotes, notes, uploadNote, editNote, deleteNote } = useAdmin();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("manage");
  const [editingNote, setEditingNote] = useState(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);

  const handleNoteSubmit = async (formData) => {
    try {
      if (editingNote) {
        await editNote(editingNote.category, editingNote.subject, editingNote.id, formData);
        toast.success("Note edited successfully!");
      } else {
        await uploadNote(formData);
        toast.success("Note uploaded successfully!");
      }
      setActiveView("manage");
    } catch (error) {
      toast.error("Error submitting note!");
      console.error("Error submitting note:", error);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setActiveView("upload");
  };

  const handleDelete = async (note) => {
    try {
      await deleteNote(note.category, note.subject, note.id);
      toast.success("Note deleted successfully!");
    } catch (error) {
      toast.error("Error deleting note!");
      console.error("Error deleting note:", error);
    }
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchNotes();
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchData();
  }, []);

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
                  onDelete={() => handleDelete(note)}
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
