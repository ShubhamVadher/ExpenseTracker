import React, { useState } from 'react';

function Profile() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
   //backend shubham
    console.log('Profile updated', { username, password, newPassword, confirmPassword, profilePic });
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-6">Profile</h1>

      {/* profile */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-medium mb-2">Upload Profile Picture</h2>
        {profilePic && (
          <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block mx-auto border border-gray-300 p-2 rounded-lg cursor-pointer"
        />
      </div>

        {/*change username */}
        <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">Change Username</h2>
        <input
          type="text"
          placeholder="Enter new username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* change password */}
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">Change Password</h2>
        <input
          type="password"
          placeholder="Current password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Update Profile
      </button>
    </div>
  );
}

export default Profile;
