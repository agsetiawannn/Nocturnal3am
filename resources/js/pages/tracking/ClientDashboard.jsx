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

    // Normalization of current phase
    const rawPhase = (data.progress?.client_view || 'onboard').toLowerCase().replace('_', ' ');
    
    // Determine active index
    const phases = ['onboard', 'pre sprint', 'sprint week'];
    const activeIndex = phases.findIndex(p => rawPhase.includes(p)) !== -1 
        ? phases.findIndex(p => rawPhase.includes(p)) 
        : 0; 
        
    return (
        <div className="relative min-h-screen bg-black overflow-hidden flex flex-col font-sans">
            {/* Background Layer 1 - bg.webp */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
                <div
                    className="animate-pan-smooth h-full"
                    style={{
                        width: '300%',
                        backgroundImage: 'url(/img/bg.webp)',
                        backgroundSize: '50% auto',
                        backgroundRepeat: 'repeat-x',
                        backgroundPosition: 'center',
                        opacity: 0.95,
                    }}
                />
                {/* Safari-safe GPU blur overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{ backdropFilter: 'blur(100px)', WebkitBackdropFilter: 'blur(100px)' }} />
            </div>

            {/* Background Layer 2 - glass_mirror.webp */}
            <div
                className="absolute inset-0 bg-cover bg-center pointer-events-none"
                style={{
                    backgroundImage: 'url(/img/glass_mirror.webp)',
                    opacity: 0.35,
                    zIndex: 2
                }}
            />

            {/* Gradient Top */}
            <div
                className="absolute top-0 left-0 right-0 h-[300px] md:h-[300px] pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0) 100%)',
                    zIndex: 5
                }}
            />

            {/* Gradient Bottom */}
            <div
                className="absolute bottom-0 left-0 right-0 h-[200px] md:h-[200px] pointer-events-none"
                style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
                    zIndex: 5
                }}
            />

            {/* Content Container */}
            <div className="relative z-10 w-full h-full min-h-screen p-8 md:p-12 lg:p-16 flex flex-col justify-between">
                
                {/* Header Navbar */}
                <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
                    <img src="/img/tp lg.webp" alt="Tigapagi Logo" className="w-[100px] md:w-[130px] opacity-90 drop-shadow-lg" />
                    <button 
                        onClick={() => {
                            fetch('/api/tracking/logout', { method: 'POST' }).then(() => navigate('/tracking/login'));
                        }}
                        className="text-white/60 hover:text-white transition-colors cursor-pointer text-xs md:text-sm font-medium tracking-widest uppercase z-20"
                    >
                        Sign Out
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col justify-center my-12">
                    <h1 className="text-white/80 text-xl md:text-3xl font-light mb-12" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Hi, <span className="font-semibold text-white drop-shadow-md">{data.client.name}</span>
                    </h1>

                    <div className="flex flex-col gap-6 md:gap-8 justify-center">
                        {phases.map((phase, idx) => {
                            const isActive = idx === activeIndex;

                            return (
                                <div key={phase} className="flex items-center gap-6">
                                    <div 
                                        className={`tracking-tight uppercase transition-all duration-700 ease-out drop-shadow-2xl
                                        ${isActive ? 'text-white text-[50px] sm:text-[70px] md:text-[90px] lg:text-[110px] font-black opacity-100' : 'text-white/30 text-[24px] sm:text-[30px] md:text-[40px] font-bold opacity-40'}`}
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                    >
                                        {phase}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Optional: Footer or Notes section */}
                {data.notes?.length > 0 && (
                     <div className="w-full max-w-7xl mx-auto mt-auto flex flex-col gap-4 z-20">
                        <p className="text-white/40 text-xs md:text-sm tracking-widest uppercase font-semibold">Latest Updates</p>
                        <div className="max-h-[150px] overflow-y-auto pr-4 space-y-3 custom-scrollbar">
                            {data.notes.map(note => (
                                <div key={note.id} className="p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                    <p className="text-[10px] md:text-xs text-white/50 mb-1 uppercase tracking-wider">{new Date(note.created_at).toLocaleDateString()} - {note.created_by}</p>
                                    <p className="text-sm text-white/90 font-light leading-relaxed">{note.note_text}</p>
                                </div>
                            ))}
                        </div>
                     </div>
                )}
            </div>
        </div>
    );
}
