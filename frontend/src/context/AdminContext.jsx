import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL+'/admin';
const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Notes
  const fetchNotes = async () => {
    console.log("fetching notes")
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/notes`);
      setNotes(response.data.notes);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Upload Note
  const uploadNote = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/notes/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNotes((prev) => [...prev, response.data.note]);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit Note
  const editNote = async (category, subject, noteId, formData) => {
    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/categories/${category}/subjects/${subject}/notes/${noteId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchNotes();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Note
  const deleteNote = async (category, subject, noteId) => {
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/categories/${category}/subjects/${subject}/notes/${noteId}`);
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Transactions
  const transactionHistory = async ()=>{
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/transactions`);
      setTransactions(response.data.transactions);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }


  return (
    <AdminContext.Provider value={{fetchNotes, notes, loading, error, uploadNote, editNote, deleteNote,transactionHistory,transactions}}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
