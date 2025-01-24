import React from 'react';
import Navbar from './Navbar'; 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUsername] = useState();
  const [formData, setFormData] = useState({
    categories: "",
    startdate: "",
    enddate: "",
  });

  useEffect(() => {
    async function fetchdata() {
      try {
        const response = await axios.get('/dashboard');
        if (response.status === 200) {
          setUsername(response.data.user.name); // Use response.data
        }
      } catch (error) {
        console.log(error);
        navigate('/');
      }
    }
    fetchdata();
  }, [navigate]);

  const changeHandler = (event) => {
    const { name, type, value, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> 

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {userName}</h1>

        <form className="bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label
              htmlFor="categories"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Categories
            </label>
            <select
              name="categories"
              id="categories"
              value={formData.categories}
              onChange={changeHandler}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="Select All">Select All</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="startdate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Start Date
            </label>
            <input
              type="date"
              name="startdate"
              value={formData.startdate}
              onChange={changeHandler}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="enddate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              End Date
            </label>
            <input
              type="date"
              name="enddate"
              value={formData.enddate}
              onChange={changeHandler}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Apply Filter
          </button>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;
