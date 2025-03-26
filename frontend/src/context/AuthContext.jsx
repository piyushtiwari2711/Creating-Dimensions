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

// Create Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload();
        setUser(auth.currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Sign up function with email verification
  const signUp = async (displayName, email, password) => {
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
        toast.error("User authentication failed. Please try again.");
        return;
      }

      // Store user in Firestore
      await setDoc(doc(db, "Users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        emailVerified: false, // Store as false initially
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      toast.error(error.message);
      console.error("Error signing up:", error);
    }
  };

  // Login function (prevent access if email not verified)
  const signIn = async (email, password) => {
    try {
      const credentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = credentials.user;

      if (!user.emailVerified) {
        toast.error(
          (t) => (
            <div>
              <p>Your email is not verified.</p>
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

      toast.success("Signed in successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
      console.error("Error signing in:", error);
    }
  };

  // Google Sign-In (Google accounts are automatically verified)
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const credentials = await signInWithPopup(auth, provider);
      const user = credentials.user;
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: "Google",
          emailVerified: true, // Google emails are always verified
          createdAt: serverTimestamp(),
        });
      } else {
        await setDoc(
          userRef,
          { lastLogin: serverTimestamp() },
          { merge: true }
        );
      }
      toast.success("Signed in with Google!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
      console.error("Error signing in with Google:", error);
    }
  };

  // Send Password Reset Email
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error(error.message);
      console.error("Error resetting password:", error);
    }
  };

  // Logout function
  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      console.error("Error logging out:", error);
    }
  };

  const resendVerificationEmail = async () => {
    if (!auth.currentUser) return;

    try {
      await sendEmailVerification(auth.currentUser);
      toast.success("Verification email sent again! Check your inbox.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        resetPassword,
        logOut,
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
