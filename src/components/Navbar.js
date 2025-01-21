import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-white text-black">
      {/*  Logo */}
      <Link to='/dashboard' className="text-xl font-semibold">
        <p>Logo</p>
      </Link>

      {/*buttins*/}
      <nav className="flex space-x-4">
        <button className="px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">Dues</button>
        <button className="px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">Groups</button>
        <button className="px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">Savings</button>
        <button className="px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">Charts</button>
        <button className="px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">Stocks</button>
      </nav>

      {/*profile pic */}
      <div className="flex items-center space-x-4">
        <Link to='/profile/*'>
        <img src="/path-to-profile-pic.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
