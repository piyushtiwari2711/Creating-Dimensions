import React, { useEffect } from "react";
import { Download, BookOpen } from "lucide-react";
import { useNotes } from "../context/NotesContext";

const NoteSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
    <div className="w-full h-48 bg-gray-100" />
    <div className="p-6">
      <div className="h-6 bg-gray-100 rounded-lg w-3/4 mb-3" />
      <div className="h-4 bg-gray-100 rounded-lg w-full mb-2" />
      <div className="h-4 bg-gray-100 rounded-lg w-2/3 mb-4" />
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-100 rounded-lg w-24" />
        <div className="h-10 bg-gray-100 rounded-lg w-32" />
      </div>
    </div>
  </div>
);

const PurchasedNotes = () => {
  const { purchasedNotes, notes, loading } = useNotes();

  useEffect(() => {
    purchasedNotes();
  }, []);

  const handleDownload = (pdfUrl) => {
    window.open(pdfUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-10 bg-gray-100 rounded-lg w-56 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <NoteSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center p-8">
        <div className="bg-blue-50 p-4 rounded-full mb-6">
          <BookOpen className="w-16 h-16 text-blue-500" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900">No notes yet</h3>
        <p className="text-gray-600 mt-2 text-center max-w-sm">
          Your purchased notes will appear here once you buy them
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold text-gray-900 mb-8">
        Your Library
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {notes.map((note) => (
          <div
            key={note.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={note.imgUrl}
                alt={note.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 line-clamp-1 mb-2">
                {note.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-6">
                {note.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Price</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ₹{note.price.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => handleDownload(note.driveUrl)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Download size={18} />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchasedNotes;
