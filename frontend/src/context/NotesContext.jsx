import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext"; // Import your auth context
import { toast } from "react-hot-toast";

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { api, user } = useAuth(); // Get the authenticated API instance and user
  
  // Clear error when needed
  const clearError = () => setError(null);

  // Helper function to handle errors
  const handleError = (err, defaultMessage = "An error occurred") => {
    console.error(err);
    
    let errorMessage = defaultMessage;
    
    if (err.customMessage) {
      // If using our custom axios interceptor, use its formatted message
      errorMessage = err.customMessage;
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    setError(errorMessage);
    return errorMessage;
  };

  // Fetch all categories
  const fetchCategories = async () => {
    clearError();
    if (!user) {
      const errorMessage = "User not authenticated";
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.get(`/notes/categories`);
      setCategories(response.data.categories || []);
    } catch (err) {
      const errorMessage = handleError(err, "Failed to fetch categories");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects for a given category
  const fetchSubjects = async (category) => {
    clearError();
    if (!category) {
      const errorMessage = "Category is required";
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.get(`/notes/categories/${category}/subjects`);
      setSubjects(response.data.subjects || []);
    } catch (err) {
      const errorMessage = handleError(err, `Failed to fetch subjects for ${category}`);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notes for a given category and subject
  const fetchNotes = async (category, subject) => {
    clearError();
    if (!category || !subject) {
      const errorMessage = "Category and subject are required";
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.get(
        `/notes/categories/${category}/subjects/${subject}/notes`
      );
      setNotes(response.data.notes || []);
    } catch (err) {
      const errorMessage = handleError(err, `Failed to fetch notes for ${subject} in ${category}`);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const purchasedNotes = async () => {
    clearError();
    try {
      setLoading(true);
      const response = await api.get(`/user/notes`);
      setNotes(response.data.notes || []);
    } catch (err) {
      setNotes([]);
      const errorMessage = handleError(err, "Failed to fetch your purchased notes");
      
      // Don't show toast for empty notes (might be a valid state)
      if (err.response?.status !== 404) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const transactionHistory = async () => {
    clearError();
    try {
      setLoading(true);
      const response = await api.get(`/user/transactions`);
      setTransactions(response.data.transactions || []);
    } catch (err) {
      setTransactions([]);
      const errorMessage = handleError(err, "Failed to fetch your transaction history");
      
      // Don't show toast for empty transactions (might be a valid state)
      if (err.response?.status !== 404) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Purchase a note
  const purchaseNote = async (noteId) => {
    clearError();
    if (!noteId) {
      const errorMessage = "Note ID is required";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
    
    try {
      setLoading(true);
      const response = await api.post(`/notes/purchase`, { noteId });
      
      // Show success message from backend if available
      if (response.data.message) {
        toast.success(response.data.message);
      } else {
        toast.success("Note purchased successfully!");
      }
      
      return true;
    } catch (err) {
      const errorMessage = handleError(err, "Failed to purchase the note");
      toast.error(errorMessage);
      return false;
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
        transactions,
        loading,
        error,
        clearError,
        fetchCategories,
        fetchSubjects,
        fetchNotes,
        purchasedNotes,
        transactionHistory,
        purchaseNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);