import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './DuesPage.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditDues() {
    const{id}=useParams();
    const navigate=useNavigate();
    const [formdata, setformdata] = useState({
        title: '',
        dueDate: '',
        amount: '',
        dueTo: '',
        currency: '',
        recurring: '',
      
    });
    const [currencies, setCurrencies] = useState([]);
    const [err,seterr]=useState('');
      const[success,setsuccess]=useState('');
      function changeHandler(e) {
        const { name,value} = e.target;
        setformdata({
          ...formdata,
          [name]:value
        })
    }
    const fetchCurrencies = async () => {
        try{
          const currencies=await axios.get('https://v6.exchangerate-api.com/v6/49a24fac31e02f399d11aba4/codes');
          setCurrencies(currencies.data.supported_codes);
        }
        catch(err){
          console.log(err)
        }
    };

    useEffect(() => {
        const getdue=async()=>{
            try{
                const response=await axios.get(`/getdue/${id}`);
                if(response.status===200){
                    setformdata(response.data);
                }
            }
            catch(err){
                console.log(err);
            }
            
        }
        getdue();
        fetchCurrencies();
    }, []);

    const editDue = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(`/edit/${id}`, formdata); // Use POST to update the due
          if (response.status === 200) {
            setsuccess('Due updated successfully');
            seterr('');
            navigate('/Dues');
          }
        } catch (err) {
          // Check if the response exists before accessing data
          if (err.response && err.response.data) {
            seterr(err.response.data.message);
          } else {
            seterr('An error occurred while updating the due.');
          }
        }
      };
      
    
  return (
    <>
    <Navbar />
      <form className="form-container" onSubmit={editDue}>
        <h1 className="page-title">Edit Bills</h1>
        
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
      </>
  )
}

export default EditDues
