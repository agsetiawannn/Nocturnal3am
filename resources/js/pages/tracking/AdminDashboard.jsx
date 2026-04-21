import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [addError, setAddError] = useState('');
    const [addLoading, setAddLoading] = useState(false);

    const fetchClients = () => {
        fetch('/api/tracking/admin/dashboard')
            .then(res => res.json())
            .then(data => {
                if (data.message === 'Unauthorized') {
                    navigate('/tracking/admin/login');
                } else {
                    setClients(data.clients || []);
                }
                setLoading(false);
            })
            .catch(() => navigate('/tracking/admin/login'));
    };

    useEffect(() => {
        fetchClients();
    }, [navigate]);

    const handleAddClient = async (e) => {
        e.preventDefault();
        setAddError('');
        setAddLoading(true);

        try {
            const res = await fetch('/api/tracking/admin/client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({ name: newName, email: newEmail })
            });
            const data = await res.json();

            if (data.success) {
                setNewName('');
                setNewEmail('');
                setShowAddForm(false);
                fetchClients();
            } else {
                setAddError(data.message || 'Failed to add client.');
            }
        } catch (err) {
            setAddError('System error. Please try again.');
        } finally {
            setAddLoading(false);
        }
    };

    const handleDeleteClient = async (id, name) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all their progress and notes.`)) return;

        try {
            await fetch(`/api/tracking/admin/client/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
            });
            fetchClients();
        } catch (err) {
            alert('Failed to delete client.');
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white font-sans p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-10 border-b border-white/20 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-gray-400 mt-2">Manage Client Workspaces</p>
                    </div>
                    <div className="flex gap-3 items-center">
                        <button 
                            onClick={() => navigate('/tracking/admin/settings')}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors"
                        >
                            Admin Settings
                        </button>
                        <button 
                            onClick={() => {
                                fetch('/api/tracking/logout', { method: 'POST' }).then(() => navigate('/tracking/admin/login'));
                            }}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold transition-colors"
                        >
                            Log out
                        </button>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8" style={{ backdropFilter: 'blur(20px)' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Active Clients</h2>
                        <button 
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={showAddForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
                            </svg>
                            {showAddForm ? 'Cancel' : 'Add Client'}
                        </button>
                    </div>

                    {/* Add Client Form */}
                    {showAddForm && (
                        <form onSubmit={handleAddClient} className="mb-6 p-5 bg-white/5 rounded-xl border border-white/10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Client Name</label>
                                    <input 
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="Enter client name"
                                        required
                                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Client Email</label>
                                    <input 
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        placeholder="Enter client email"
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
                                className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                            >
                                {addLoading ? 'Adding...' : 'Add Client'}
                            </button>
                        </form>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {clients.map(client => (
                            <div key={client.id} className="p-6 bg-black/40 rounded-xl border border-white/10 hover:border-white/30 transition-colors flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">{client.name}</h3>
                                    <p className="text-sm text-gray-400">{client.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => navigate(`/tracking/admin/client/${client.id}`)}
                                        className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Manage
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteClient(client.id, client.name)}
                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Delete client"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {clients.length === 0 && <p className="text-gray-500">No clients found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
