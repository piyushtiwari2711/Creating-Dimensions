import React, { useState, useMemo } from 'react';
import { ChevronRight, Search } from 'lucide-react';


const categories = [
  {
    name: 'Class 9 & 10',
    subjects: [
      {
        name: 'Maths',
        notes: [
          {
            title: 'Algebra Fundamentals',
            price: 299,
            preview: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500',
          }
        ]
      },
      {
        name: 'English',
        notes: [
          {
            title: 'Grammar Essentials',
            price: 199,
            preview: 'https://images.unsplash.com/photo-1455541504462-57ebb2a9cec1?w=500',
          }
        ]
      },
      {
        name: 'Social Science',
        notes: [
          {
            title: 'History Highlights',
            price: 249,
            preview: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=500',
          }
        ]
      },
      {
        name: 'Science',
        notes: [
          {
            title: 'Basic Physics',
            price: 299,
            preview: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=500',
          }
        ]
      }
    ]
  },
  {
    name: 'Class 11 & 12',
    subjects: [
      {
        name: 'PCM',
        notes: [
          {
            title: 'Physics Advanced',
            price: 399,
            preview: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=500',
          },
          {
            title: 'Chemistry Complete',
            price: 399,
            preview: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=500',
          },
          {
            title: 'Mathematics Pro',
            price: 399,
            preview: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500',
          }
        ]
      },
      {
        name: 'Arts',
        notes: [
          {
            title: 'Geography Notes',
            price: 299,
            preview: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500',
          },
          {
            title: 'History Complete',
            price: 299,
            preview: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=500',
          },
          {
            title: 'Civics Guide',
            price: 299,
            preview: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500',
          },
          {
            title: 'Economics Package',
            price: 299,
            preview: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=500',
          }
        ]
      }
    ]
  },
  {
    name: 'Others',
    subjects: [
      {
        name: 'Competitive Exams',
        notes: [
          {
            title: 'CUET Preparation',
            price: 599,
            preview: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500',
          },
          {
            title: 'Ph.D/TET Guide',
            price: 699,
            preview: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=500',
          },
          {
            title: 'SSC Complete Guide',
            price: 799,
            preview: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=500',
          },
          {
            title: 'RO/ARO Study Material',
            price: 599,
            preview: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=500',
          },
          {
            title: 'PCS Preparation',
            price: 899,
            preview: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=500',
          }
        ]
      }
    ]
  }
];

const NotesSection = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const filteredCategories = useMemo(() => {
    return categories
      .filter(category => 
        !selectedCategory || category.name === selectedCategory)
      .map(category => ({
        ...category,
        subjects: category.subjects
          .filter(subject => 
            (!selectedSubject || subject.name === selectedSubject) &&
            subject.notes.some(note => 
              note.title.toLowerCase().includes(searchQuery.toLowerCase())))
          .map(subject => ({
            ...subject,
            notes: subject.notes.filter(note =>
              note.title.toLowerCase().includes(searchQuery.toLowerCase()))
          }))
      }))
      .filter(category => category.subjects.length > 0);
  }, [searchQuery, selectedCategory, selectedSubject]);

  const allSubjects = useMemo(() => {
    const subjects = new Set();
    categories.forEach(category => {
      category.subjects.forEach(subject => {
        subjects.add(subject.name);
      });
    });
    return Array.from(subjects);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Available Notes</h2>
        
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubject('');
              }}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <select
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {allSubjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <div key={category.name} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <button
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedCategory(
                  expandedCategory === category.name ? null : category.name
                )}
              >
                <span className="text-lg font-semibold text-gray-800">{category.name}</span>
                <ChevronRight
                  className={`transform transition-transform duration-200 ${
                    expandedCategory === category.name ? 'rotate-90' : ''
                  }`}
                />
              </button>
              
              {expandedCategory === category.name && (
                <div className="border-t border-gray-100">
                  {category.subjects.map((subject) => (
                    <div key={subject.name} className="border-b border-gray-100 last:border-b-0">
                      <button
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        onClick={() => setExpandedSubject(
                          expandedSubject === subject.name ? null : subject.name
                        )}
                      >
                        <span className="font-medium text-gray-700">{subject.name}</span>
                        <ChevronRight
                          className={`transform transition-transform duration-200 ${
                            expandedSubject === subject.name ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                      
                      {expandedSubject === subject.name && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50">
                          {subject.notes.map((note) => (
                            <div 
                              key={note.title} 
                              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                            >
                              <img
                                src={note.preview}
                                alt={note.title}
                                className="w-full h-40 object-cover"
                              />
                              <div className="p-4">
                                <h3 className="font-medium text-gray-800 mb-2">{note.title}</h3>
                                <p className="text-blue-600 font-semibold">₹{note.price}</p>
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