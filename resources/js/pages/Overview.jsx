import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Overview() {
    const [trackingData, setTrackingData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/tracking/public')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setTrackingData(data.tracking);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Parse progress data for each phase
    const parsePhaseItems = (jsonStr) => {
        try {
            const parsed = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            if (isNaN(date)) return dateStr;
            const day = date.getDate();
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
        } catch {
            return dateStr;
        }
    };

    const getStatusInfo = (activeUntil) => {
        if (!activeUntil) return { color: 'text-green-400', bg: 'bg-green-500/15', border: 'border-green-500/30', dot: 'bg-green-400', expired: false };
        
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const untilDate = new Date(activeUntil);
        untilDate.setHours(0, 0, 0, 0);
        const daysLeft = Math.ceil((untilDate - now) / (1000 * 60 * 60 * 24));
        
        if (daysLeft < 0) {
            return { color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/30', dot: 'bg-red-400', expired: true };
        }
        if (daysLeft <= 7) {
            return { color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/30', dot: 'bg-orange-400', expired: false };
        }
        return { color: 'text-green-400', bg: 'bg-green-500/15', border: 'border-green-500/30', dot: 'bg-green-400', expired: false };
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-sans text-xl tracking-widest uppercase">Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white font-sans w-full" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <div className="p-6 md:p-14 lg:p-20 pt-32 md:pt-40 pb-20">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tighter" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Active Projects
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl mb-12 lg:mb-20 font-light max-w-2xl">
                        A real-time overview of our current clients and their ongoing creative phases.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {trackingData.map(clientData => {
                            const { name, progress, active_until } = clientData;
                            const onboard = parsePhaseItems(progress?.onboard);
                            const presprint = parsePhaseItems(progress?.presprint);
                            const sprint = parsePhaseItems(progress?.sprint);
                            const alacarte = parsePhaseItems(progress?.alacarte);
                            
                            // Determine current active item
                            let activeItem = null;
                            let activePhase = '';
                            let activeItemIndex = -1;
                            
                            const findActive = (items, phaseName) => {
                                const idx = items.findIndex(i => i.status === 'in_progress' || i.status === 'ongoing');
                                if (idx !== -1 && !activeItem) {
                                    activeItem = items[idx];
                                    activePhase = phaseName;
                                    activeItemIndex = idx;
                                }
                            };

                            let visiblePhases = [];
                            const rawCV = progress?.client_view || 'onboard';
                            try {
                                const parsed = JSON.parse(rawCV);
                                visiblePhases = Array.isArray(parsed) ? parsed : [rawCV];
                            } catch {
                                visiblePhases = [rawCV];
                            }

                            if (visiblePhases.includes('onboard')) findActive(onboard, 'on_board');
                            if (visiblePhases.includes('presprint')) findActive(presprint, 'pre_sprint');
                            if (visiblePhases.includes('sprint')) findActive(sprint, 'sprint');
                            if (visiblePhases.includes('alacarte')) findActive(alacarte, 'a_la_carte');

                            const displayPhase = activePhase || (visiblePhases.length > 0 ? visiblePhases[0] : 'onboard');
                            const statusInfo = getStatusInfo(active_until);

                            return (
                                <Link to={`/overview/client/${clientData.id}`} key={clientData.id} className="block cursor-pointer">
                                    <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-[24px] hover:border-white/30 transition-colors backdrop-blur-md flex flex-col h-full group relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="flex flex-col items-start mb-6 gap-2">
                                        <h3 className="text-2xl md:text-3xl font-medium">{name}</h3>
                                        {active_until ? (
                                            <div className={`px-3 py-1 ${statusInfo.bg} rounded-full text-xs ${statusInfo.color} whitespace-nowrap border ${statusInfo.border} inline-flex items-center gap-1.5`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></div>
                                                {statusInfo.expired ? 'Expired since' : 'Active until'} {formatDate(active_until)}
                                            </div>
                                        ) : (
                                            <div className={`px-3 py-1 bg-green-500/15 rounded-full text-xs text-green-400 whitespace-nowrap border border-green-500/30 inline-flex items-center gap-1.5`}>
                                                <div className={`w-1.5 h-1.5 rounded-full bg-green-400`}></div>
                                                Active
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 flex-1">
                                        <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Current Phase</div>
                                        <div className="text-lg text-white font-light" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                                            [phase] {displayPhase.replace('_', ' ')}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 flex flex-col gap-2">
                                        <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">In Progress</div>
                                        {activeItem ? (
                                            <div className="flex flex-col mt-1">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${statusInfo.dot} flex-shrink-0 animate-pulse`}></div>
                                                    <span className="text-white text-base md:text-lg">
                                                        {activeItem.name || activeItem.label || activeItem.title || `Step ${activeItemIndex + 1}`}
                                                    </span>
                                                </div>
                                                {(activeItem.date || activeItem.displayDate) && (
                                                    <div className="text-gray-400 text-sm ml-5 mt-1 font-light" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                                                        {formatDate(activeItem.date || activeItem.displayDate)}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-gray-400 italic mt-1 text-sm">No active tasks</div>
                                        )}
                                    </div>
                                    </div>
                                </Link>
                            );
                        })}
                        
                        {trackingData.length === 0 && (
                            <div className="col-span-full py-20 text-center text-gray-500 text-lg">
                                No active projects found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
