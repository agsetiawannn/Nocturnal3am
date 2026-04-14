import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ClientDashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/tracking/client/dashboard')
            .then(res => res.json())
            .then(data => {
                if (data.message === 'Unauthorized') {
                    navigate('/tracking/login');
                } else {
                    setData(data);
                }
                setLoading(false);
            })
            .catch(() => navigate('/tracking/login'));
    }, [navigate]);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    if (!data?.client) return null;

    return (
        <div className="min-h-screen bg-black text-white font-sans p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-10 border-b border-white/20 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome, {data.client.name}</h1>
                        <p className="text-gray-400 mt-2">Here is your project progress.</p>
                    </div>
                    <button 
                        onClick={() => {
                            fetch('/api/tracking/logout', { method: 'POST' }).then(() => navigate('/tracking/login'));
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold transition-colors"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8" style={{ backdropFilter: 'blur(20px)' }}>
                    <h2 className="text-xl font-semibold mb-6 text-green-400">Current Phase</h2>
                    <p className="text-lg">You are currently in: <span className="font-bold text-white capitalize">{data.progress?.client_view || 'Setup'}</span></p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8" style={{ backdropFilter: 'blur(20px)' }}>
                    <h2 className="text-xl font-semibold mb-6">Recent Notes & Updates</h2>
                    {data.notes?.length > 0 ? (
                        <div className="space-y-4">
                            {data.notes.map(note => (
                                <div key={note.id} className="p-4 bg-black/40 rounded-xl border border-white/5">
                                    <p className="text-sm text-gray-400 mb-2">{new Date(note.created_at).toLocaleString()} - <strong>{note.created_by.toUpperCase()}</strong></p>
                                    <p>{note.note_text}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No updates yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
