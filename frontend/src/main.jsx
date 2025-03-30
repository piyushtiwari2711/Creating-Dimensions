import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { NotesProvider } from "./context/NotesContext";
import { AdminProvider } from "./context/AdminContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <AdminProvider>
      <AuthProvider>
        <NotesProvider>
          <App />
        <Toaster />
        </NotesProvider>
      </AuthProvider>
      </AdminProvider>
    </BrowserRouter>
  </StrictMode>
);
