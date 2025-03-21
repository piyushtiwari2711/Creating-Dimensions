import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Profile = () => {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    address: '123 Main Street, Mumbai, India',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200',
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      <div className="max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow">
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h3 className="text-2xl font-semibold">{user.name}</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="text-gray-500" size={20} />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-gray-500" size={20} />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-gray-500" size={20} />
              <span>{user.address}</span>
            </div>
          </div>
          
          <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;