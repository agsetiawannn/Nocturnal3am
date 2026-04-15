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

    // Parse progress data for each phase
    const parsePhaseItems = (jsonStr) => {
        try {
            const parsed = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const onboardItems = parsePhaseItems(data.progress?.onboard);
    const presprintItems = parsePhaseItems(data.progress?.presprint);
    const sprintItems = parsePhaseItems(data.progress?.sprint);

    // Determine current phase
    const rawPhase = (data.progress?.client_view || 'onboard').toLowerCase();
    const sprintWeekFocus = data.progress?.sprint_week_focus || 1;

    // Filter sprint items by current sprint week focus
    const filteredSprintItems = sprintItems.filter(item => (item.week || 1) === sprintWeekFocus);

    // Build phase sections with their items
    const phaseSections = [
        { key: 'onboard', label: 'on_board', items: onboardItems },
        { key: 'presprint', label: 'pre_sprint', items: presprintItems },
        { key: 'sprint', label: `sprint_week${sprintWeekFocus}`, items: filteredSprintItems },
    ];

    // Find active phase
    const activePhase = phaseSections.find(p => rawPhase.includes(p.key)) || phaseSections[0];

    // Status icon component
    const StatusIcon = ({ status }) => {
        if (status === 'done' || status === 'completed') {
            // Green checkmark
            return (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            );
        }
        if (status === 'in_progress' || status === 'ongoing') {
            // Loading spinner
            return (
                <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 md:w-8 md:h-8 text-white/80 animate-spin-slow" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                </div>
            );
        }
        // Not started - red X
        return (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        );
    };

    // Format date helper
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            if (isNaN(date)) return dateStr;
            const day = date.getDate();
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            return `${day}, ${month} ${year}`;
        } catch {
            return dateStr;
        }
    };

    const handleLogout = () => {
        fetch('/api/tracking/logout', { method: 'POST' }).then(() => navigate('/tracking/login'));
    };

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
            <div className="relative z-10 w-full h-full min-h-screen p-6 md:p-10 lg:p-14 flex flex-col">
                
                {/* Header Navbar */}
                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center w-full max-w-7xl mx-auto mb-6 md:mb-16 gap-16 md:gap-0">
                    <img src="/img/tpfulllg.webp" alt="Tigapagi" className="h-[32px] md:h-[40px] opacity-90 drop-shadow-lg" />
                    <div className="flex flex-col items-start md:items-end gap-1">
                        <span className="text-white text-lg md:text-xl font-light">
                            Hi, <span className="font-normal">{data.client.name}</span>
                        </span>
                        <button 
                            onClick={handleLogout}
                            className="text-white/60 hover:text-white transition-colors cursor-pointer text-[10px] md:text-xs font-medium tracking-widest uppercase z-20 text-left md:text-right mt-1"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col justify-start pt-2 md:pt-16">
                    
                    {/* Phase Label */}
                    <p className="text-white/40 text-sm md:text-base tracking-wider font-light mb-8 md:mb-14">
                        [phase] <span className="text-white/60">{activePhase.label}</span>
                    </p>

                    {/* Phase Items Table */}
                    {activePhase.items.length > 0 ? (
                        <div className="flex flex-col gap-5 md:gap-7">
                            {activePhase.items.map((item, idx) => {
                                const itemName = item.name || item.label || item.title || `Step ${idx + 1}`;
                                const itemDate = item.date || item.deadline || '';
                                const itemStatus = item.status || 'not_started';
                                const isHighlighted = itemStatus === 'in_progress' || itemStatus === 'ongoing';
                                
                                return (
                                    <div key={idx} className="flex items-center justify-between gap-4 md:gap-8">
                                        {/* Item Info */}
                                        <div className="flex flex-col gap-1 md:gap-2 flex-1 min-w-0 pr-4">
                                            <h2 
                                                className={`tracking-tight transition-all duration-500 leading-snug
                                                ${isHighlighted 
                                                    ? 'text-white text-xl sm:text-2xl md:text-3xl font-bold' 
                                                    : 'text-white/70 text-lg sm:text-xl md:text-2xl font-normal'
                                                }`}
                                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                            >
                                                {itemName}
                                            </h2>
                                            <p 
                                                className={`tracking-tight transition-all duration-500
                                                ${isHighlighted 
                                                    ? 'text-white font-bold text-base md:text-lg' 
                                                    : 'text-white/50 text-base md:text-lg font-normal'
                                                }`}
                                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                            >
                                                {formatDate(itemDate)}
                                            </p>
                                        </div>

                                        {/* Status Icon */}
                                        <div className="flex-shrink-0">
                                            <StatusIcon status={itemStatus} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-white/30 text-lg font-light">
                            No items in this phase yet.
                        </div>
                    )}
                </div>

            </div>


            {/* Custom animation for spinner */}
            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 1.5s linear infinite;
                }
            `}</style>
        </div>
    );
}
