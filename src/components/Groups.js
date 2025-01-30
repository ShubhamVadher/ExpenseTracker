import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Navbar from './Navbar';
import axios from "axios";

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [grpErr, setGrpErr] = useState('');
    const [showMemberPopup, setShowMemberPopup] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [memberId, setMemberId] = useState('');
    const [addMemberErr, setAddMemberErr] = useState('');
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [submissionStatus, setSubmissionStatus] = useState(null); // For add member form

    useEffect(() => {
        fetchUserData();
        getGroups();
    }, []);

    const fetchUserData = async () => {
        setLoadingUser(true);
        try {
            const response = await axios.get('/getuser'); // Your endpoint
            if (response.status === 200) {
                setUser(response.data.user);
            } else {
                console.error("Error fetching user data:", response.status);
                setError("Failed to fetch user data.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setError("Failed to fetch user data.");
        } finally {
            setLoadingUser(false);
        }
    };

    const getGroups = async () => {
        try {
            const response = await axios.get('/getgroups');
            if (response.status === 200) {
                setGroups(response.data.Groups);
            }
        } catch (err) {
            console.error("Error fetching groups:", err);
            setError(err.response?.data.message || 'Error fetching groups');
        }
    };

    const addGroup = () => {
        setShowPopup(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/creategroup', { grp_name: newGroupName });
            if (response.status === 200) {
                getGroups();
                setShowPopup(false);
                setGrpErr('');
                setNewGroupName('');
            }
        } catch (err) {
            setGrpErr(err.response?.data.message);
        }
    };

    const openMemberPopup = (group) => {
        setSelectedGroup(group);
        setShowMemberPopup(true);
        setMemberId('');
        setAddMemberErr('');
        setSubmissionStatus(null); // Reset submission status
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        setSubmissionStatus("submitting"); // Set submission status
        setAddMemberErr("");

        try {
            const response = await axios.post(`/addmember/${selectedGroup._id}`, { member_id: memberId });
            if (response.status === 200) {
                setShowMemberPopup(false);
                setMemberId('');
                setSelectedGroup(null);
                getGroups();
                setSubmissionStatus("success"); // Set submission status
            } else {
                console.error("Unexpected success status:", response.status);
                setAddMemberErr(response.data.message || "An unexpected error occurred. Please try again.");
                setSubmissionStatus("error"); // Set submission status
            }
        } catch (err) {
            console.error("Error response:", err.response);
            const errorMessage = err.response?.data?.message || 'An error occurred';
            setAddMemberErr(errorMessage);
            setSubmissionStatus("error"); // Set submission status
        }
    };

    const isGroupAdmin = (group) => {
        //if (loadingUser || !user || !group || !group.grp_admin) return false; // Check for ALL necessary data
        return group.grp_admin === user._id;
    };

    return (
        <>
            <Navbar />
            <div className="p-6 max-w-lg mx-auto">
                <h1 className="text-2xl font-bold mb-4">Groups</h1>
                <div className="grid gap-4">
                    {groups.reverse().map((group, index) => (
                        <div key={index} className="p-4 shadow-md border rounded-lg flex justify-between items-center">
                            {group.grp_name}
                            {isGroupAdmin(group) && (
                                <button onClick={() => openMemberPopup(group)} className="text-black hover:text-blck">
                                    <Plus size={20} />
                                </button>
                            )}
                        </div>
                    ))}
                    <p className="text-red-500">{error}</p>
                </div>
            </div>

            <button onClick={addGroup} className="fixed bottom-6 right-6 bg-blue-500 text-white rounded-full p-4 flex items-center justify-center transition-all group hover:rounded-xl hover:px-6">
                <Plus size={24} />
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Create Group</span>
            </button>

            {showPopup && (
                <form onSubmit={handleSubmit} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-lg font-bold mb-4">Create Group</h2>
                        <input
                            type="text"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Enter group name"
                            required
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowPopup(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Create</button>
                        </div>
                        <p className="text-red-500">{grpErr}</p>
                    </div>
                </form>
            )}

            {showMemberPopup && (
                <form onSubmit={handleAddMember} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-lg font-bold mb-4">Add Member to {selectedGroup?.grp_name}</h2>
                        <input
                            type="text"
                            value={memberId}
                            onChange={(e) => setMemberId(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Enter Member ID"
                            required
                        />
                        <p className="text-red-500">{addMemberErr}</p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowMemberPopup(false)} className="px-4 py-2 bg-gray-300 rounded" disabled={submissionStatus === "submitting"}>Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" disabled={submissionStatus === "submitting"}>
                                {submissionStatus === "submitting" ? "Adding..." : "Add"}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};

export default Groups;