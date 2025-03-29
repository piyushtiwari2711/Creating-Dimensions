import React from "react";
import { X } from "lucide-react";

const PdfPreview = ({ pdfUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
        <div className="flex-1 p-4">
          <iframe
            src={`${pdfUrl}#toolbar=0`}
            className="w-full h-full rounded border border-gray-200"
            title="PDF Preview"
          />
        </div>
      </div>
    </div>
  );
};

export default PdfPreview;
