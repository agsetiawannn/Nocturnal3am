import React, { useState, useEffect, useRef } from 'react';

// Predefined safe slots guarantee popups won't overlap each other or the text
const DESKTOP_SLOTS = [
    { x: 30, y: 15 }, // Top area
    { x: 80, y: 25 }, // Top Right
    { x: 85, y: 60 }, // Mid Right
    { x: 75, y: 85 }, // Bottom Right
    { x: 35, y: 85 }, // Bottom Center
];

const MOBILE_SLOTS = [
    { x: 35, y: 12 }, // Top Left (Safe from edge)
    { x: 70, y: 26 }, // Top Right
    { x: 75, y: 68 }, // Mid Bottom Right
    { x: 55, y: 85 }, // Bottom Center Right
];

const FloatingPopups = () => {
    const [popups, setPopups] = useState([]);
    const activeSlots = useRef(new Set()); // Track occupied slots

    useEffect(() => {
        const interval = setInterval(() => {
            const isMobile = window.innerWidth < 768;
            const slots = isMobile ? MOBILE_SLOTS : DESKTOP_SLOTS;

            // Find all slots that are currently NOT occupied
            const availableSlots = slots.map((_, index) => index).filter(i => !activeSlots.current.has(i));

            // Skip spawning if all slots are full
            if (availableSlots.length === 0) return;

            // Randomly select one available slot
            const slotIndex = availableSlots[Math.floor(Math.random() * availableSlots.length)];
            const slot = slots[slotIndex];

            // Lock slot
            activeSlots.current.add(slotIndex);

            const newId = Date.now();
            const clientId = Math.floor(Math.random() * 10) + 1; // 1 to 10

            const newPopup = {
                id: newId,
                img: `/public/img/client_all/client_${clientId}.webp`,
                x: slot.x,
                y: slot.y,
                slotIndex,
                phase: 'entering' // entering -> active -> leaving
            };

            setPopups(current => [...current, newPopup]);

            // Enter transition
            setTimeout(() => {
                setPopups(current => current.map(p =>
                    p.id === newId ? { ...p, phase: 'active' } : p
                ));
            }, 100);

            // Leave transition
            setTimeout(() => {
                setPopups(current => current.map(p =>
                    p.id === newId ? { ...p, phase: 'leaving' } : p
                ));
            }, 3000); // stay visible for 3s

            // Remove from array and release the slot for next popups
            setTimeout(() => {
                setPopups(current => current.filter(p => p.id !== newId));
                activeSlots.current.delete(slotIndex);
            }, 4000);

        }, 1500); // Trigger attempt every 1.5s

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
            {popups.map(popup => (
                <div
                    key={popup.id}
                    className={`absolute transition-all duration-1000 ease-in-out transform -translate-x-1/2 -translate-y-1/2
                        ${popup.phase === 'entering' ? 'opacity-0 scale-50 translate-y-4' : ''}
                        ${popup.phase === 'active' ? 'opacity-100 scale-100 translate-y-0' : ''}
                        ${popup.phase === 'leaving' ? 'opacity-0 scale-50 -translate-y-4' : ''}
                    `}
                    style={{
                        left: `${popup.x}%`,
                        top: `${popup.y}%`,
                        willChange: 'transform, opacity'
                    }}
                >
                    <img
                        src={popup.img}
                        alt="Client Popup"
                        className="w-[140px] md:w-[260px] h-auto object-contain drop-shadow-2xl max-w-full inline-block"
                    />
                </div>
            ))}
        </div>
    );
};

export default FloatingPopups;
