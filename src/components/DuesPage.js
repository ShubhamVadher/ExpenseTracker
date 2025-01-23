import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './DuesPage.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const DuesPage = () => {
  const [formdata, setFormdata] = useState({
    title: '',
    dueDate: '',
    amount: '',
    dueTo: '',
    currency: '',
    recurring: '',
  });

  const [dues, setDues] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  function changeHandler(event) {
    const { name, type, value, checked } = event.target;
    setFormdata((prevdata) => ({
      ...prevdata,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  const fetchCurrencies = async () => {
    try {
      const response = await fetch('https://api.exchangerate.host/latest?base=USD');
      const data = await response.json();
      const currencies = Object.keys(data.rates);
      return currencies;
    } catch (error) {
      console.error('Error fetching currencies:', error);
      return [];
    }
  };

  const addDue = () => {
    setDues((prevDues) => [...prevDues, { ...formdata, id: Date.now() }]);
    setFormdata({
      title: '',
      dueDate: '',
      amount: '',
      dueTo: '',
      currency: '',
      recurring: '',
    });
  };

  const deleteDue = (id) => {
    setDues(dues.filter((due) => due.id !== id));
  };

  const editDue = (id) => {
    const dueToEdit = dues.find((due) => due.id === id);
    if (dueToEdit) {
      setFormdata(dueToEdit);
      deleteDue(id);
    }
  };

  useEffect(() => {
    const getCurrencies = async () => {
      const fetchedCurrencies = await fetchCurrencies();
      setCurrencies(fetchedCurrencies);
    };
    getCurrencies();
  }, []);

  return (
    <div className="page-container">
      <Navbar />
      <div className="form-container">
        <h1 className="page-title">Bills and Dues</h1>
        <p className="page-description">Manage your bills and remind yourself about it</p>
        <fieldset className="form-fieldset">
          <form className="dues-form">
            <label className="form-label" htmlFor="title">Title: </label>
            <input
              className="form-input"
              type="text"
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
              value={formdata.dueTo}
              onChange={changeHandler}
            />
            <label className="form-label" htmlFor="currency">Currency:</label>
            <select
              className="form-select"
              id="currency"
              name="currency"
              value={formdata.currency}
              onChange={changeHandler}
            >
              <option value="">Select Currency</option>
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
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
          <button type="button" className="form-submit-button" onClick={addDue}>
            Add Due
          </button>
        </fieldset>

        {/* Dues Table */}
        <h2>Your Dues</h2>
        <table className="dues-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Due To</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Recurring</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dues.map((due) => (
              <tr key={due.id}>
                <td>{due.title}</td>
                <td>{due.dueTo}</td>
                <td>{due.amount}</td>
                <td>{due.dueDate}</td>
                <td>{due.recurring}</td>
                <td>
                  <FaEdit
                    className="icon edit-icon"
                    onClick={() => editDue(due.id)}
                  />
                  <FaTrash
                    className="icon delete-icon"
                    onClick={() => deleteDue(due.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DuesPage;
