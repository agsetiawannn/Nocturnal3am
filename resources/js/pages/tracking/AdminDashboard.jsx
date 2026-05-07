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

    // Landing settings
    const [popupTitle, setPopupTitle] = useState('');
    const [popupSubtitle, setPopupSubtitle] = useState('');
    const [settingsLoading, setSettingsLoading] = useState(false);
    const [settingsMessage, setSettingsMessage] = useState('');

    // Active status editing
    const [editingStatus, setEditingStatus] = useState(null); // client id
    const [editStatusValue, setEditStatusValue] = useState('active');
    const [editActiveUntil, setEditActiveUntil] = useState('');
    const [statusSaving, setStatusSaving] = useState(false);

    // Expiry reminder
    const [reminderLoading, setReminderLoading] = useState(false);
    const [reminderResult, setReminderResult] = useState('');

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
        fetch('/api/tracking/admin/landing-settings')
            .then(res => res.json())
            .then(data => {
                if (data.settings) {
                    setPopupTitle(data.settings.popup_title);
                    setPopupSubtitle(data.settings.popup_subtitle);
                }
            });
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

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSettingsLoading(true);
        setSettingsMessage('');
        try {
            const res = await fetch('/api/tracking/admin/landing-settings', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({
                    popup_title: popupTitle,
                    popup_subtitle: popupSubtitle
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setSettingsMessage('Settings saved successfully!');
            } else {
                setSettingsMessage('Failed: ' + (data.message || 'Unknown error'));
            }
        } catch (err) {
            setSettingsMessage('Error saving settings.');
        } finally {
            setSettingsLoading(false);
            setTimeout(() => setSettingsMessage(''), 3000);
        }
    };

    const openStatusEdit = (client) => {
        setEditingStatus(client.id);
        setEditStatusValue(client.status || 'active');
        setEditActiveUntil(client.active_until || '');
    };

    const handleSaveStatus = async (clientId) => {
        setStatusSaving(true);
        try {
            const res = await fetch(`/api/tracking/admin/client/${clientId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({
                    status: editStatusValue,
                    active_until: editActiveUntil || null,
                })
            });
            const data = await res.json();
            if (data.success) {
                setEditingStatus(null);
                fetchClients();
            }
        } catch (err) {
            alert('Failed to update status.');
        } finally {
            setStatusSaving(false);
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

    const getStatusInfo = (client) => {
        const isActive = client.status === 'active';
        const activeUntil = client.active_until;
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (!isActive) {
            return { color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/30', label: 'Inactive', expired: true };
        }
        if (activeUntil) {
            const untilDate = new Date(activeUntil);
            untilDate.setHours(0, 0, 0, 0);
            const daysLeft = Math.ceil((untilDate - now) / (1000 * 60 * 60 * 24));
            if (daysLeft < 0) {
                return { color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/30', label: 'Expired', expired: true };
            }
            if (daysLeft <= 7) {
                return { color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/30', label: `${daysLeft}d left`, expired: false };
            }
            return { color: 'text-green-400', bg: 'bg-green-500/15', border: 'border-green-500/30', label: 'Active', expired: false };
        }
        return { color: 'text-green-400', bg: 'bg-green-500/15', border: 'border-green-500/30', label: 'Active', expired: false };
    };

    const handleSendReminders = async () => {
        if (!confirm('Send expiry reminder emails to all clients whose service is expiring soon?')) return;
        setReminderLoading(true);
        setReminderResult('');
        try {
            const res = await fetch('/api/tracking/admin/send-expiry-reminders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
            });
            const data = await res.json();
            if (data.success) {
                setReminderResult(data.output || 'Done!');
            } else {
                setReminderResult('Failed: ' + (data.message || 'Unknown error'));
            }
        } catch (err) {
            setReminderResult('Error sending reminders.');
        } finally {
            setReminderLoading(false);
            setTimeout(() => setReminderResult(''), 5000);
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
                    <div className="flex gap-3 items-center flex-wrap">
                        <button 
                            onClick={handleSendReminders}
                            disabled={reminderLoading}
                            className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg text-sm font-semibold transition-colors text-orange-400 flex items-center gap-2 disabled:opacity-50"
                            title="Send expiry reminder emails"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {reminderLoading ? 'Sending...' : 'Send Reminders'}
                        </button>
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

                {/* Reminder Result Toast */}
                {reminderResult && (
                    <div className="mb-6 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white/80 whitespace-pre-line">
                        {reminderResult}
                    </div>
                )}

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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ overflow: 'visible' }}>
                        {clients.map(client => {
                            const statusInfo = getStatusInfo(client);
                            const isEditing = editingStatus === client.id;

                            return (
                                <div key={client.id} className="p-5 bg-black/40 rounded-xl border border-white/10 hover:border-white/30 transition-colors" style={{ overflow: 'visible' }}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg">{client.name}</h3>
                                            <p className="text-sm text-gray-400">{client.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2 ml-3">
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

                                    {/* Status Badge & Controls */}
                                    {!isEditing ? (
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.expired ? 'bg-red-400' : 'bg-green-400'}`}></span>
                                                {statusInfo.label}
                                            </span>
                                            {client.active_until && (
                                                <span className="text-[11px] text-gray-500">
                                                    until {formatDate(client.active_until)}
                                                </span>
                                            )}
                                            <button
                                                onClick={() => openStatusEdit(client)}
                                                className="ml-auto text-[11px] text-white/40 hover:text-white/80 transition-colors underline underline-offset-2"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <label className="text-xs text-gray-400 w-16">Status</label>
                                                <select
                                                    value={editStatusValue}
                                                    onChange={(e) => setEditStatusValue(e.target.value)}
                                                    className="bg-black border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-white/40 transition-colors flex-1"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive (Cut Off)</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <label className="text-xs text-gray-400 w-16">Until</label>
                                                <input
                                                    type="date"
                                                    value={editActiveUntil}
                                                    onChange={(e) => setEditActiveUntil(e.target.value)}
                                                    className="bg-black border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-white/40 transition-colors flex-1"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSaveStatus(client.id)}
                                                    disabled={statusSaving}
                                                    className="px-4 py-1.5 bg-[#16d110] hover:bg-[#11b00c] text-black text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {statusSaving ? 'Saving...' : 'Save'}
                                                </button>
                                                <button
                                                    onClick={() => setEditingStatus(null)}
                                                    className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {clients.length === 0 && <p className="text-gray-500">No clients found.</p>}
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mt-8" style={{ backdropFilter: 'blur(20px)' }}>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">Landing Page Settings</h2>
                        <p className="text-gray-400 text-sm mt-1">Configure the welcome popup that appears after the loader.</p>
                    </div>

                    <form onSubmit={handleSaveSettings} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Popup Title</label>
                            <input 
                                type="text"
                                value={popupTitle}
                                onChange={(e) => setPopupTitle(e.target.value)}
                                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Popup Subtitle (Footer Text)</label>
                            <textarea 
                                value={popupSubtitle}
                                onChange={(e) => setPopupSubtitle(e.target.value)}
                                rows={3}
                                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors text-sm"
                                required
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                type="submit" 
                                disabled={settingsLoading}
                                className="px-6 py-2.5 bg-[#16d110] hover:bg-[#11b00c] text-black text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                            >
                                {settingsLoading ? 'Saving...' : 'Save Settings'}
                            </button>
                            {settingsMessage && (
                                <span className={settingsMessage.includes('Error') || settingsMessage.includes('Failed') ? 'text-red-400 text-sm' : 'text-green-400 text-sm'}>
                                    {settingsMessage}
                                </span>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
