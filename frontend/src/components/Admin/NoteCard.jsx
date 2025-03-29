import React, { useState } from "react";
import { Edit2, Trash2, Eye } from "lucide-react";

const NoteCard = ({ note, onEdit, onDelete, onPreview }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={note.imageUrl}
        alt={note.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
        <p className="mt-1 text-gray-600 text-sm line-clamp-2">
          {note.description}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-indigo-600 font-medium">${note.price}</span>
          <div className="flex space-x-2">
            {note.pdfUrl && (
              <button
                onClick={() => onPreview(note.pdfUrl)}
                className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                title="Preview PDF"
              >
                <Eye size={18} />
              </button>
            )}
            <button
              onClick={() => onEdit(note)}
              className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
              title="Edit"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
            {note.category}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
            {note.subject}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
