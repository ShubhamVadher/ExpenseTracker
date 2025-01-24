import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './DuesPage.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DuesPage = () => {
  const [formdata, setFormdata] = useState({
    title: '',
    dueDate: '',
    amount: '',
    dueTo: '',
    currency: '',
    recurring: '',
  
  });
  const [reload, setReload] = useState(false);
  const navigate=useNavigate();
  const [err,seterr]=useState('');
  const[success,setsuccess]=useState('');
  const [dues, setDues] = useState([]);
 
  const [currencies, setCurrencies] = useState([]);

  function changeHandler(e) {
    const { name,value} = e.target;
    setFormdata({
      ...formdata,
      [name]:value
    })
  }

  const fetchCurrencies = async () => {
    try{
      const currencies=await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_API_KEY_CURRENCY}/codes`);
      setCurrencies(currencies.data.supported_codes);
    }
    catch(err){
      console.log(err)
    }
  };

  const addDue = async (e) => {
    e.preventDefault();
    try{
      const response=await axios.post('/adddues',formdata);
      if(response.status===200){
        const {id}=response.data;
        setDues((prevDues) => [
          ...prevDues,
          { ...formdata, id:id }, 
        ]);
        setsuccess('Due added to your account')
        seterr('');
        const updatedDues = await axios.get('/loaddues');
        if (updatedDues.status === 200) {
          setDues(updatedDues.data.dues); // Update dues state with fresh data
        }
        // setReload((prev) => !prev);
      }
    }
    catch(err){
      
      seterr(err.response.data.message);
      setsuccess('');
    }
    setFormdata({
      title: '',
      dueDate: '',
      amount: '',
      dueTo: '',
      currency: '',
      recurring: '',

    });
  };

  const deleteDue = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this due?');
  
    if (isConfirmed) {
      try {
        const response = await axios.get(`/deletedue/${id}`);
        if (response.status === 200) {
          
          const updatedDues = await axios.get('/loaddues');
          if (updatedDues.status === 200) {
            setDues(updatedDues.data.dues); // Update dues state with fresh data
          }
        }
      } catch (error) {
        window.alert('Could not delete the due. Please try again.');
      }
    }
    
  };
  

  const editDue = async(id) => {
    
    navigate(`/editdues/${id}`);
  };

  useEffect(() => {
    const getdues=async()=>{
      try{
        const response=await axios.get('/loaddues');
        if(response.status===200){
          setDues(response.data.dues);
        }
      }
      catch (err) {
        console.error(err); // Log the error for debugging
        window.alert('Unable to load dues. Please try again later.');
    }

    }
    getdues();
    fetchCurrencies();
  }, []);

  return (
    <div className="page-container">
      <Navbar />
      <form className="form-container" onSubmit={addDue}>
        <h1 className="page-title">Bills and Dues</h1>
        <p className="page-description">Manage your bills and remind yourself about it</p>
        <fieldset className="form-fieldset">
          <form className="dues-form">
            <label className="form-label" htmlFor="title">Title: </label>
            <input
              className="form-input"
              type="text"
              required
              placeholder="Enter Title"
              onChange={changeHandler}
              name="title"
              value={formdata.title}
            />
            <label className="form-label" htmlFor="dueDate">Due Date:</label>
            <input
              className="form-input"
              type="date"
              id="dueDate"
              required
              name="dueDate"
              value={formdata.dueDate}
              onChange={changeHandler}
            />
            <label className="form-label" htmlFor="amount">Amount:</label>
            <input
              className="form-input"
              placeholder="Enter amount"
              type="text"
              id="amount"
              name="amount"
              required
              value={formdata.amount}
              onChange={changeHandler}
            />
            <label className="form-label" htmlFor="dueTo">Due To:</label>
            <input
              className="form-input"
              placeholder="Enter recipient"
              type="text"
              id="dueTo"
              name="dueTo"
              required
              value={formdata.dueTo}
              onChange={changeHandler}
            />
            <label className="form-label" htmlFor="currency">Currency:</label>
            <select
              className="form-select"
              id="currency"
              name="currency"
              required
              value={formdata.currency}
              onChange={changeHandler}
            >
              <option value="">Select Currency</option>
              {currencies.map(([code,name]) => (
                <option key={code} value={code}>
                  {code}: {name}
                </option>
              ))}
            </select>
            


            <label className="form-label" htmlFor="recurring">Recurring: </label>
            <select
              className="form-select"
              name="recurring"
              onChange={changeHandler}
              value={formdata.recurring}
              id="recurring"
            >
              <option value="">Select a value</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </form>
          <button type="submit" className="form-submit-button">
            Add Due
          </button>
        </fieldset>

        <p>{err}</p>
        <p>{success}</p>
      </form>
      {/* Dues Table */}
      <h2>Your Dues</h2>
        <table className="dues-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Due To</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Due Date</th>
              <th>Recurring</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dues.map((due) => (
              <tr key={due._id}>
                <td>{due.title}</td>
                <td>{due.due_to?.name || 'Unknown'}</td>
                <td>{due.amount}</td>
                <td>{due.currency}</td>
                <td>{new Date(due.due_date).toLocaleDateString('en-GB')}</td>
                <td>{due.recurring}</td>
                <td>
                  <FaEdit
                    className="icon edit-icon"
                    onClick={() => editDue(due._id)}
                  />
                  <FaTrash
                    className="icon delete-icon"
                    onClick={() => deleteDue(due._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};

export default DuesPage;
