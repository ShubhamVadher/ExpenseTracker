import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUsername] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [traErr,setTraErr]=useState('');
  const [formData, setFormData] = useState({
    categories: "",
    startdate: "",
    enddate: "",

    Transaction: "",
    Currency: "",
    Amount: "",
    Category: "",
    Description: "",
    Date: "",
  });

  const[transactions,settrasaction]=useState([]);
  
  const gettrasections = async () => {
    try {
      const response = await axios.get('/gettransections');
      if (response.status === 200) {
        console.log('Transactions:', response.data.transactions); // Debugging
        settrasaction(response.data.transactions);
      }
    } catch (err) {
      console.log(err.response?.data?.message || 'Error fetching transactions');
    }
  };


  const [currencies, setCurrencies] = useState([]);
  const fetchCurrencies = async () => {
    try{
      const currencies=await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_API_KEY_CURRENCY}/codes`);
      setCurrencies(currencies.data.supported_codes);
    }
    catch(err){
      console.log(err)
    }
  };
  //adding a transection
  const addTransection=async(e)=>{
    e.preventDefault();
    try{
      const response=await axios.post('/addtransection',{type:formData.Transaction,currency:formData.Currency,amount:formData.Amount,catagory:formData.Category,date:formData.Date})
      if(response.status===200){
        //more to add here
        setTraErr('');
        gettrasections();
        setIsModalOpen(!isModalOpen);
      }
    }
    catch(err){
      console.log(err);
      setTraErr(err.response.data.message);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/dashboard");
        if (response.status === 200) {
          setUsername(response.data.user.name);
        }
      } catch (error) {
        console.error(error);
        navigate("/");
      }
    }
    fetchData();
    fetchCurrencies();
    gettrasections();
  }, [navigate]);


  const changeHandler = (event) => {
    const { name, type, value, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Welcome, {userName}!
        </h1>
        <p className="text-gray-600 mb-6">Let's add some transactions!</p>

        <div className="flex justify-between items-center mb-6">
          <button className="px-4 py-2 bg-blue-800 text-white rounded-md">
            Income ₹0
          </button>
          <button className="px-4 py-2 bg-blue-800 text-white rounded-md">
            Balance ₹0
          </button>
          <button className="px-4 py-2 bg-blue-800 text-white rounded-md">
            Expense ₹0
          </button>
        </div>

        <form className="bg-white p-6 rounded-md shadow-md grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label
              htmlFor="categories"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              name="categories"
              id="categories"
              value={formData.categories}
              onChange={changeHandler}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="Select All">All Categories</option>
            </select>
          </div>

          <div>
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

          <div>
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
        </form>

        <div className="mt-4 flex justify-end gap-4">
          <button className="px-4 py-2 bg-blue-800 text-white rounded-md">
            Apply Filter
          </button>
          <button className="px-4 py-2 bg-blue-800 text-white rounded-md">
            Export CSV
          </button>
        </div>
        <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Transactions</h1>

      <div className="min-h-screen bg-gray-100">
      

        {transactions.length === 0 ? (
          <p className="text-gray-600">No transactions to display</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {transactions.map((transaction, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-md p-4 border border-gray-200"
              >
                <h2 className="text-lg font-bold text-gray-800 mb-2">
                  {transaction.transection_type}
                </h2>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Currency:</span>{" "}
                  {transaction.currency}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Amount:</span> 
                  {transaction.amount}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Category:</span>{" "}
                  {transaction.catagory}
                </p>
                
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(transaction.date).toLocaleDateString("en-GB")} {/* en-GB for dd/mm/yyyy */}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
      
    </div>

        <button
          className="fixed bottom-4 right-4 bg-blue-800 text-white text-2xl rounded-full p-3 shadow-md"
          onClick={toggleModal}
        >
          +
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h1 className="text-xl font-bold mb-4">Add Transaction</h1>
              <form onSubmit={addTransection}>
                <label htmlFor="Transaction" className="block mb-2">
                  Transaction Type
                </label>
                <select
                  name="Transaction"
                  id="Transaction"
                  value={formData.Transaction}
                  onChange={changeHandler}
                  className="block w-full border-gray-300 rounded-md mb-4"
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>

                <label htmlFor="Currency" className="block mb-2">
                  Currency
                </label>
                <select
                  className="form-select"
                  id="currency"
                  name="Currency"
                  required
                  value={formData.Currency}
                  onChange={changeHandler}
                >
                  <option value="">Select Currency</option>
                  {currencies.map(([code,name]) => (
                    <option key={code} value={code}>
                      {code}: {name}
                    </option>
                  ))}
                </select>

                <label htmlFor="Amount" className="block mb-2">
                  Amount
                </label>
                <input
                  placeholder="Enter amount"
                  type="text"
                  name="Amount"
                  value={formData.Amount}
                  onChange={changeHandler}
                  className="block w-full border-gray-300 rounded-md mb-4 placeholder:border-gray-300 placeholder:rounded-md placeholder:shadow-sm"
                />

                <label htmlFor="Category" className="block mb-2">
                  Category
                </label>
                <input
                  placeholder="Enter category"
                  type="text"
                  name="Category"
                  value={formData.Category}
                  onChange={changeHandler}
                  className="block w-full border-gray-300 rounded-md mb-4 placeholder:border-gray-300 placeholder:rounded-md placeholder:shadow-sm"
                />

                <label htmlFor="Description" className="block mb-2">
                  Description
                </label>
                <input
                  placeholder="Enter description"
                  type="text"
                  name="Description"
                  value={formData.Description}
                  onChange={changeHandler}
                  className="block w-full border-gray-300 rounded-md mb-4 placeholder:border-gray-300 placeholder:rounded-md placeholder:shadow-sm"
                />

                <label htmlFor="Date" className="block mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="Date"
                  value={formData.Date}
                  onChange={changeHandler}
                  className="block w-full border-gray-300 rounded-md mb-4"
                />

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-800 text-white rounded-md"
                    onClick={toggleModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                  >
                    Save
                  </button>
                  <p>{traErr}</p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default Dashboard;
