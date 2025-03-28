import React, { useEffect } from "react";
import { Download } from "lucide-react";
import { useNotes } from "../context/NotesContext";

const PurchasedNotes = () => {
  const { purchasedNotes, notes } = useNotes();

  useEffect(() => {
    purchasedNotes();
  }, []); // Ensuring it runs only once on mount

  const handleDownload = (pdfUrl) => {
    window.open(pdfUrl, "_blank");
  };

  if (!notes || notes.length === 0) {
    return <p className="p-6 text-center text-gray-500">No purchased notes found.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Purchased Notes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div
            key={note.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <img
              src={note.imgUrl}
              alt={note.title}
              className="w-full h-40 object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h3 className="font-medium">{note.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{note.description}</p>
              <p className="text-gray-500 text-sm mt-2">Price: Rs{note.price}</p>
              <button
                onClick={() => handleDownload(note.pdfUrl)}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchasedNotes;
