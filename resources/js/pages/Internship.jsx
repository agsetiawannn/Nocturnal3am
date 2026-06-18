import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Internship = () => {
    const [animate, setAnimate] = useState(false);
    const [visibleGroup, setVisibleGroup] = useState(0);
    const [step, setStep] = useState(11);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        email: '',
        whatsapp: '',
        instagram: '',
        domicile: '', // 'Bali' or 'Outside Bali'
        domicileDetail: '', // 'where?' input
        semester: '',
        role: '',
        wfo: '',
        cv: null,
        portfolio: null,
        reason: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const isValid = (s) => {
        switch (s) {
            case 2: return formData.name && formData.dob && formData.email;
            case 3: return formData.whatsapp && formData.instagram;
            case 4: return formData.domicile && (formData.domicile === 'Bali' ? true : formData.domicileDetail);
            case 5: return formData.semester;
            case 6: return formData.role;
            case 7: return formData.wfo;
            case 8: return formData.cv;
            case 9: return formData.portfolio;
            case 10: return formData.reason;
            default: return true;
        }
    };

    const handleSubmit = async () => {
        if (!isValid(10) || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();

            // Append all text fields explicitly
            formDataToSend.append('name', formData.name || '');
            formDataToSend.append('dob', formData.dob || '');
            formDataToSend.append('email', formData.email || '');
            formDataToSend.append('whatsapp', formData.whatsapp || '');
            formDataToSend.append('instagram', formData.instagram || '');
            formDataToSend.append('domicile', formData.domicile || '');
            formDataToSend.append('domicileDetail', formData.domicileDetail || '');
            formDataToSend.append('semester', formData.semester || '');
            formDataToSend.append('role', formData.role || '');
            formDataToSend.append('wfo', formData.wfo || '');
            formDataToSend.append('reason', formData.reason || '');

            // Append files explicitly
            if (formData.cv) formDataToSend.append('cv', formData.cv);
            if (formData.portfolio) formDataToSend.append('portfolio', formData.portfolio);

            const response = await fetch('/api/internship/apply', {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                changeStep(11);
            } else {
                const text = await response.text();
                console.error('Submission failed:', response.status, text);
                let msg = 'Submission failed (' + response.status + ')';
                try {
                    const json = JSON.parse(text);
                    if (json.message) msg = json.message;
                    if (json.errors) msg += ': ' + Object.values(json.errors).flat().join(', ');
                } catch(e) { msg += ': ' + text.substring(0, 100); }
                alert(msg);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e, field) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === "application/pdf") {
                setFormData({ ...formData, [field]: file });
            } else {
                alert("Please upload a PDF file.");
            }
        }
    };

    useEffect(() => {
        // Trigger initial animation shortly after mount
        const timer1 = setTimeout(() => {
            setAnimate(true);
        }, 500);

        // Trigger texts to appear after disc is fully shown
        const timer2 = setTimeout(() => {
            setVisibleGroup(7);
        }, 1500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    const getTextGroup = (s) => {
        if (s === 1) return 1;
        if (s === 2 || s === 3) return 2;
        if (s === 4) return 3;
        if (s === 5) return 4;
        if (s === 6 || s === 7) return 5;
        if (s >= 8 && s <= 10) return 6;
        if (s === 11) return 7;
        return 0;
    };

    const getDiscPosition = (s) => {
        if (s === 1) return 1;
        if (s === 2 || s === 3) return 2;
        if (s === 4 || s === 5) return 3;
        if (s === 6 || s === 7) return 4;
        if (s >= 8 && s <= 10) return 5;
        if (s === 11) return 6;
        return 0;
    };

    const changeStep = (newStep, isBack = false) => {
        const currentTextGroup = getTextGroup(step);
        const newTextGroup = getTextGroup(newStep);
        const currentDiscPos = getDiscPosition(step);
        const newDiscPos = getDiscPosition(newStep);

        if (currentTextGroup !== newTextGroup) {
            if (currentDiscPos !== newDiscPos) {
                // Disc is moving: wait for text to fade out completely, then move disc
                setVisibleGroup(0);
                setTimeout(() => {
                    setStep(newStep);
                    setTimeout(() => {
                        setVisibleGroup(newTextGroup);
                    }, 2000); // Wait for disc to arrive
                }, 1000); // Wait for text to fade out completely (no overlap)
            } else {
                // Disc is NOT moving, just changing text wrapper (e.g. step 4 to 5)
                setVisibleGroup(0);
                setTimeout(() => {
                    setStep(newStep);
                    setVisibleGroup(newTextGroup);
                }, 1000); // Wait for text to fade out, then fade in new text immediately
            }
        } else {
            // Internal transition inside the SAME wrapper (e.g. step 2 to 3)
            setStep(newStep);
        }
    };

    const handleNextStep = () => {
        changeStep(2);
    };

    const handleBackStep = () => {
        changeStep(1, true);
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center relative overflow-hidden"
            style={{ backgroundImage: "url('/img/formBG.png')" }}
        >
            {/* Logo at Top Right */}
            <div className={`absolute top-6 right-6 md:top-10 md:right-10 z-20 transition-opacity duration-1000 delay-[1000ms] ${animate ? 'opacity-100' : 'opacity-0'}`}>
                <Link to="/">
                    <img src="/img/tb.png" alt="Studio Tigapagi Logo" className="h-8 md:h-10 cursor-pointer hover:opacity-80 transition-opacity" />
                </Link>
            </div>

            {/* Main Content Area */}
            <div className="flex items-center justify-center w-full max-w-7xl px-6 relative z-10 flex-1">

                {/* Center/Left/Right Spinning Disc */}
                <div
                    onClick={() => { if (step === 1 && visibleGroup === 1) handleNextStep(); }}
                    className={`absolute z-10 flex items-center justify-center transition-all duration-[2000ms] ease-in-out ${visibleGroup === 1 ? 'cursor-pointer pointer-events-auto' : 'pointer-events-none'}
                        ${!animate ? 'scale-125 opacity-0 left-[50%] -translate-x-[50%] top-[50%] -translate-y-[40%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]'
                            : step === 1
                                ? 'scale-100 opacity-100 left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]'
                                : (step === 4 || step === 5)
                                    ? 'scale-100 opacity-100 left-0 md:left-[100%] -translate-x-[50%] md:-translate-x-[45%] lg:-translate-x-[40%] top-[-10%] md:top-[100%] -translate-y-[10%] md:-translate-y-[70%] w-[450px] h-[450px] md:w-[600px] md:h-[600px] sm:w-[800px] sm:h-[800px] lg:w-[1000px] lg:h-[1000px] xl:w-[1200px] xl:h-[1200px]'
                                    : (step >= 8 && step <= 10)
                                        ? 'scale-100 opacity-100 left-0 md:left-[50%] -translate-x-[50%] md:-translate-x-[50%] top-[-10%] md:top-0 -translate-y-[10%] md:-translate-y-[55%] w-[450px] h-[450px] md:w-[600px] md:h-[600px] sm:w-[800px] sm:h-[800px] lg:w-[1000px] lg:h-[1000px] xl:w-[1200px] xl:h-[1200px]'
                                        : step === 11
                                            ? 'scale-100 opacity-100 left-[100%] md:left-[20%] lg:left-[25%] -translate-x-[60%] md:-translate-x-[50%] top-[80%] md:top-[50%] -translate-y-[50%] w-[450px] h-[450px] md:w-[600px] md:h-[600px] sm:w-[800px] sm:h-[800px] lg:w-[1000px] lg:h-[1000px] xl:w-[1200px] xl:h-[1200px]'
                                            : (step === 6 || step === 7)
                                                ? 'scale-100 opacity-100 left-0 -translate-x-[50%] md:-translate-x-[55%] lg:-translate-x-[65%] top-[-10%] md:top-[50%] -translate-y-[10%] md:-translate-y-[50%] w-[450px] h-[450px] md:w-[600px] md:h-[600px] sm:w-[800px] sm:h-[800px] lg:w-[1000px] lg:h-[1000px] xl:w-[1200px] xl:h-[1200px]'
                                                : 'scale-100 opacity-100 left-0 -translate-x-[50%] md:-translate-x-[40%] md:-translate-x-[45%] top-[-10%] md:top-[50%] -translate-y-[10%] md:-translate-y-[50%] w-[450px] h-[450px] md:w-[600px] md:h-[600px] sm:w-[800px] sm:h-[800px] lg:w-[1000px] lg:h-[1000px] xl:w-[1200px] xl:h-[1200px]'
                        }`}
                >
                    <div className={`w-full h-full ${step === 1 ? 'animate-breathe' : ''}`}>
                        <img
                            src="/img/disc.png"
                            alt="Internship Disc"
                            className="w-full h-full object-contain animate-spin"
                            style={{ animationDuration: '10s', animationTimingFunction: 'linear' }}
                        />
                    </div>
                </div>

                {/* STEP 1: Texts */}
                <div
                    className={`absolute inset-0 w-full h-full max-w-7xl mx-auto px-6 flex items-center justify-center transition-opacity duration-1000 ${visibleGroup === 1 ? 'opacity-100 z-20 pointer-events-auto md:pointer-events-none cursor-pointer md:cursor-auto' : 'opacity-0 z-0 pointer-events-none'}`}
                    onClick={(e) => { if (window.innerWidth < 768) handleNextStep(); }}
                >

                    {/* Desktop Left Text */}
                    <div className="hidden md:block absolute top-[50%] -translate-y-[50%] right-[calc(50%+224px)] lg:right-[calc(50%+298px)] text-left w-max pointer-events-none md:pointer-events-auto">
                        <p className="text-white text-lg lg:text-xl font-light leading-snug tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Welcome to <span className="font-bold">Studio Tigapagi</span><br />
                            Internship Program Batch 8.0
                        </p>
                    </div>

                    {/* Desktop Right Text */}
                    <div className="hidden md:block absolute top-[50%] -translate-y-[50%] left-[calc(50%+224px)] lg:left-[calc(50%+298px)] text-right w-max pointer-events-none md:pointer-events-auto">
                        <p className="text-white/80 text-base font-mono tracking-widest lowercase">
                            [your journey will begin here]
                        </p>
                    </div>

                    {/* Mobile Left Text (Top Right-ish) */}
                    <div className="md:hidden absolute top-[25%] right-4 text-left w-auto pointer-events-none">
                        <p className="text-white text-[1rem] sm:text-[1.15rem] font-light leading-snug tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Welcome to <span className="font-bold">Studio Tigapagi</span><br />
                            Internship Program Batch 8.0
                        </p>
                    </div>

                    {/* Mobile Right Text (Bottom Center) */}
                    <div className="md:hidden absolute top-[72%] left-[50%] -translate-x-[50%] text-center w-full flex flex-col items-center pointer-events-none">
                        <p className="text-white/80 text-[0.95rem] font-mono tracking-widest lowercase">
                            [your journey will begin here]
                        </p>
                    </div>
                </div>

                {/* STEP 2 & 3: Form */}
                <div className={`absolute inset-0 w-full h-full max-w-7xl mx-auto px-6 flex items-end md:items-center justify-center md:justify-end pb-24 md:pb-0 transition-opacity duration-1000 ${visibleGroup === 2 ? 'opacity-100 z-20 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                    <div className="w-full max-w-xl md:mr-12 lg:mr-24 z-30 relative">
                        <h2 className="text-white text-xl md:text-3xl lg:text-[2.25rem] font-normal mb-6 md:mb-8 leading-tight tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Before we get started,<br />
                            we'd love to get to know you better.
                        </h2>

                        <div className="relative">
                            {/* Step 2 Fields */}
                            <div className={`transition-opacity duration-700 ${step === 2 ? 'opacity-100 z-10 relative' : 'opacity-0 z-0 absolute inset-0 pointer-events-none'}`}>
                                <div className="flex flex-col gap-4">
                                    <input
                                        type="text"
                                        placeholder="your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/10 md:bg-white/[0.07] rounded-xl px-5 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors font-sans"
                                    />
                                    <input
                                        type="text"
                                        placeholder="your place and date of birth"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        className="w-full bg-white/10 md:bg-white/[0.07] rounded-xl px-5 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors font-sans"
                                    />
                                    <input
                                        type="email"
                                        placeholder="your e-mail"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/10 md:bg-white/[0.07] rounded-xl px-5 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors font-sans"
                                    />
                                </div>

                                <div className="flex items-center justify-between mt-8 px-2">
                                    <button
                                        onClick={() => changeStep(1, true)}
                                        className="text-white/80 hover:text-white font-sans text-sm md:text-base transition-colors cursor-pointer"
                                    >
                                        &lt;&lt;back
                                    </button>

                                    <button
                                        onClick={() => changeStep(3)}
                                        className={`bg-white/10 md:bg-white/[0.07] hover:bg-white/20 text-white/90 rounded-full px-8 py-3 font-sans text-sm md:text-base transition-all duration-300 flex items-center justify-center cursor-pointer ${isValid(2) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                                    >
                                        &gt;&gt;next
                                    </button>
                                </div>
                            </div>

                            {/* Step 3 Fields */}
                            <div className={`transition-opacity duration-700 ${step === 3 ? 'opacity-100 z-10 relative' : 'opacity-0 z-0 absolute inset-0 pointer-events-none'}`}>
                                <div className="flex flex-col gap-4">
                                    <input
                                        type="tel"
                                        placeholder="your WhatsApp number"
                                        value={formData.whatsapp}
                                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                        className="w-full bg-white/10 md:bg-white/[0.07] rounded-xl px-5 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors font-sans"
                                    />
                                    <input
                                        type="text"
                                        placeholder="your Instagram account"
                                        value={formData.instagram}
                                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                        className="w-full bg-white/10 md:bg-white/[0.07] rounded-xl px-5 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors font-sans"
                                    />
                                </div>

                                <div className="flex items-center justify-between mt-8 px-2">
                                    <button
                                        onClick={() => changeStep(2, true)}
                                        className="text-white/80 hover:text-white font-sans text-sm md:text-base transition-colors cursor-pointer"
                                    >
                                        &lt;&lt;back
                                    </button>

                                    <button
                                        onClick={() => changeStep(4)}
                                        className={`bg-white/10 md:bg-white/[0.07] hover:bg-white/20 text-white/90 rounded-full px-8 py-3 font-sans text-sm md:text-base transition-all duration-300 flex items-center justify-center cursor-pointer ${isValid(3) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                                    >
                                        &gt;&gt;next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STEP 4: Domicile */}
                <div className={`absolute inset-0 w-full h-full max-w-[120rem] mx-auto px-4 md:px-10 lg:px-16 xl:px-24 flex items-end md:items-center justify-center md:justify-start pb-24 md:pb-0 transition-opacity duration-1000 ${visibleGroup === 3 ? 'opacity-100 z-20 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                    <div className="w-full max-w-[35rem] lg:max-w-[42rem] z-30 relative px-2 md:px-0">
                        <h2 className="text-white text-xl md:text-3xl lg:text-[2.25rem] font-normal mb-8 md:mb-12 leading-tight tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Alright. We need to make sure one more thing.<br />
                            Where do you live?
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {/* Bali Option */}
                            <div>
                                <button
                                    onClick={() => setFormData({ ...formData, domicile: 'Bali' })}
                                    className={`w-full py-12 md:py-16 rounded-2xl text-xl md:text-2xl font-light transition-all cursor-pointer ${formData.domicile === 'Bali' ? 'bg-white/10 border-2 border-[#A1F694] text-white' : 'bg-white/10 md:bg-white/[0.07] border-2 border-transparent text-white/90 hover:bg-white/20'}`}
                                >
                                    Bali
                                </button>
                            </div>

                            {/* Outside Bali Option & Nav */}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => setFormData({ ...formData, domicile: 'Outside Bali' })}
                                    className={`w-full py-12 md:py-16 rounded-2xl text-xl md:text-2xl font-light transition-all cursor-pointer ${formData.domicile === 'Outside Bali' ? 'bg-white/10 border-2 border-[#A1F694] text-white' : 'bg-white/10 md:bg-white/[0.07] border-2 border-transparent text-white/90 hover:bg-white/20'}`}
                                >
                                    Outside Bali
                                </button>

                                <div className={`transition-all duration-700 overflow-hidden ${formData.domicile === 'Outside Bali' ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <input
                                        type="text"
                                        placeholder="where?"
                                        value={formData.domicileDetail}
                                        onChange={(e) => setFormData({ ...formData, domicileDetail: e.target.value })}
                                        className="w-full bg-white/10 md:bg-white/[0.07] rounded-xl px-5 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors font-sans"
                                    />
                                </div>

                                <div className="flex items-center justify-between mt-4 px-2">
                                    <button
                                        onClick={() => changeStep(3, true)}
                                        className="text-white/80 hover:text-white font-sans text-sm md:text-base transition-colors cursor-pointer"
                                    >
                                        &lt;&lt;back
                                    </button>

                                    <button
                                        onClick={() => changeStep(5)}
                                        className={`bg-white/10 md:bg-white/[0.07] hover:bg-white/20 text-white/90 rounded-full px-8 py-3 font-sans text-sm md:text-base transition-all duration-300 flex items-center justify-center cursor-pointer ${isValid(4) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                                    >
                                        &gt;&gt;next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STEP 5: Semester */}
                <div className={`absolute inset-0 w-full h-full max-w-[120rem] mx-auto px-4 md:px-10 lg:px-16 xl:px-24 flex items-end md:items-center justify-center md:justify-start pb-24 md:pb-0 transition-opacity duration-1000 ${visibleGroup === 4 ? 'opacity-100 z-20 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                    <div className="w-full max-w-[35rem] lg:max-w-[42rem] z-30 relative px-2 md:px-0">
                        <h2 className="text-white text-xl md:text-3xl lg:text-[2.25rem] font-normal mb-2 leading-tight tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                            What semester are you in now?
                        </h2>
                        <p className="text-white/80 font-mono text-xl md:text-2xl mb-8 md:mb-12">
                            [in college]
                        </p>

                        <div className="grid grid-cols-2 gap-4 md:gap-6 ml-4 md:ml-12 lg:ml-20">
                            {['4', '7', '5', '8', '6', 'none of it'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setFormData({ ...formData, semester: opt })}
                                    className={`w-full py-6 md:py-8 rounded-xl text-lg md:text-xl font-sans transition-all cursor-pointer text-left pl-6 md:pl-8 ${formData.semester === opt ? 'bg-white/10 border-2 border-[#A1F694] text-white' : 'bg-white/10 md:bg-white/[0.07] border-2 border-transparent text-white/90 hover:bg-white/20'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center justify-between mt-8 ml-4 md:ml-12 lg:ml-20 px-2">
                            <button
                                onClick={() => changeStep(4, true)}
                                className="text-white/80 hover:text-white font-sans text-sm md:text-base transition-colors cursor-pointer"
                            >
                                &lt;&lt;back
                            </button>

                            <button
                                onClick={() => changeStep(6)}
                                className="bg-white/10 md:bg-white/[0.07] hover:bg-white/20 text-white/90 rounded-full px-8 py-3 font-sans text-sm md:text-base transition-colors flex items-center justify-center cursor-pointer"
                            >
                                &gt;&gt;next
                            </button>
                        </div>
                    </div>
                </div>

                {/* STEP 6 & 7: Role and WFO */}
                <div className={`absolute inset-0 w-full h-full px-6 flex items-end md:items-center justify-center md:justify-end pb-24 md:pb-0 transition-opacity duration-1000 ${visibleGroup === 5 ? 'opacity-100 z-20 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                    <div className="w-full max-w-2xl lg:max-w-[45rem] md:pr-12 lg:pr-24 z-30 relative md:ml-auto">

                        <div className="relative">
                            {/* Step 6: Role */}
                            <div className={`transition-opacity duration-700 ${step === 6 ? 'opacity-100 z-10 relative' : 'opacity-0 z-0 absolute inset-0 pointer-events-none'}`}>
                                <h2 className="text-white text-xl md:text-3xl lg:text-[2.25rem] font-normal mb-6 md:mb-10 leading-tight tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    Select your role
                                </h2>

                                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                    {/* Graphic Designer */}
                                    <button
                                        onClick={() => setFormData({ ...formData, role: 'Graphic Designer' })}
                                        className={`w-full py-6 md:py-10 px-4 md:px-8 rounded-3xl text-sm md:text-2xl font-mono transition-all cursor-pointer text-left ${formData.role === 'Graphic Designer' ? 'bg-white/10 border-2 border-[#A1F694] text-white' : 'bg-white/10 md:bg-white/[0.07] border-2 border-transparent text-white/90 hover:bg-white/20'}`}
                                    >
                                        Graphic<br />Designer
                                    </button>
                                    {/* Visual Production Crew */}
                                    <button
                                        onClick={() => setFormData({ ...formData, role: 'Visual Production Crew' })}
                                        className={`w-full py-6 md:py-10 px-4 md:px-8 rounded-3xl text-sm md:text-2xl font-mono transition-all cursor-pointer text-left ${formData.role === 'Visual Production Crew' ? 'bg-white/10 border-2 border-[#A1F694] text-white' : 'bg-white/10 md:bg-white/[0.07] border-2 border-transparent text-white/90 hover:bg-white/20'}`}
                                    >
                                        Visual<br />Production<br />Crew
                                    </button>
                                </div>
                                <div className="mt-4 sm:mt-6 flex justify-center">
                                    <div className="w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.75rem)]">
                                        {/* Social Media Strategist */}
                                        <button
                                            onClick={() => setFormData({ ...formData, role: 'Social Media Strategist' })}
                                            className={`w-full py-6 md:py-10 px-4 md:px-8 rounded-3xl text-sm md:text-2xl font-mono transition-all cursor-pointer text-left ${formData.role === 'Social Media Strategist' ? 'bg-white/10 border-2 border-[#A1F694] text-white' : 'bg-white/10 md:bg-white/[0.07] border-2 border-transparent text-white/90 hover:bg-white/20'}`}
                                        >
                                            Social<br />Media<br />Strategist
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-8 px-2">
                                    <button
                                        onClick={() => changeStep(5, true)}
                                        className="text-white/80 hover:text-white font-sans text-sm md:text-base transition-colors cursor-pointer"
                                    >
                                        &lt;&lt;back
                                    </button>

                                    <button
                                        onClick={() => changeStep(7)}
                                        className={`bg-white/10 md:bg-white/[0.07] hover:bg-white/20 text-white/90 rounded-full px-8 py-3 font-sans text-sm md:text-base transition-all duration-300 flex items-center justify-center cursor-pointer ${isValid(6) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                                    >
                                        &gt;&gt;next
                                    </button>
                                </div>
                            </div>

                            {/* Step 7: WFO */}
                            <div className={`transition-opacity duration-700 ${step === 7 ? 'opacity-100 z-10 relative' : 'opacity-0 z-0 absolute inset-0 pointer-events-none'}`}>
                                <h2 className="text-white text-xl md:text-3xl lg:text-[2.25rem] font-normal mb-6 md:mb-10 leading-tight tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    Are you willing to work from office?
                                </h2>

                                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                    <button
                                        onClick={() => setFormData({ ...formData, wfo: 'sure, absolutely' })}
                                        className={`w-full py-10 md:py-16 px-4 md:px-8 rounded-3xl text-base md:text-2xl font-light transition-all cursor-pointer ${formData.wfo === 'sure, absolutely' ? 'bg-white/10 border-2 border-[#A1F694] text-white' : 'bg-white/10 md:bg-white/[0.07] border-2 border-transparent text-white/90 hover:bg-white/20'}`}
                                    >
                                        sure, absolutely
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, wfo: "sorry, I can't" })}
                                        className={`w-full py-10 md:py-16 px-4 md:px-8 rounded-3xl text-base md:text-2xl font-light transition-all cursor-pointer ${formData.wfo === "sorry, I can't" ? 'bg-white/10 border-2 border-[#A1F694] text-white' : 'bg-white/10 md:bg-white/[0.07] border-2 border-transparent text-white/90 hover:bg-white/20'}`}
                                    >
                                        sorry, I can't
                                    </button>
                                </div>

                                <div className="flex items-center justify-between mt-8 px-2">
                                    <button
                                        onClick={() => changeStep(6, true)}
                                        className="text-white/80 hover:text-white font-sans text-sm md:text-base transition-colors cursor-pointer"
                                    >
                                        &lt;&lt;back
                                    </button>

                                    <button
                                        onClick={() => changeStep(8)}
                                        className={`bg-white/10 md:bg-white/[0.07] hover:bg-white/20 text-white/90 rounded-full px-8 py-3 font-sans text-sm md:text-base transition-all duration-300 flex items-center justify-center cursor-pointer ${isValid(7) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                                    >
                                        &gt;&gt;next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STEP 8, 9, 10: CV, Portfolio, Reason */}
                <div className={`absolute inset-0 w-full h-full max-w-5xl mx-auto px-6 flex items-end md:items-center justify-center pb-24 md:pb-0 transition-opacity duration-1000 ${visibleGroup === 6 ? 'opacity-100 z-20 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                    <div className="w-full md:mt-40 z-30 relative">
                        <div className="relative">

                            {/* Step 8: CV */}
                            <div className={`transition-all duration-700 w-full ${step === 8 ? 'opacity-100 z-10 relative translate-x-0' : 'opacity-0 z-0 absolute top-0 left-0 -translate-x-10 pointer-events-none'}`}>

                                <label
                                    className="block w-full"
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, 'cv')}
                                >
                                    <div className="w-full aspect-[4/3] md:aspect-auto md:h-80 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                                        <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-full flex items-center justify-center mb-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-12 md:w-12 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                            </svg>
                                        </div>
                                        <p className="text-white/80 font-mono text-sm md:text-base text-center px-4">
                                            {formData.cv ? (
                                                <span className="text-[#A1F694]">{formData.cv.name}</span>
                                            ) : (
                                                <>upload your <span className="font-bold text-white">Curriculum Vitae</span> here [PDF]</>
                                            )}
                                        </p>
                                    </div>
                                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => { if (e.target.files[0]) setFormData({ ...formData, cv: e.target.files[0] }) }} />
                                </label>

                                <div className="flex items-center justify-between mt-8 px-2">
                                    <button onClick={() => changeStep(7, true)} className="text-white/80 hover:text-white font-sans text-sm md:text-base transition-colors cursor-pointer">&lt;&lt;back</button>
                                    <button onClick={() => changeStep(9)} className={`bg-white/10 md:bg-white/[0.07] hover:bg-white/20 text-white/90 rounded-full px-8 py-3 font-sans text-sm md:text-base transition-all duration-300 flex items-center justify-center cursor-pointer ${isValid(8) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>&gt;&gt;next</button>
                                </div>
                            </div>

                            {/* Step 9: Portfolio */}
                            <div className={`transition-all duration-700 w-full ${step === 9 ? 'opacity-100 z-10 relative translate-x-0' : 'opacity-0 z-0 absolute top-0 left-0 translate-x-10 pointer-events-none'}`}>

                                <label
                                    className="block w-full"
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, 'portfolio')}
                                >
                                    <div className="w-full aspect-[4/3] md:aspect-auto md:h-80 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                                        <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-full flex items-center justify-center mb-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-12 md:w-12 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                            </svg>
                                        </div>
                                        <p className="text-white/80 font-mono text-sm md:text-base text-center px-4">
                                            {formData.portfolio ? (
                                                <span className="text-[#A1F694]">{formData.portfolio.name}</span>
                                            ) : (
                                                <>upload your <span className="font-bold text-white">portfolio</span> here [PDF]</>
                                            )}
                                        </p>
                                    </div>
                                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => { if (e.target.files[0]) setFormData({ ...formData, portfolio: e.target.files[0] }) }} />
                                </label>

                                <div className="flex items-center justify-between mt-8 px-2">
                                    <button onClick={() => changeStep(8, true)} className="text-white/80 hover:text-white font-sans text-sm md:text-base transition-colors cursor-pointer">&lt;&lt;back</button>
                                    <button onClick={() => changeStep(10)} className={`bg-white/10 md:bg-white/[0.07] hover:bg-white/20 text-white/90 rounded-full px-8 py-3 font-sans text-sm md:text-base transition-all duration-300 flex items-center justify-center cursor-pointer ${isValid(9) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>&gt;&gt;next</button>
                                </div>
                            </div>

                            {/* Step 10: Reason */}
                            <div className={`transition-all duration-700 w-full ${step === 10 ? 'opacity-100 z-10 relative translate-x-0' : 'opacity-0 z-0 absolute top-0 left-0 translate-x-10 pointer-events-none'}`}>
                                <textarea
                                    placeholder="give us the reasons why would you join our internship program...."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    className="w-full aspect-[4/3] md:aspect-auto md:h-80 bg-white/5 border border-transparent focus:border-white/20 rounded-3xl p-6 md:p-8 text-white text-base md:text-xl font-sans resize-none placeholder:text-white/40 focus:outline-none transition-colors"
                                />

                                <div className="flex items-center justify-between mt-8 px-2">
                                    <button onClick={() => changeStep(9, true)} className="text-white/80 hover:text-white font-sans text-sm md:text-base transition-colors cursor-pointer">&lt;&lt;back</button>
                                    <button onClick={handleSubmit} disabled={isSubmitting} className={`bg-white text-black hover:bg-white/80 rounded-full px-8 py-3 font-sans text-sm md:text-base transition-all duration-300 flex items-center justify-center cursor-pointer ${isValid(10) && !isSubmitting ? 'opacity-100 pointer-events-auto' : 'opacity-50 pointer-events-none'}`}>
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* STEP 11: End */}
                <div className={`absolute inset-0 w-full h-full max-w-7xl mx-auto px-10 md:px-6 pointer-events-none flex items-center justify-start md:justify-center transition-opacity duration-1000 ${visibleGroup === 7 ? 'opacity-100 z-20' : 'opacity-0 z-0'}`}>
                    <div className="w-full text-left md:text-left mt-[-100px] md:mt-0 md:absolute md:top-[50%] md:-translate-y-[50%] md:left-[calc(50%+224px)] lg:left-[calc(50%+298px)] z-30 pointer-events-none md:pointer-events-auto">
                        <p className="text-white text-3xl md:text-4xl font-normal leading-tight tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                            good luck,<br />
                            <span className="font-bold">#makeitworth.</span>
                        </p>
                    </div>
                </div>

            </div>

            {/* Bottom Footer Text */}
            <div className={`absolute bottom-6 md:bottom-8 right-6 md:left-[50%] md:-translate-x-[50%] md:right-auto z-20 transition-opacity duration-1000 ${visibleGroup === 1 ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-white/60 text-xs md:text-sm font-light tracking-wider font-sans text-right md:text-center w-max max-w-[90vw]">
                    a creative makerspace that consists of<br className="md:hidden" />
                    <span className="hidden md:inline"> </span>
                    passionate nocturnal folks.
                </p>
            </div>

            {/* Optional Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>
        </div>
    );
};

export default Internship;
