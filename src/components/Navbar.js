import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate=useNavigate();
  
  const logout = async (e) => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return; // Exit if user cancels

    try {
      const response = await axios.get('/logout');
      if (response.status === 200) {
        navigate('/');
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };


  return (
    <div className="flex justify-between items-center p-4 bg-white text-black">
      {/*  Logo */}
      <Link to='/dashboard' className="text-xl font-semibold">
        <p>Logo</p>
      </Link>

      {/*buttins*/}
      <nav className="flex space-x-4">
      <Link to='/Dues'>
        <button className="px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
           Dues
        </button>
      </Link>
      
        <button className="px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">Groups</button>
        <button className="px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">Savings</button>
        <button className="px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">Charts</button>
        <Link to='/stocks'>
          <button className="px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">Stocks</button>
        </Link>
        
      </nav>

      {/*profile pic */}
      <div className="flex items-center space-x-4">
        <Link to='/profile/*'>
        <img src="/path-to-profile-pic.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
        </Link>
        <button onClick={logout} className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md logout-btn">
          Logout
        </button>
      </div>
      
    </div>
  );
};

export default Navbar;
