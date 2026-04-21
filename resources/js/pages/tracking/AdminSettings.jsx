import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminSettings() {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form states
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [addError, setAddError] = useState('');
    const [addLoading, setAddLoading] = useState(false);

    const [passwordChangeId, setPasswordChangeId] = useState(null);
    const [updatePassword, setUpdatePassword] = useState('');
    const [updateError, setUpdateError] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);

    const fetchAdmins = () => {
        fetch('/api/tracking/admin/accounts')
            .then(res => res.json())
            .then(data => {
                if (data.message === 'Unauthorized') {
                    navigate('/tracking/admin/login');
                } else {
                    setAdmins(data.admins || []);
                    setCurrentId(data.current_id);
                }
                setLoading(false);
            })
            .catch(() => navigate('/tracking/admin/login'));
    };

    useEffect(() => {
        fetchAdmins();
    }, [navigate]);

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setAddError('');
        setAddLoading(true);

        try {
            const res = await fetch('/api/tracking/admin/account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({ username: newUsername, password: newPassword })
            });
            const data = await res.json();

            if (data.success) {
                setNewUsername('');
                setNewPassword('');
                setShowAddForm(false);
                fetchAdmins();
            } else {
                setAddError(data.message || 'Failed to add admin. Username might exist or password too short.');
            }
        } catch (err) {
            setAddError('System error. Please try again.');
        } finally {
            setAddLoading(false);
        }
    };

    const handleUpdatePassword = async (e, id) => {
        e.preventDefault();
        setUpdateError('');
        setUpdateLoading(true);

        try {
            const res = await fetch(`/api/tracking/admin/account/${id}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({ password: updatePassword })
            });
            const data = await res.json();

            if (data.success) {
                setUpdatePassword('');
                setPasswordChangeId(null);
                alert('Password updated successfully!');
            } else {
                setUpdateError(data.message || 'Failed to update password. Password must be at least 6 characters.');
            }
        } catch (err) {
            setUpdateError('System error. Please try again.');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleDeleteAdmin = async (id, username) => {
        if (!confirm(`Are you sure you want to delete admin context "${username}"?`)) return;

        try {
            const res = await fetch(`/api/tracking/admin/account/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
            });
            const data = await res.json();
            
            if (data.success) {
                fetchAdmins();
            } else {
                alert(data.message || 'Failed to delete admin.');
            }
        } catch (err) {
            alert('Failed to delete admin.');
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white font-sans p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-10 border-b border-white/20 pb-6">
                    <div>
                        <button 
                            onClick={() => navigate('/tracking/admin/dashboard')}
                            className="text-gray-400 hover:text-white text-sm mb-2 flex items-center gap-1 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-bold">Admin Settings</h1>
                        <p className="text-gray-400 mt-2">Manage Admin Accounts and Passwords</p>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8" style={{ backdropFilter: 'blur(20px)' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Admin Users</h2>
                        <button 
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={showAddForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
                            </svg>
                            {showAddForm ? 'Cancel' : 'Add Admin'}
                        </button>
                    </div>

                    {showAddForm && (
                        <form onSubmit={handleAddAdmin} className="mb-6 p-5 bg-white/5 rounded-xl border border-white/10">
                            <h3 className="text-md font-semibold mb-3">Create New Admin</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Username</label>
                                    <input 
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        placeholder="Enter admin username"
                                        required
                                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Password</label>
                                    <input 
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Minimum 6 characters"
                                        required
                                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors text-sm"
                                    />
                                </div>
                            </div>
                            {addError && (
                                <p className="text-red-400 text-sm mb-3">{addError}</p>
                            )}
                            <button 
                                type="submit" 
                                disabled={addLoading}
                                className="px-6 py-2.5 bg-[#16d110] hover:bg-[#11b00c] text-black text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(22,209,16,0.3)]"
                            >
                                {addLoading ? 'Adding...' : 'Create Admin Account'}
                            </button>
                        </form>
                    )}

                    <div className="flex flex-col gap-4">
                        {admins.map(admin => (
                            <div key={admin.id} className="p-6 bg-black/40 rounded-xl border border-white/10 hover:border-white/30 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-lg">{admin.username}</h3>
                                        {admin.id === currentId && (
                                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-semibold rounded-full uppercase tracking-wider border border-blue-500/30">
                                                You
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">ID: {admin.id}</p>
                                </div>
                                
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    {passwordChangeId === admin.id ? (
                                        <form onSubmit={(e) => handleUpdatePassword(e, admin.id)} className="flex items-center gap-2 w-full">
                                            <input 
                                                type="password"
                                                value={updatePassword}
                                                onChange={(e) => setUpdatePassword(e.target.value)}
                                                placeholder="New Password"
                                                required
                                                className="flex-1 w-full md:w-48 bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors text-sm"
                                            />
                                            <button 
                                                type="submit" 
                                                disabled={updateLoading}
                                                className="px-4 py-2 bg-[#16d110] text-black text-sm font-semibold rounded-lg hover:bg-[#11b00c] transition-colors"
                                            >
                                                Save
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setPasswordChangeId(null)}
                                                className="px-4 py-2 bg-white/10 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </form>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={() => {
                                                    setPasswordChangeId(admin.id);
                                                    setUpdatePassword('');
                                                    setUpdateError('');
                                                }}
                                                className="px-4 py-2 bg-white/10 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-colors whitespace-nowrap"
                                            >
                                                Change Password
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteAdmin(admin.id, admin.username)}
                                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                                                    admin.id === currentId 
                                                    ? 'bg-red-500/10 text-red-500/50 cursor-not-allowed opacity-50' 
                                                    : 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white'
                                                }`}
                                                title={admin.id === currentId ? "Cannot delete your own account" : "Delete admin account"}
                                                disabled={admin.id === currentId}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                        {updateError && (
                            <p className="text-red-400 text-sm mt-2">{updateError}</p>
                        )}
                        {admins.length === 0 && <p className="text-gray-500">No admins found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
