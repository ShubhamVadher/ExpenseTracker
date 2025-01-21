import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();
    const [FormData, setFormData] = useState({ email: '', password: '', name: '', cpassword: '' });
    const [err, seterr] = useState('');
    const [showotp, setshowotp] = useState(false);
    const [otp, setotp] = useState('');
    const [attempts, setAttempts] = useState(3);
    const [otperr, setotperr] = useState('');

    const changed = (e) => {
        const { name, value } = e.target;
        setFormData({ ...FormData, [name]: value });
    };

    const submited = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/signup', FormData);
            if (response.status === 200) {
                setshowotp(true);
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                seterr(error.response.data.message);
            } else {
                seterr('Something went wrong');
            }
        }
    };

    const resetForm = () => {
        setFormData({ email: '', password: '', name: '', cpassword: '' });
        setotp('');
        setAttempts(3);
        seterr('');
    };

    const otpsubmitted = async (e) => {
        e.preventDefault();
        if (attempts <= 0) {
            resetForm();
            return;
        }

        try {
            const response = await axios.post('/signupotp', { otp, email: FormData.email, attempts_left: attempts });
            if (response.status === 200) {
                navigate('/dashboard');
            }
        } catch (error) {
            const remainingAttempts = attempts - 1;
            setAttempts(remainingAttempts);
            if (remainingAttempts <= 0) {
                setotperr('');
                setshowotp(false);
                resetForm();
            } else {
                setotperr(`Invalid OTP. You have ${remainingAttempts} attempts remaining.`);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
                <form onSubmit={submited} className="space-y-4">
                    <input
                        type="text"
                        required
                        name="name"
                        value={FormData.name}
                        placeholder="Name"
                        onChange={changed}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
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
                    <input
                        type="password"
                        required
                        name="cpassword"
                        value={FormData.cpassword}
                        placeholder="Confirm Password"
                        onChange={changed}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                        Submit
                    </button>
                </form>
                {err && <p className="text-red-500 text-sm mt-2">{err}</p>}
                {showotp && (
                    <form onSubmit={otpsubmitted} className="mt-4 space-y-2">
                        <input
                            type="text"
                            placeholder="OTP"
                            value={otp}
                            onChange={(e) => setotp(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
                            Submit
                        </button>
                        {otperr && <p className="text-red-500 text-sm">{otperr}</p>}
                    </form>
                )}
                <p className="text-sm text-gray-600 mt-4 text-center">
                    Already have an account?{' '}
                    <Link to="/" className="text-blue-500 hover:underline">
                        Click Here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
