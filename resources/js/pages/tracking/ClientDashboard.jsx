import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';

export default function ClientDashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const footerRef = useRef(null);
    const [isFooterVisible, setIsFooterVisible] = useState(false);

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

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsFooterVisible(entry.isIntersecting);
            },
            {
                root: null,
                threshold: 0,
            }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => {
            if (footerRef.current) {
                observer.unobserve(footerRef.current);
            }
        };
    }, [data, loading]); // Attach observer after loading is done

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

    // Calculate dynamic dates: only delayed items get an additional day
    const displayItems = activePhase.items.map(item => {
        const isDelayed = item.is_delayed === true || item.is_delayed === 'true';
        let itemDate = item.date || item.deadline || '';

        if (isDelayed && itemDate) {
            try {
                const dateObj = new Date(itemDate);
                if (!isNaN(dateObj)) {
                    dateObj.setDate(dateObj.getDate() + 1);
                    itemDate = dateObj.toISOString();
                }
            } catch (e) { }
        }

        return { ...item, displayDate: itemDate };
    });

    const StatusIcon = ({ status }) => {
        if (status === 'done' || status === 'completed') {
            return (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#16d110] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            );
        }
        if (status === 'in_progress' || status === 'ongoing') {
            return (
                <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-white animate-spin-slow" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                </div>
            );
        }
        return (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
            return `${day} ${month} ${year}`;
        } catch {
            return dateStr;
        }
    };

    const handleLogout = () => {
        fetch('/api/tracking/logout', { method: 'POST' }).then(() => navigate('/tracking/login'));
    };

    return (
        <div className="relative min-h-screen bg-black flex flex-col font-sans">
            {/* Main Content Area with Background */}
            <div className="relative flex-1 flex flex-col w-full">
                {/* Background Layer 1 - bg.webp */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
                    <div
                        className="h-full w-full bg-cover bg-center animate-bg-zoom"
                        style={{
                            backgroundImage: 'url(/img/bg.webp)',
                            opacity: 0.95,
                        }}
                    />
                    {/* Safari-safe GPU blur overlay */}
                    <div className="absolute inset-0" style={{ backdropFilter: 'blur(100px)', WebkitBackdropFilter: 'blur(100px)' }} />
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
                    className="absolute top-0 left-0 right-0 h-[300px] pointer-events-none"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0) 100%)',
                        zIndex: 5
                    }}
                />

                {/* Gradient Bottom - Transition to black at footer border */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-[250px] md:h-[350px] pointer-events-none"
                    style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0) 100%)',
                        zIndex: 5
                    }}
                />

                {/* Content Container */}
            <div className="relative z-10 w-full h-full min-h-screen p-6 pb-32 md:p-10 md:pb-40 lg:p-14 lg:pb-48 flex flex-col flex-1">

                {/* Header Navbar */}
                    <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center w-full max-w-7xl mx-auto mb-6 md:mb-16 gap-16 md:gap-0">
                        <img src="/img/tpfulllg.webp" alt="Tigapagi" className="h-[32px] md:h-[40px] opacity-90 drop-shadow-lg" />
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 md:gap-1">
                            <span className="text-white text-lg md:text-xl font-light">
                                Hi, <span className="font-normal">{data.client.name}</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-white/60 hover:text-white transition-colors cursor-pointer text-[10px] md:text-xs font-medium tracking-widest uppercase z-20 whitespace-nowrap mt-1 md:mt-0"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col justify-start pt-2 md:pt-16">
                        {/* Phase Label */}
                        <h1 className="-ml-[2px] md:-ml-[4px] text-white text-2xl sm:text-3xl md:text-5xl font-normal mb-10 md:mb-14 tracking-normal" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                            [phase] {activePhase.label}
                        </h1>

                        {/* Phase Items Table */}
                        {displayItems.length > 0 ? (
                            <div className="flex flex-col gap-5 md:gap-7">
                                {displayItems.map((item, idx) => {
                                    const isDelayed = item.is_delayed === true || item.is_delayed === 'true';
                                    const itemName = item.name || item.label || item.title || `Step ${idx + 1}`;
                                    const itemDate = item.displayDate || '';
                                    const itemStatus = item.status || 'not_started';
                                    const isHighlighted = itemStatus === 'in_progress' || itemStatus === 'ongoing';

                                    return (
                                        <React.Fragment key={idx}>
                                            <div className={`flex items-center justify-between w-full md:grid md:grid-cols-[1fr_auto_auto] md:gap-x-12 lg:gap-x-24 gap-4 md:py-2 ${isDelayed ? 'pb-7 md:pb-8 lg:pb-10' : ''}`}>
                                                {/* Item Name & Mobile Date */}
                                                <div className="flex flex-col gap-1 md:gap-0 flex-1 min-w-0 pr-4">
                                                    <h2
                                                        className={`tracking-tight transition-all duration-500 leading-snug
                                                        ${isHighlighted
                                                                ? 'text-white text-xl sm:text-2xl md:text-4xl lg:text-[40px] font-bold'
                                                                : 'text-white/70 text-lg sm:text-xl md:text-2xl lg:text-[32px] font-normal'
                                                            }`}
                                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                                    >
                                                        {itemName}
                                                    </h2>
                                                    {/* Date on Mobile */}
                                                    <div className="md:hidden flex flex-col items-start mt-0.5">
                                                        <div className="relative flex flex-col items-start">
                                                            <p
                                                                className={`tracking-tight transition-all duration-500
                                                                ${isHighlighted
                                                                        ? 'text-white font-bold text-[13px] sm:text-sm md:text-lg'
                                                                        : 'text-white/50 text-[13px] sm:text-sm md:text-lg font-normal'
                                                                    }`}
                                                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                                            >
                                                                {formatDate(itemDate)}
                                                            </p>
                                                            {isDelayed && (
                                                                <span className="absolute top-full left-0 mt-1 bg-[#f00000] text-white text-[10px] sm:text-[11px] px-1.5 py-0.5 whitespace-nowrap" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                                    [delayed due to revision +1 day]
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Date on Desktop */}
                                                <div className="hidden md:flex items-center justify-center">
                                                    <div className="relative flex flex-col items-center justify-center w-[180px] lg:w-[220px]">
                                                        <p
                                                            className={`tracking-tight transition-all duration-500 text-center
                                                            ${isHighlighted
                                                                    ? 'text-white font-bold md:text-3xl lg:text-[34px]'
                                                                    : 'text-white/50 md:text-2xl lg:text-[28px] font-normal'
                                                                }`}
                                                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                                                        >
                                                            {formatDate(itemDate)}
                                                        </p>
                                                        {isDelayed && (
                                                            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 lg:mt-2 bg-[#f00000] text-white text-[11px] lg:text-xs px-2 py-0.5 whitespace-nowrap" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                                [delayed due to revision +1 day]
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Status Icon */}
                                                <div className="flex-shrink-0">
                                                    <StatusIcon status={itemStatus} />
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-white/30 text-lg font-light">
                                No items in this phase yet.
                            </div>
                        )}
                    </div>

                    {/* Legend (Fixed or Absolute when footer is visible) */}
                    <div className={`${isFooterVisible ? 'absolute' : 'fixed'} bottom-12 right-6 md:bottom-16 md:right-16 lg:bottom-20 lg:right-20 flex flex-row flex-wrap justify-end gap-3 md:gap-8 items-center z-[60] max-w-[calc(100vw-3rem)] md:max-w-none`}>
                        <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-white text-[11px] md:text-xs font-normal tracking-wide drop-shadow-md">Done</span>
                            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#16d110] flex flex-shrink-0 items-center justify-center shadow-lg">
                                <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-white text-[11px] md:text-xs font-normal tracking-wide drop-shadow-md">On-Progress</span>
                            <div className="w-4 h-4 md:w-5 md:h-5 flex flex-shrink-0 items-center justify-center drop-shadow-lg">
                                <svg className="w-[18px] h-[18px] md:w-[22px] md:h-[22px] text-white animate-spin-slow" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-white text-[11px] md:text-xs font-normal tracking-wide drop-shadow-md">Not Started, yet.</span>
                            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-red-500 flex flex-shrink-0 items-center justify-center shadow-lg">
                                <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div ref={footerRef} className="relative z-10 w-full mt-auto">
                <Footer />
            </div>

            {/* Custom animation for spinner and background zoom */}
            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 1.5s linear infinite;
                }
                @keyframes bg-zoom {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.15); }
                }
                .animate-bg-zoom {
                    animation: bg-zoom 20s alternate infinite ease-in-out;
                }
            `}</style>
        </div>
    );
}
