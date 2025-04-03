import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: user.displayName || "",
    email: user.email || "",
    phoneNumber: "",
    address: "", // will be updated from Firestore
  });

  const [error, setError] = useState(null);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setEditForm((prev) => ({
              ...prev,  
              phoneNumber:userData.phoneNumber,
              address: userData.address || "", // update address if exists in Firestore
            }));
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          toast.error("Failed to fetch user data!");
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Profile Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update Firebase Authentication Profile
      await updateProfile(user, {
        displayName: editForm.displayName,
        phoneNumber: editForm.phoneNumber,
      });
      await user.reload();

      // Update Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: editForm.displayName,
        phoneNumber: editForm.phoneNumber,
        address: editForm.address,
      });

      setEditForm({
        ...editForm,
        displayName: editForm.displayName,
        phoneNumber: editForm.phoneNumber,
        address: editForm.address,
      });
      console.log(editForm)
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error("Failed to update profile!");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      <div className="max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow">
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)}>
                <X size={20} />
              </button>
            </div>
          )}

          <div className="flex flex-col items-center mb-6">
            <img
              src={user.photoURL || "/user.png"}
              alt={user.displayName || "User"}
              className="w-32 h-32 rounded-full object-fit mb-4"
            />
            {isEditing ? (
              <input
                type="text"
                name="displayName"
                value={editForm.displayName}
                onChange={handleInputChange}
                className="text-2xl font-semibold text-center border-b-2 border-blue-500 focus:outline-none"
              />
            ) : (
              <h3 className="text-2xl font-semibold">{user.displayName}</h3>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="text-gray-500" size={20} />
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  disabled // Email should not be editable
                  className="flex-1 border-b border-gray-300 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-gray-500" size={20} />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editForm.phoneNumber}
                  onChange={handleInputChange}
                  className="flex-1 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-500" size={20} />
                <input
                  type="text"
                  name="address"
                  value={editForm.address}
                  onChange={handleInputChange}
                  className="flex-1 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({
                      displayName: user.displayName,
                      email: user.email,
                      phoneNumber: user.phoneNumber,
                      address: user.address || "", // reset to original address
                    });
                    setError(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-gray-500" size={20} />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-gray-500" size={20} />
                  <span>{editForm.phoneNumber || "Not set"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-gray-500" size={20} />
                  <span>{editForm.address || "Not set"}</span>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
