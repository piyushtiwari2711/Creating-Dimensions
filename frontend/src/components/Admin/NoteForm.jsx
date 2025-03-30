  import React, { useState, useRef } from "react";
  import { Upload } from "lucide-react";
  import toast from "react-hot-toast";

  const NoteForm = ({ onSubmit, initialData = {}, isEdit = false }) => {
    const formRef = useRef(null);

    // State for form data
    const [formData, setFormData] = useState({
      title: initialData.title || "",
      description: initialData.description || "",
      category: initialData.category || "",
      subject: initialData.subject || "",
      price: initialData.price || 0,
      pdf: null,
      image: null,
    });

    const [previewImage, setPreviewImage] = useState(null);

    // Handle text and number inputs
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === "price" ? Number(value) : value, // Ensure price is a number
      }));
    };

    // Handle file inputs
    const handleFileChange = (e) => {
      const { name, files } = e.target;
      if (files.length > 0) {
        const file = files[0];

        if (name === "imageFile") {
          if (previewImage) URL.revokeObjectURL(previewImage);
          setPreviewImage(URL.createObjectURL(file));
        }

        setFormData((prev) => ({
          ...prev,
          [name]: file,
        }));
      }
    };

    // Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();

      if (formData.price < 0) {
        toast.error("Price cannot be negative.");
        return;
      }

      // toast.success(isEdit ? "Note updated successfully!" : "Note uploaded successfully!");
      onSubmit(formData);

      // Reset form state
      setFormData({
        title: "",
        description: "",
        category: "",
        subject: "",
        price: 0,
        pdf: null,
        image: null,
      });

      setPreviewImage(null);
      formRef.current.reset();
    };

    return (
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {Object.entries({ title: "Title", description: "Description", category: "Category", subject: "Subject" }).map(
          ([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          )
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">PDF File</label>
          <input type="file" name="pdf" accept=".pdf" onChange={handleFileChange} className="mt-1 block w-full" required={!isEdit} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Note Image</label>
          <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full" required={!isEdit} />
          {previewImage && <img src={previewImage} alt="Preview" className="mt-2 max-w-xs rounded-md" />}
        </div>

        <button
          type="submit"
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isEdit ? "Update Note" : "Upload Note"}
        </button>
      </form>
    );
  };

  export default NoteForm;
