import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signin() {
    const navigate = useNavigate();
    const [FormData, setFormData] = useState({ email: '', password: '' });
    const [err, seterr] = useState('');

    const changed = (e) => {
        const { name, value } = e.target;
        setFormData({ ...FormData, [name]: value });
    };

    const submited = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/signin', FormData);
            if (response.status === 200) {
                navigate('/dashboard');
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                seterr(error.response.data.message);
            } else {
                seterr('Something went wrong');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
                <form onSubmit={submited} className="space-y-4">
                    <input
                        type="email"
                        required
                        name="email"
                        value={FormData.email}
                        placeholder="Email"
                        onChange={changed}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="password"
                        required
                        name="password"
                        value={FormData.password}
                        placeholder="Password"
                        onChange={changed}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                        Submit
                    </button>
                </form>
                {err && <p className="text-red-500 text-sm mt-2">{err}</p>}
                <p className="text-sm text-gray-600 mt-4 text-center">
                    Create Account?{' '}
                    <Link to="/signup" className="text-blue-500 hover:underline">
                        Click Here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signin;
