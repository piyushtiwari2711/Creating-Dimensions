import React from 'react';
import { Download } from 'lucide-react';

const purchasedNotes = [
  {
    title: 'Advanced Calculus',
    subject: 'Mathematics',
    purchaseDate: '2024-02-15',
    downloadCount: 2,
    preview: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500',
  },
  {
    title: 'Physics Mechanics',
    subject: 'Physics',
    purchaseDate: '2024-02-10',
    downloadCount: 1,
    preview: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=500',
  },
];

const PurchasedNotes = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Purchased Notes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchasedNotes.map((note) => (
          <div key={note.title} className="border rounded-lg overflow-hidden">
            <img
              src={note.preview}
              alt={note.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium">{note.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{note.subject}</p>
              <p className="text-gray-500 text-sm mt-2">
                Purchased on: {new Date(note.purchaseDate).toLocaleDateString()}
              </p>
              <p className="text-gray-500 text-sm">
                Downloads: {note.downloadCount}
              </p>
              <button className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
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