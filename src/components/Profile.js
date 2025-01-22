import axios from 'axios';
import React, { useState } from 'react';

function Profile() {
  const [formdata,setformdata]=useState({username:'',password:'',newpassword:'',cnewpassword:''});
  const [profilePic, setProfilePic] = useState(null);
  const [err,seterr]=useState('');
  const [confirmation,setconfirmation]=useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handlechange=(e)=>{
    const {name,value}=e.target;
    setformdata({...formdata,[name]:value});
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post('/editprofile', formdata); // Send formdata directly
      if (response.status === 200) {
        setconfirmation('Profile updated successfully');
        seterr('');
        setformdata({ username: '', password: '', newpassword: '', cnewpassword: '' });
      }
    } catch (error) {
      seterr(error.response?.data?.message || "An error occurred");
      setconfirmation('')
      setformdata({ username: '', password: '', newpassword: '', cnewpassword: '' });
    }
  };
  

  return (
    <form className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
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
          name='username'
          value={formdata.username}
          onChange={handlechange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* change password */}
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">Change Password</h2>
        <input
          type="password"
          placeholder="Current password"
          name="password"
          value={formdata.password}
          onChange={handlechange}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="New password"
          name='newpassword'
          value={formdata.newpassword}
          onChange={handlechange}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          name='cnewpassword'
          value={formdata.cnewpassword}
          onChange={handlechange}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Update Profile
      </button>
      <p className='text-red-700'>{err}</p>
      <p className='text-green-600'>{confirmation}</p>
    </form>
  );
}

export default Profile;
