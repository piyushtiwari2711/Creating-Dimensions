import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data.categories);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async (category) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/categories/${category}/subjects`);
      setSubjects(response.data.subjects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async (category, subject) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/categories/${category}/subjects/${subject}/notes`
      );
      setNotes(response.data.notes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadNote = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchNotes(formData.get("category"), formData.get("subject")); // Refresh notes
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (category, subject, noteId) => {
    setLoading(true);
    try {
      await axios.delete(
        `/api/categories/${category}/subjects/${subject}/notes/${noteId}`
      );
      fetchNotes(category, subject); // Refresh notes
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
        loading,
        error,
        fetchCategories,
        fetchSubjects,
        fetchNotes,
        uploadNote,
        deleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
