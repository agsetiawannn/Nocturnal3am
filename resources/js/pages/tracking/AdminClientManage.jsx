import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function AdminClientManage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notifyClient, setNotifyClient] = useState(true);

    // Phase config
    const phaseKeys = ['onboard', 'presprint', 'sprint', 'alacarte'];
    const phaseLabels = { onboard: 'On Board', presprint: 'Pre Sprint', sprint: 'Sprint Week', alacarte: 'A La Carte' };

    const [visiblePhases, setVisiblePhases] = useState(['onboard']);
    const [sprintWeekFrom, setSprintWeekFrom] = useState(1);
    const [sprintWeekTo, setSprintWeekTo] = useState(1);
    const [alacarteFocus, setAlacarteFocus] = useState(1);
    const [alacarteTo, setAlacarteTo] = useState(1);
    const [phaseItems, setPhaseItems] = useState({
        onboard: [],
        presprint: [],
        sprint: [],
        alacarte: [],
    });
    const [alacarteTitles, setAlacarteTitles] = useState({});

    const parseItems = (jsonStr) => {
        try {
            const parsed = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const fetchData = () => {
        fetch(`/api/tracking/admin/client/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.message === 'Unauthorized') {
                    navigate('/tracking/admin/login');
                    return;
                }
                setClient(data.client);
                setProgress(data.progress);

                if (data.progress) {
                    // Parse client_view as array (backward compat with old single string)
                    let cv = data.progress.client_view || 'onboard';
                    try {
                        const parsed = JSON.parse(cv);
                        cv = Array.isArray(parsed) ? parsed : [cv];
                    } catch {
                        cv = [cv];
                    }
                    setVisiblePhases(cv);
                    setSprintWeekFrom(data.progress.sprint_week_focus || 1);
                    setSprintWeekTo(data.progress.sprint_week_to || data.progress.sprint_week_focus || 1);
                    setAlacarteFocus(data.progress.alacarte_focus || 1);
                    setAlacarteTo(data.progress.alacarte_to || data.progress.alacarte_focus || 1);
                    setPhaseItems({
                        onboard: parseItems(data.progress.onboard),
                        presprint: parseItems(data.progress.presprint),
                        sprint: parseItems(data.progress.sprint),
                        alacarte: parseItems(data.progress.alacarte),
                    });
                    
                    try {
                        const titles = typeof data.progress.alacarte_titles === 'string' ? JSON.parse(data.progress.alacarte_titles) : (data.progress.alacarte_titles || {});
                        setAlacarteTitles(titles);
                    } catch {
                        setAlacarteTitles({});
                    }
                }
                setLoading(false);
            })
            .catch(() => navigate('/tracking/admin/login'));
    };

    useEffect(() => {
        fetchData();
    }, [id, navigate]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`/api/tracking/admin/client/${id}/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({
                    onboard: phaseItems.onboard,
                    presprint: phaseItems.presprint,
                    sprint: phaseItems.sprint,
                    alacarte: phaseItems.alacarte,
                    alacarte_titles: alacarteTitles,
                    client_view: JSON.stringify(visiblePhases),
                    sprint_week_focus: sprintWeekFrom,
                    sprint_week_to: sprintWeekTo,
                    alacarte_focus: alacarteFocus,
                    alacarte_to: alacarteTo,
                    notify_client: notifyClient,
                })
            });
            
            if (!response.ok) {
                throw new Error('Server returned an error.');
            }

            fetchData();
            if (notifyClient) {
                alert('Saved successfully! Update notification has been sent correctly to the client.');
                setNotifyClient(false);
            } else {
                alert('Saved successfully!');
            }
        } catch (err) {
            alert('Failed to save.');
        } finally {
            setSaving(false);
        }
    };

    const addItem = (phase, week) => {
        const newItem = { name: '', date: '', status: 'not_started' };
        if (phase === 'sprint') newItem.week = week || sprintWeekFrom;
        if (phase === 'alacarte') newItem.week = week || 1;
        setPhaseItems(prev => ({
            ...prev,
            [phase]: [...prev[phase], newItem]
        }));
    };

    const updateItem = (phase, index, field, value) => {
        setPhaseItems(prev => {
            const updated = [...prev[phase]];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, [phase]: updated };
        });
    };

    const removeItem = (phase, index) => {
        setPhaseItems(prev => ({
            ...prev,
            [phase]: prev[phase].filter((_, i) => i !== index)
        }));
    };

    const removeWeek = (phase, weekNum) => {
        const label = phase === 'alacarte' ? 'A La Carte' : 'Sprint';
        if (!confirm(`Are you sure you want to delete ${label} Week ${weekNum} and all its items?`)) return;
        setPhaseItems(prev => ({
            ...prev,
            [phase]: prev[phase].filter(item => (item.week || 1) !== weekNum)
        }));
    };

    // Renders the grouped-by-week editor (used for both Sprint and A La Carte)
    const renderWeekGroupedEditor = (phase, focusWeekFrom, focusWeekTo) => {
        const items = phaseItems[phase];
        const weeks = [...new Set(items.map(item => item.week || 1))].sort((a, b) => a - b);
        if (!weeks.includes(focusWeekFrom)) weeks.push(focusWeekFrom);
        if (!weeks.includes(focusWeekTo)) weeks.push(focusWeekTo);
        weeks.sort((a, b) => a - b);

        return (
            <>
                {weeks.map(weekNum => {
                    const weekItems = items
                        .map((item, idx) => ({ ...item, originalIdx: idx }))
                        .filter(item => (item.week || 1) === weekNum);
                    const isFocusWeek = weekNum >= focusWeekFrom && weekNum <= focusWeekTo;

                    return (
                        <div key={`${phase}-week-${weekNum}`} className={`mb-8 bg-white/5 border rounded-xl p-5 ${isFocusWeek ? 'border-white/30' : 'border-white/10'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                    {phase === 'alacarte' ? (
                                        <input 
                                            type="text" 
                                            value={alacarteTitles[weekNum] || 'A La Carte'}
                                            onChange={(e) => setAlacarteTitles({...alacarteTitles, [weekNum]: e.target.value})}
                                            className="text-lg font-semibold bg-transparent border-b border-white/20 focus:outline-none focus:border-white transition-colors"
                                        />
                                    ) : (
                                        <h3 className="text-lg font-semibold">Sprint Week {weekNum}</h3>
                                    )}
                                    {isFocusWeek && (
                                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-semibold rounded-full uppercase tracking-wider border border-green-500/30">
                                            Active Focus
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => removeWeek(phase, weekNum)}
                                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete Week
                                    </button>
                                    <button 
                                        onClick={() => addItem(phase, weekNum)}
                                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Item
                                    </button>
                                </div>
                            </div>

                            {weekItems.length === 0 && (
                                <p className="text-gray-500 text-sm">No items for this week.</p>
                            )}

                            <div className="flex flex-col gap-3">
                                {weekItems.map((item) => (
                                    <div key={item.originalIdx} className="flex items-center gap-3 bg-black/30 rounded-lg p-3 border border-white/5">
                                        <input 
                                            type="text"
                                            value={item.name || ''}
                                            onChange={(e) => updateItem(phase, item.originalIdx, 'name', e.target.value)}
                                            placeholder="Task name"
                                            className="flex-1 bg-transparent border border-white/15 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/40 transition-colors"
                                        />
                                        <input 
                                            type="date"
                                            value={item.date || ''}
                                            onChange={(e) => updateItem(phase, item.originalIdx, 'date', e.target.value)}
                                            className="bg-transparent border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40 transition-colors"
                                        />
                                        <select
                                            value={item.status || 'not_started'}
                                            onChange={(e) => updateItem(phase, item.originalIdx, 'status', e.target.value)}
                                            className="bg-black border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40 transition-colors"
                                        >
                                            <option value="not_started">Not Started</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="done">Done</option>
                                        </select>
                                        <button 
                                            onClick={() => updateItem(phase, item.originalIdx, 'is_delayed', !item.is_delayed)}
                                            className={`px-3 py-2 rounded-lg transition-colors flex-shrink-0 text-xs font-semibold border ${
                                                (item.is_delayed === true || item.is_delayed === 'true')
                                                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 hover:bg-orange-500/30' 
                                                    : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/10'
                                            }`}
                                            title={item.is_delayed ? 'Remove Delay Status' : 'Mark as Delayed'}
                                        >
                                            Delay
                                        </button>
                                        <button 
                                            onClick={() => removeItem(phase, item.originalIdx)}
                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Add New Week Button */}
                <button 
                    onClick={() => {
                        const allWeeks = items.map(item => item.week || 1);
                        const maxWeek = allWeeks.length > 0 ? Math.max(...allWeeks) : 0;
                        addItem(phase, maxWeek + 1);
                    }}
                    className="mb-8 w-full py-3 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-xl text-white/50 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add New {phase === 'alacarte' ? 'A La Carte' : 'Sprint Week'}
                </button>
            </>
        );
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    if (!client) return null;

    return (
        <div className="min-h-screen bg-black text-white font-sans p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-white/20 pb-6">
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
                        <h1 className="text-2xl md:text-3xl font-bold">{client.name}</h1>
                        <p className="text-gray-400 text-sm mt-1">{client.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-white/70 hover:text-white transition-colors select-none">
                            <input 
                                type="checkbox" 
                                checked={notifyClient}
                                onChange={(e) => setNotifyClient(e.target.checked)}
                                className="w-4 h-4 rounded border-white/20 bg-black/50 accent-[#16d110] cursor-pointer"
                            />
                            Kirim Email Notifikasi & Update Client
                        </label>
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2.5 bg-[#16d110] hover:bg-[#11b00c] text-black text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer w-full shadow-[0_0_15px_rgba(22,209,16,0.3)]"
                        >
                            {saving ? 'Saving...' : 'Save All Updates'}
                        </button>
                    </div>
                </div>

                {/* Client View Phase Selector - Multi Select */}
                <div className="mb-8 bg-white/5 border border-white/10 rounded-xl p-5">
                    <label className="block text-sm text-gray-400 mb-3">Client Visible Phases <span className="text-white/30">(select multiple)</span></label>
                    <div className="flex flex-wrap gap-2">
                        {phaseKeys.map(key => {
                            const isSelected = visiblePhases.includes(key);
                            return (
                                <button
                                    key={key}
                                    onClick={() => {
                                        setVisiblePhases(prev => 
                                            isSelected 
                                                ? prev.filter(p => p !== key) 
                                                : [...prev, key]
                                        );
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        isSelected 
                                            ? 'bg-white text-black' 
                                            : 'bg-white/10 text-white/60 hover:bg-white/20'
                                    }`}
                                >
                                    {phaseLabels[key]}
                                </button>
                            );
                        })}
                    </div>
                    {visiblePhases.includes('sprint') && (
                        <div className="mt-4 flex items-center gap-3">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Sprint Week From</label>
                                <input 
                                    type="number" 
                                    min="1"
                                    value={sprintWeekFrom}
                                    onChange={(e) => {
                                        const v = parseInt(e.target.value) || 1;
                                        setSprintWeekFrom(v);
                                        if (v > sprintWeekTo) setSprintWeekTo(v);
                                    }}
                                    className="w-20 bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                            <span className="text-white/40 mt-5">→</span>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Sprint Week To</label>
                                <input 
                                    type="number" 
                                    min={sprintWeekFrom}
                                    value={sprintWeekTo}
                                    onChange={(e) => setSprintWeekTo(Math.max(parseInt(e.target.value) || 1, sprintWeekFrom))}
                                    className="w-20 bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                        </div>
                    )}
                    {visiblePhases.includes('alacarte') && (
                        <div className="flex gap-6 mt-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">A La Carte From</label>
                                <input 
                                    type="number" 
                                    min="1"
                                    value={alacarteFocus}
                                    onChange={(e) => setAlacarteFocus(parseInt(e.target.value) || 1)}
                                    className="w-24 bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                            <div className="flex items-center mt-6 text-gray-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">A La Carte To</label>
                                <input 
                                    type="number" 
                                    min="1"
                                    value={alacarteTo}
                                    onChange={(e) => setAlacarteTo(parseInt(e.target.value) || 1)}
                                    className="w-24 bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Phase Items Editor - On Board & Pre Sprint */}
                {['onboard', 'presprint'].map(phase => (
                    <div key={phase} className="mb-8 bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{phaseLabels[phase]} Items</h3>
                            <button 
                                onClick={() => addItem(phase)}
                                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Item
                            </button>
                        </div>

                        {phaseItems[phase].length === 0 && (
                            <p className="text-gray-500 text-sm">No items yet. Click "Add Item" to get started.</p>
                        )}

                        <div className="flex flex-col gap-3">
                            {phaseItems[phase].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-black/30 rounded-lg p-3 border border-white/5">
                                    <input 
                                        type="text"
                                        value={item.name || ''}
                                        onChange={(e) => updateItem(phase, idx, 'name', e.target.value)}
                                        placeholder="Task name"
                                        className="flex-1 bg-transparent border border-white/15 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/40 transition-colors"
                                    />
                                    <input 
                                        type="date"
                                        value={item.date || ''}
                                        onChange={(e) => updateItem(phase, idx, 'date', e.target.value)}
                                        className="bg-transparent border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40 transition-colors"
                                    />
                                    <select
                                        value={item.status || 'not_started'}
                                        onChange={(e) => updateItem(phase, idx, 'status', e.target.value)}
                                        className="bg-black border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40 transition-colors"
                                    >
                                        <option value="not_started">Not Started</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="done">Done</option>
                                    </select>
                                    <button 
                                        onClick={() => updateItem(phase, idx, 'is_delayed', !item.is_delayed)}
                                        className={`px-3 py-2 rounded-lg transition-colors flex-shrink-0 text-xs font-semibold border ${
                                            (item.is_delayed === true || item.is_delayed === 'true')
                                                ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 hover:bg-orange-500/30' 
                                                : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/10'
                                        }`}
                                        title={item.is_delayed ? 'Remove Delay Status' : 'Mark as Delayed'}
                                    >
                                        Delay
                                    </button>
                                    <button 
                                        onClick={() => removeItem(phase, idx)}
                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Sprint Week Items Editor - grouped by week */}
                {visiblePhases.includes('sprint') && renderWeekGroupedEditor('sprint', sprintWeekFrom, sprintWeekTo)}
                {visiblePhases.includes('alacarte') && renderWeekGroupedEditor('alacarte', alacarteFocus, alacarteTo)}

            </div>
        </div>
    );
}
