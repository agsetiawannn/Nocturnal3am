import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
    }, [navigate]);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white font-sans p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-10 border-b border-white/20 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-gray-400 mt-2">Manage Client Workspaces</p>
                    </div>
                    <button 
                        onClick={() => {
                            fetch('/api/tracking/logout', { method: 'POST' }).then(() => navigate('/tracking/admin/login'));
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold transition-colors"
                    >
                        Log out
                    </button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8" style={{ backdropFilter: 'blur(20px)' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Active Clients</h2>
                        {/* New client feature can be built out by the user here later during their 'major design override' */}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {clients.map(client => (
                            <div key={client.id} className="p-6 bg-black/40 rounded-xl border border-white/10 hover:border-white/30 transition-colors flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">{client.name}</h3>
                                    <p className="text-sm text-gray-400">{client.email}</p>
                                </div>
                                <button className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200">
                                    Manage
                                </button>
                            </div>
                        ))}
                        {clients.length === 0 && <p className="text-gray-500">No clients found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
