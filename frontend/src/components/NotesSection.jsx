import React, { useState, useEffect } from "react";
import { ChevronRight, Search } from "lucide-react";
import { useNotes } from "../context/NotesContext";

const NotesSection = () => {
  const {
    categories,
    subjects,
    notes,
    fetchCategories,
    fetchSubjects,
    fetchNotes,
    loading,
    error,
  } = useNotes();

  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (expandedCategory) {
      console.log(expandedCategory);
      fetchSubjects(expandedCategory);
    }
  }, [expandedCategory]);

  useEffect(() => {
    if (expandedCategory && expandedSubject) {
      fetchNotes(expandedCategory, expandedSubject);
    }
  }, [expandedCategory, expandedSubject]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Available Notes</h2>

        {/* Search Input */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <button
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === category.name ? null : category.name
                  )
                }
              >
                <span className="text-lg font-semibold text-gray-800">
                  {category.name}
                </span>
                <ChevronRight
                  className={`transform transition-transform duration-200 ${
                    expandedCategory === category.name ? "rotate-90" : ""
                  }`}
                />
              </button>

              {expandedCategory === category.name && (
                <div className="border-t border-gray-100">
                  {subjects.map((subject) => (
                    <div
                      key={subject.name}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <button
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        onClick={() =>
                          setExpandedSubject(
                            expandedSubject === subject.name
                              ? null
                              : subject.name
                          )
                        }
                      >
                        <span className="font-medium text-gray-700">
                          {subject.name}
                        </span>
                        <ChevronRight
                          className={`transform transition-transform duration-200 ${
                            expandedSubject === subject.name ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {expandedSubject === subject.name && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50">
                          {notes.map((note) => (
                            <div
                              key={note.title}
                              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                            >
                              <img
                                src={note.imgUrl}
                                alt={note.title}
                                className="w-full h-40 object-cover"
                              />
                              <div className="p-4">
                                <h3 className="font-medium text-gray-800 mb-2">
                                  {note.title}
                                </h3>
                                <p className="text-blue-600 font-semibold">
                                  ₹{note.price}
                                </p>
                                <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                  Buy Now
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesSection;
