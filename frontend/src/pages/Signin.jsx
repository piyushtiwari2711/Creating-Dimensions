import React, { useState } from 'react';
import { Mail, Lock, BookOpen } from 'lucide-react';
import { Link } from 'react-router';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup,sendPasswordResetEmail } from 'firebase/auth';
import { app, db } from '../config/firebase';
import { toast } from "react-hot-toast";
import { setDoc, doc,getDoc,serverTimestamp } from 'firebase/firestore';

function Signin() {
    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();

    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
    
    const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const promise = signInWithEmailAndPassword(auth, formData.email, formData.password);

    toast.promise(promise, {
      loading: "Signing in...",
      success: "Signed in successfully!",
      error: (err) => {
        if (err.code === "auth/wrong-password") return "Incorrect password. Try again.";
        if (err.code === "auth/user-not-found") return "No account found with this email.";
        return "Invalid credentials. Please try again.";
      },
    });

    const credentials = await promise;
    console.log("User signed in successfully", credentials.user);
  } catch (error) {
    console.error("Error signing in:", error);
  }
};

const handleGoogleSignin = async () => {
  try {
    const googleCredential = await signInWithPopup(auth, googleProvider);
    const user = googleCredential.user;
    const userRef = doc(db, "Users", user.uid);
    const userSnap = await getDoc(userRef);    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: "Google",
        createdAt: serverTimestamp(),
      });
    } else {
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    }

    toast.success("Signed in with Google!");
    console.log("Google sign-in successful:", user);
  } catch (error) {
    console.error("Error with Google sign-in:", error);

    let errorMessage = "Google sign-in failed!";
    if (error.code === "auth/popup-closed-by-user") {
      errorMessage = "Sign-in popup was closed. Try again.";
    } else if (error.code === "auth/cancelled-popup-request") {
      errorMessage = "Multiple popups detected. Please try again.";
    } else if (error.code === "auth/network-request-failed") {
      errorMessage = "Network error. Check your connection.";
    }

    toast.error(errorMessage);
  }
};

const handleForgotPassword = async () => {
  if (!formData.email) {
    toast.error("Please enter your email to reset your password.");
    return;
  }
  try {
    await sendPasswordResetEmail(auth, formData.email);
    toast.success("Password reset email sent! Check your inbox.");
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      toast.error("No account found with this email.");
    } else {
      toast.error("Failed to send reset email. Try again later.");
    }
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <BookOpen className="h-12 w-12 text-purple-600" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to access your premium notes</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="text-sm">
            <div className="font-medium text-purple-600 hover:text-purple-500" onClick={handleForgotPassword}>Forgot your password?</div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
            >
              Sign in
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGoogleSignin}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
            >
              <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" />
              Sign in with Google
            </button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-purple-600 hover:text-purple-500">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;