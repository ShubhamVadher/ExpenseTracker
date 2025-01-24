import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

function Stocks() {
    const [company, setcompany] = useState('');
    const [symbol, setsymbol] = useState('');
    const [stockdetail, setstockdetails] = useState(null);
    const [loading, setLoading] = useState(false); 
    const [err, seterr] = useState('');

    useEffect(() => {
        if (symbol !== "") {
            const getStockDetails = async () => {
                setLoading(true); 
                try {
                    const res = await axios.get(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${process.env.REACT_APP_API_KEY_STOCK}`);
                    console.log('Stock Info Response:', res.data);
                    if (res.data) {
                        setstockdetails(res.data);
                    }
                } catch (err) {
                    console.error("Error fetching stock information:", err);
                } finally {
                    setLoading(false);
                }
            };

            getStockDetails();
        }
    }, [symbol]); 

    const getstockinfo = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.get(`https://api.twelvedata.com/symbol_search?symbol=${company}&apikey=${process.env.REACT_APP_API_KEY_STOCK}`);
            console.log('Symbol Search Response:', response.data); 
            
            if (response.data.data && response.data.data.length > 0) {
                for (let stock of response.data.data) {
                    if (stock.exchange === "NASDAQ") {
                        setsymbol(stock.symbol); 
                        seterr('');
                        break; 
                    }
                }
            } else {
                seterr('Make sure Company name is correct And Registered in NASDAQ');
            }
            setstockdetails(null);

        } catch (err) {
            console.error("Error fetching stock information:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <Navbar />
            <div className="max-w-xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
                <h1 className="text-3xl font-semibold text-center mb-6 text-green-400">Stock Information</h1>

                <form onSubmit={getstockinfo} className="mb-6">
                    <input 
                        type="text" 
                        placeholder='Search Company' 
                        name="company" 
                        value={company} 
                        onChange={(e) => setcompany(e.target.value)} 
                        className="w-full p-4 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-black"
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300">Search</button>
                </form>

                {/* Display Loading if data is being fetched */}
                {loading && <div className="text-center text-yellow-400">Loading...</div>}

                {/* Render Stock Details when available */}
                {stockdetail && !loading && (
                    <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4 text-center">{stockdetail.name}</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-lg">
                                <p><strong>Current Price: </strong>
                                    <span className={stockdetail.close >= stockdetail.open ? 'text-green-500' : 'text-red-500'}>
                                        ${stockdetail.close}
                                    </span>
                                </p>
                            </div>
                            <div className="flex justify-between items-center text-lg">
                                <p><strong>Open Price: </strong>${stockdetail.open}</p>
                            </div>
                            <div className="flex justify-between items-center text-lg">
                                <p><strong>Previous Close Price: </strong>${stockdetail.previous_close}</p>
                            </div>
                            <div className="flex justify-between items-center text-lg">
                                <p><strong>Highest Price: </strong>${stockdetail.high}</p>
                            </div>
                            <div className="flex justify-between items-center text-lg">
                                <p><strong>Lowest Price: </strong>${stockdetail.low}</p>
                            </div>
                            <div className="flex justify-between items-center text-lg">
                                <p><strong>Volume: </strong>{stockdetail.volume}</p>
                            </div>
                            <div className="flex justify-between items-center text-lg">
                                <p><strong>Market Status: </strong>
                                    <span className={stockdetail.is_market_open ? 'text-green-500' : 'text-red-500'}>
                                        {stockdetail.is_market_open ? 'Open' : 'Closed'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {err && <p className="text-red-500 text-center mt-4">{err}</p>}
            </div>
        </div>
    );
}

export default Stocks;



