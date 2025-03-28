import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Search,
  BookOpen,
  GraduationCap,
  Lock,
} from "lucide-react";
import { useNotes } from "../context/NotesContext";
import { initiatePayment } from "../config/razorpay";
import { useAuth } from "../context/AuthContext";

const NotesSection = () => {
  const {
    categories,
    subjects,
    notes,
    fetchCategories,
    fetchSubjects,
    fetchNotes,
  } = useNotes();
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (expandedCategory) {
      fetchSubjects(expandedCategory);
    }
  }, [expandedCategory]);

  useEffect(() => {
    if (expandedCategory && expandedSubject) {
      fetchNotes(expandedCategory, expandedSubject);
    }
  }, [expandedCategory, expandedSubject]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Study Materials
            </h2>
            <p className="text-gray-600 mt-2">
              Explore our curated collection of study notes
            </p>
          </div>
          <div className="relative w-96">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === category.name ? null : category.name
                  )
                }
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <BookOpen className="text-blue-600" size={24} />
                  </div>
                  <div className="text-left">
                    <span className="text-xl font-semibold text-gray-900">
                      {category.name}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      Explore study materials
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`transform transition-transform duration-300 text-gray-400 ${
                    expandedCategory === category.name ? "rotate-90" : ""
                  }`}
                  size={24}
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
                        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                        onClick={() =>
                          setExpandedSubject(
                            expandedSubject === subject.name
                              ? null
                              : subject.name
                          )
                        }
                      >
                        <div className="flex items-center space-x-3">
                          <GraduationCap className="text-gray-500" size={20} />
                          <span className="font-medium text-gray-700">
                            {subject.name}
                          </span>
                        </div>
                        <ChevronRight
                          className={`transform transition-transform duration-300 text-gray-400 ${
                            expandedSubject === subject.name ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {expandedSubject === subject.name && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50">
                          {notes.map((note) => (
                            <div
                              key={note.id}
                              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group"
                            >
                              <div className="relative">
                                <img
                                  src={note.imgUrl}
                                  alt={note.title}
                                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                                />
                                {!user && (
                                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <Lock className="text-white" size={24} />
                                  </div>
                                )}
                              </div>
                              <div className="p-5">
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                  {note.title}
                                </h3>
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-blue-600 font-bold text-lg">
                                    ₹{note.price}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {note.pages} pages
                                  </span>
                                </div>
                                <button
                                  onClick={() => initiatePayment(note, user)}
                                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors transform hover:-translate-y-1 duration-200 flex items-center justify-center space-x-2"
                                  disabled={!user}
                                >
                                  {user ? (
                                    <>
                                      <span>Buy Now</span>
                                      <ChevronRight size={16} />
                                    </>
                                  ) : (
                                    <span>Login to Purchase</span>
                                  )}
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
