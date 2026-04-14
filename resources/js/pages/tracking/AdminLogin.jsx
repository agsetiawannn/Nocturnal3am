import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/tracking/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            
            if (data.success) {
                navigate('/tracking/admin/dashboard');
            } else {
                setError(data.message || 'Login failed.');
            }
        } catch (err) {
            setError('System error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-sans">
            <div className="w-full max-w-md p-8 md:p-12 rounded-[24px] border border-white/10" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)' }}>
                <h2 className="text-3xl font-bold mb-2">Admin Login</h2>
                <p className="text-gray-400 font-light mb-8 text-sm">Studio Tigapagi Workspace</p>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-black/50 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                            placeholder="Enter system password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full mt-2 bg-white hover:bg-gray-200 text-black font-semibold rounded-xl py-3.5 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Enter Dashboard'}
                    </button>
                    <div className="text-left mt-2 text-sm text-gray-400">
                        <a href="/tracking/login" className="hover:text-white transition-colors">← Client Login</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
