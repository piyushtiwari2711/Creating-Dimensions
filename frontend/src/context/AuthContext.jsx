import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { toast } from "react-hot-toast";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { setDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router";
import axios from "axios";

// Create Context
const AuthContext = createContext();

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || process.env.VITE_BASE_URL,
});

// Setup axios interceptor for token refreshing
api.interceptors.request.use(
  async (config) => {
    if (auth.currentUser) {
      try {
        // Force refresh token if needed (getIdToken(true) will refresh if expired)
        const token = await auth.currentUser.getIdToken(true);
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error refreshing token:", error);
        // Handle token refresh error (might be due to user being logged out)
        // Consider redirecting to login page or showing appropriate message
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle API response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract most meaningful error message
    let errorMessage = "An unexpected error occurred";
    
    if (error.response) {
      // The server responded with a status code outside of 2xx range
      if (error.response.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      }
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - could be expired token that failed to refresh
        errorMessage = "Your session has expired. Please log in again.";
        // Could automatically redirect to login page here
      } else if (error.response.status === 403) {
        errorMessage = "You don't have permission to access this resource";
      } else if (error.response.status === 404) {
        errorMessage = "The requested resource was not found";
      } else if (error.response.status >= 500) {
        errorMessage = "Server error. Please try again later";
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "No response from server. Please check your connection";
    } else {
      // Something happened in setting up the request
      errorMessage = error.message || errorMessage;
    }
    
    // You can uncomment to show toast for all API errors
    // toast.error(errorMessage);
    
    // Propagate the error for individual handling
    return Promise.reject({
      ...error,
      customMessage: errorMessage
    });
  }
);

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  // Clear error when component unmounts or when needed
  const clearError = () => setAuthError(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser?.emailVerified) {
          await currentUser.reload();
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUser({ ...currentUser, role: userData.role });
            
            // Get a fresh token - this will refresh if needed
            const token = await currentUser.getIdToken(true);
            localStorage.setItem("token", token);
          } else {
            setUser(null);
            setAuthError("User data not found");
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setAuthError(error.message || "Authentication error");
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sign up function with email verification
  const signUp = async (displayName, email, password) => {
    clearError();
    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = credentials.user;

      // Update user profile with display name
      await updateProfile(user, { displayName });

      // Ensure current user is set before sending verification
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        toast.success("Verification email sent! Please check your inbox.");
      } else {
        const error = "User authentication failed. Please try again.";
        setAuthError(error);
        toast.error(error);
        return;
      }

      // Store user in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        role: 'user',
        emailVerified: false, // Store as false initially
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      // Handle Firebase specific errors
      let errorMessage = error.message;
      
      if (errorMessage.includes("email-already-in-use")) {
        errorMessage = "This email is already registered. Please use a different email or try logging in.";
      } else if (errorMessage.includes("weak-password")) {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (errorMessage.includes("invalid-email")) {
        errorMessage = "Invalid email format. Please check your email address.";
      }
      
      setAuthError(errorMessage);
      toast.error(errorMessage);
      console.error("Error signing up:", error);
    }
  };

  // Login function (prevent access if email not verified)
  const signIn = async (email, password) => {
    clearError();
    try {
      const credentials = await signInWithEmailAndPassword(auth, email, password);
      const user = credentials.user;

      if (!user.emailVerified) {
        const error = "Your email is not verified.";
        setAuthError(error);
        toast.error(
          (t) => (
            <div>
              <p>{error}</p>
              <button
                onClick={() => {
                  resendVerificationEmail();
                  toast.dismiss(t.id);
                }}
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                Resend Email
              </button>
            </div>
          ),
          { duration: 6000 }
        );
        return;
      }

      // Fetch role from Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUser({ ...user, role: userData.role }); // Store role
        console.log(userData)
        toast.success("Signed in successfully!");
      if(userData.role==='admin')
      navigate("/admin");
      else navigate("/dashboard")
      } else {
        const error = "User profile not found. Please contact support.";
        setAuthError(error);
        toast.error(error);
        return;
      }
      
      
    } catch (error) {
      // Handle Firebase specific errors
      let errorMessage = error.message;
      
      if (errorMessage.includes("user-not-found") || errorMessage.includes("wrong-password")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (errorMessage.includes("too-many-requests")) {
        errorMessage = "Too many failed login attempts. Please try again later or reset your password.";
      } else if (errorMessage.includes("network-request-failed")) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      setAuthError(errorMessage);
      toast.error(errorMessage);
      console.error("Error signing in:", error);
    }
  };

  // Google Sign-In (Google accounts are automatically verified)
  const signInWithGoogle = async () => {
    clearError();
    const provider = new GoogleAuthProvider();
    try {
      const credentials = await signInWithPopup(auth, provider);
      const user = credentials.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let userRole = "user"; // Default role

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: "Google",
          role: userRole,
          emailVerified: true, // Google emails are always verified
          createdAt: serverTimestamp(),
        });
      } else {
        const userData = userSnap.data();
        userRole = userData.role;
        console.log(userData)
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
        setUser({ ...user, role: userRole });
        console.log(userData)
        toast.success("Signed in successfully!");
      if(userData.role==='admin')
      navigate("/admin");
      else navigate("/dashboard")
      }
    } catch (error) {
      let errorMessage = error.message;
      
      if (errorMessage.includes("popup-closed-by-user")) {
        errorMessage = "Sign-in canceled. You closed the Google login window.";
      } else if (errorMessage.includes("account-exists-with-different-credential")) {
        errorMessage = "An account already exists with the same email but different sign-in credentials.";
      }
      
      setAuthError(errorMessage);
      toast.error(errorMessage);
      console.error("Error signing in with Google:", error);
    }
  };

  // Send Password Reset Email
  const resetPassword = async (email) => {
    clearError();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error) {
      let errorMessage = error.message;
      
      if (errorMessage.includes("user-not-found")) {
        errorMessage = "No account found with this email address.";
      }
      
      setAuthError(errorMessage);
      toast.error(errorMessage);
      console.error("Error resetting password:", error);
    }
  };

  // Logout function
  const logOut = async () => {
    clearError();
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("token");
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      setAuthError(error.message);
      toast.error(error.message);
      console.error("Error logging out:", error);
    }
  };

  const resendVerificationEmail = async () => {
    clearError();
    if (!auth.currentUser) {
      const error = "No user is currently logged in. Please sign in first.";
      setAuthError(error);
      toast.error(error);
      return;
    }

    try {
      await sendEmailVerification(auth.currentUser);
      toast.success("Verification email sent again! Check your inbox.");
    } catch (error) {
      let errorMessage = error.message;
      
      if (errorMessage.includes("too-many-requests")) {
        errorMessage = "Too many verification emails sent. Please try again later.";
      }
      
      setAuthError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        clearError,
        signUp,
        signIn,
        signInWithGoogle,
        resetPassword,
        logOut,
        api, // Export the axios instance with interceptors
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};