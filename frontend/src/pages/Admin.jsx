import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Upload, FileText, DollarSign, BookOpen, Layout, FileImage } from 'lucide-react';
import { toast } from 'react-hot-toast'; // Importing toast

const categories = [
  'Academic',
  'Professional',
  'Technical',
  'Creative',
  'Business',
  'Other'
];

const subjects = [
  'Mathematics',
  'Science',
  'Literature',
  'History',
  'Computer Science',
  'Economics',
  'Art',
  'Other'
];

export const AdminComponent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    subject: '',
    pdfFile: null,
    imageFile: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === 'pdfFile' && !files[0].name.endsWith('.pdf')) {
        toast.error('Only PDF files are allowed');
        return;
      }
      if (name === 'imageFile' && !files[0].name.match(/\.(jpg|jpeg|png)$/)) {
        toast.error('Only image files are allowed');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!formData.title.trim()) {
      toast.error('Title is required');
      isValid = false;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      isValid = false;
    }
    if (isNaN(formData.price) || formData.price <= 0) {
      toast.error('Valid price is required');
      isValid = false;
    }
    if (!formData.category) {
      toast.error('Category is required');
      isValid = false;
    }
    if (!formData.subject) {
      toast.error('Subject is required');
      isValid = false;
    }
    if (!formData.pdfFile) {
      toast.error('PDF file is required');
      isValid = false;
    }
    if (!formData.imageFile) {
      toast.error('Image file is required');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Form submitted:', formData);
      setFormData({
        title: '',
        description: '',
        price: 0,
        category: '',
        subject: '',
        pdfFile: null,
        imageFile: null
      });
      toast.success('Note uploaded successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Upload Your Note
            </span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Share your knowledge with the world. Fill in the details below to upload your educational content.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 md:p-12">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-3">
                <Upload className="h-8 w-8 text-white" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
                {/* Title Input */}
                <div className="sm:col-span-2">
                  <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText className="h-4 w-4 mr-2 text-indigo-600" />
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 focus:ring-indigo-500 px-4 py-3 focus:outline-none focus:ring-2 transition duration-150 ease-in-out"
                    placeholder="Enter the title of your note"
                  />
                </div>

                {/* Description Textarea */}
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Layout className="h-4 w-4 mr-2 text-indigo-600" />
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 focus:ring-indigo-500 px-4 py-3 focus:outline-none focus:ring-2 transition duration-150 ease-in-out"
                    placeholder="Describe your note's content"
                  />
                </div>

                {/* Price Input */}
                <div>
                  <label htmlFor="price" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="h-4 w-4 mr-2 text-indigo-600" />
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 focus:ring-indigo-500 px-4 py-3 focus:outline-none focus:ring-2 transition duration-150 ease-in-out"
                    placeholder="0.00"
                  />
                </div>

                {/* Category Dropdown */}
                <div>
                  <label htmlFor="category" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="h-4 w-4 mr-2 text-indigo-600" />
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 focus:ring-indigo-500 px-4 py-3 focus:outline-none focus:ring-2 transition duration-150 ease-in-out"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Dropdown */}
                <div>
                  <label htmlFor="subject" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="h-4 w-4 mr-2 text-indigo-600" />
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 focus:ring-indigo-500 px-4 py-3 focus:outline-none focus:ring-2 transition duration-150 ease-in-out"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload Section */}
                <div className="sm:col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* PDF File Input */}
                  <div className="relative">
                    <label htmlFor="pdfFile" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <FileText className="h-4 w-4 mr-2 text-indigo-600" />
                      PDF File
                    </label>
                    <input
                      type="file"
                      id="pdfFile"
                      name="pdfFile"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="block w-full rounded-lg border border-gray-300 focus:ring-indigo-500 px-4 py-3 focus:outline-none focus:ring-2 transition duration-150 ease-in-out"
                    />
                  </div>

                  {/* Image File Input */}
                  <div className="relative">
                    <label htmlFor="imageFile" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <FileImage className="h-4 w-4 mr-2 text-indigo-600" />
                      Cover Image
                    </label>
                    <input
                      type="file"
                      id="imageFile"
                      name="imageFile"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full rounded-lg border border-gray-300 focus:ring-indigo-500 px-4 py-3 focus:outline-none focus:ring-2 transition duration-150 ease-in-out"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 ease-in-out"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Note
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComponent;
