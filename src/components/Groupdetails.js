import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
function Groupdetails() {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [grpErr, setGrpErr] = useState('');
    const [formData, setFormData] = useState({
        dueAmount: '',
        name: '',
        description: '',
        members: [],
    });
    const [addDueErr, setAddDueErr] = useState('');
    const [dues, setDues] = useState([]);
    const [getDueErr, setGetDueErr] = useState('');

    useEffect(() => {
        getGroup();
    }, []);

    useEffect(() => {
        if (group) {
            getDues();
        }
    }, [group]);

    const getGroup = async () => {
        try {
            const response = await axios.get(`/getgroup/${id}`);
            if (response.status === 200) {
                setGroup(response.data.group);
                setGrpErr('');
            }
        } catch (err) {
            setGrpErr(err.response?.data?.message);
        }
    };

    const getDues = async () => {
        try {
            const response = await axios.get(`/getgrpdue/${group._id}`);
            if (response.status === 200) {
                setDues(response.data.dues);
                setGetDueErr('');
            }
        } catch (err) {
            setGetDueErr(err.response?.data?.message || 'Error fetching dues');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/addgrpdue/${group._id}`, formData);
            if (response.status === 200) {
                getDues();
            }
        } catch (err) {
            setAddDueErr(err.response?.data?.message || 'Error adding due');
        }
    };

    return (<>
        <Navbar />
        <div className="flex px-3 space-x-6 justify-between">
           
            {/* Left Side: Group Details */}
            <div className="w-96 ">
                {grpErr && <p className="text-red-500">{grpErr}</p>}
                {group && (
                    <div className="bg-white p-6 rounded-lg shadow-md border space-y-6 w-full">
                        <h1 className="text-2xl font-bold">{group.grp_name}</h1>
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md border">
                            <h2 className="text-lg font-bold mb-2">Admin</h2>
                            <p className="text-gray-700">{group.grp_admin.name}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md border">
                            <h2 className="text-lg font-bold mb-2">Members</h2>
                            <ul className="text-gray-700 space-y-2 overflow-y-auto h-40">
                                {group.grp_members.length > 0 ? (
                                    group.grp_members.map((member, index) => (
                                        <li key={index} className="border-b pb-1">{member.name}</li>
                                    ))
                                ) : (
                                    <p>No members yet.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Middle: Dues List */}
            <div className="w-96 bg-white p-6 rounded-lg shadow-md border h-[89vh] overflow-y-scroll">
                <h2 className="text-xl font-bold">Dues</h2>
                {getDueErr && <p className="text-red-500">{getDueErr}</p>}

                {/* The scroll will appear only after 4 items */}
                <ul className="space-y-4">
                    {dues.length > 0 ? (
                        dues.map((due, index) => {
                            const memberCount = due.members.length || 1;
                            const amountPerMember = (due.dueAmount / memberCount).toFixed(2);

                            return (
                                <li key={index} className="p-4 border rounded-lg h-fit shadow-sm bg-gray-50">
                                    <h3 className="text-lg font-semibold">{due.name}</h3>
                                    <p className="text-gray-600">Description: {due.description}</p>
                                    <p className="text-gray-600">
                                        Due Amount: <span className="font-bold">${amountPerMember}</span> per member
                                    </p>
                                    <p className="text-gray-600">Members: {memberCount}</p>
                                </li>
                            );
                        })
                    ) : (
                        <p>No dues available.</p>
                    )}
                </ul>
            </div>

            {/* Right Side: Add Due Form */}
            <div className="w-96 h-[70vh]">
                <form onSubmit={handleSubmit} className="bg-white px-2 pb-4 rounded-lg shadow-md border space-y-6">
                    <h2 className="text-xl font-bold">Add Due Information</h2>
                    <div>
                        <label htmlFor="dueAmount" className="block font-semibold">Due Amount</label>
                        <input
                            type="number"
                            id="dueAmount"
                            name="dueAmount"
                            value={formData.dueAmount}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded w-full"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="block font-semibold">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded w-full"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block font-semibold">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded w-full resize-none"
                            rows="4"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="members" className="block font-semibold">Members</label>
                        <div className="mt-1 p-2 border rounded w-full h-24 overflow-y-scroll">
                            {group && group.grp_members.length > 0 ? (
                                group.grp_members.map((member, index) => (
                                    <label key={index} className="block">
                                        <input 
                                            type="checkbox" 
                                            value={member._id} 
                                            checked={formData.members.includes(member._id)}
                                            onChange={(e) => {
                                                const selectedMembers = formData.members.includes(member._id)
                                                    ? formData.members.filter(m => m !== member._id)
                                                    : [...formData.members, member._id];
                                                setFormData({ ...formData, members: selectedMembers });
                                            }}
                                        /> {member.name}
                                    </label>
                                ))
                            ) : (
                                <p>No members to select</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md font-semibold">
                            Submit
                        </button>
                    </div>
                </form>
                {addDueErr && <p className="text-red-500">{addDueErr}</p>}
            </div>
        </div>
        </>
    );
}

export default Groupdetails;
