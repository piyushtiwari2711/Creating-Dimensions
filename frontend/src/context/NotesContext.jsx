import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/notes/categories`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      setCategories(response.data.categories);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects for a given category
  const fetchSubjects = async (category) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/categories/${category}/notes/subjects`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      }
      );
      setSubjects(response.data.subjects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notes for a given category and subject
  const fetchNotes = async (category, subject) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/categories/${category}/notes/subjects/${subject}/notes`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      }
      );
      setNotes(response.data.notes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Upload a new note
  const uploadNote = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/notes/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const purchasedNotes = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`${BASE_URL}/user/notes`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setNotes(response.data.notes)
  } catch (err) {
    setNotes([])
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  // Delete a note
  const deleteNote = async (category, subject, noteId) => {
    try {
      setLoading(true);
      await axios.delete(
        `${BASE_URL}/notes/categories/${category}/subjects/${subject}/notes/${noteId}`
      );
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NotesContext.Provider
      value={{
        categories,
        subjects,
        notes,
        fetchCategories,
        fetchSubjects,
        fetchNotes,
        uploadNote,
        deleteNote,
        purchasedNotes,
        loading,
        error,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
