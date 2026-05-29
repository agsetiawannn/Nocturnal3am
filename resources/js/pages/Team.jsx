import React, { useState, useEffect } from 'react';

function Team() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [formStep, setFormStep] = useState(1);
    const [businessGoals, setBusinessGoals] = useState([]);
    const [othersText, setOthersText] = useState('');
    const [businessStage, setBusinessStage] = useState('');
    const [budget, setBudget] = useState('');
    const [timeline, setTimeline] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [popup, setPopup] = useState({ show: false, success: true, message: '' });


    const stats = [
        { number: '345+', label: 'Project Finished' },
        { number: '100+', label: 'Clients' },
        { number: '4+', label: 'Years Experienced' },
    ];

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                business_goals: businessGoals,
                others_text: othersText,
                business_stage: businessStage,
                budget: budget,
                timeline: timeline,
                additional_details: additionalDetails,
            };
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                setFormStep(7);
            } else {
                const errorData = await response.json().catch(() => null);
                setPopup({ show: true, success: false, message: errorData?.message || 'Failed to send message. Please try again.' });
            }
        } catch (error) {
            console.error('Error:', error);
            setPopup({ show: true, success: false, message: 'Network error. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleGoal = (goal) => {
        setBusinessGoals(prev =>
            prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
        );
    };

    const handleNext = () => {
        let isValid = true;
        let errorMessage = 'Please fill in all required fields.';

        if (formStep === 1) {
            if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
                isValid = false;
            }
        } else if (formStep === 2) {
            if (businessGoals.length === 0) {
                isValid = false;
                errorMessage = 'Please select at least one business goal.';
            } else if (businessGoals.includes('Others') && !othersText.trim()) {
                isValid = false;
                errorMessage = 'Please provide details for Others.';
            }
        } else if (formStep === 3) {
            if (!businessStage) {
                isValid = false;
                errorMessage = 'Please select your current business stage.';
            }
        } else if (formStep === 4) {
            if (!budget) {
                isValid = false;
                errorMessage = 'Please select your budget range.';
            }
        } else if (formStep === 5) {
            if (!timeline) {
                isValid = false;
                errorMessage = 'Please select your estimated timeline.';
            }
        }

        if (!isValid) {
            setPopup({ show: true, success: false, message: errorMessage });
            return;
        }

        if (formStep === 1) {
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    additional_details: '[Lead Step 1 - Partial Submission]',
                }),
            }).catch(e => console.error('Error sending step 1:', e));
        }

        if (formStep === 6) {
            handleSubmit();
        } else {
            setFormStep(prev => prev + 1);
        }
    };

    const handleRestart = () => {

        setFormData({ name: '', email: '', phone: '' });
        setFormStep(1);
        setBusinessGoals([]);
        setOthersText('');
        setBusinessStage('');
        setBudget('');
        setTimeline('');
        setAdditionalDetails('');
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-black flex flex-col font-sans">
            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
                {/* Background Layer 1 - bg.webp?v=3 */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
                    <div
                        className="animate-pan-smooth h-full"
                        style={{
                            width: '300%',
                            backgroundImage: 'url(/img/bg.webp?v=3)',
                            backgroundSize: '50% auto',
                            backgroundRepeat: 'repeat-x',
                            backgroundPosition: 'center',
                            opacity: 0.95,
                        }}
                    />
                    {/* Safari-safe GPU blur overlay */}
                    <div className="absolute inset-0 pointer-events-none" style={{ backdropFilter: 'blur(100px)', WebkitBackdropFilter: 'blur(100px)' }} />
                </div>

                {/* Background Layer 2 - glass_mirror.webp?v=3 */}
                <div
                    className="absolute inset-0 bg-cover bg-center pointer-events-none"
                    style={{
                        backgroundImage: 'url(/img/glass_mirror.webp?v=3)',
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

                {/* Hero Content */}
                <div className="relative z-10 w-full px-6 text-center mt-20">
                    <h1 className="text-8xl md:text-10xl lg:text-12xl font-bold mb-6 tracking-tighter text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Meet The People Behind
                    </h1>
                    <p className="text-gray-300 text-base md:text-lg lg:text-xl font-light max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        <span className="italic">[Get to know the people shaping Studio Tigapagi]</span> bringing creativity, strategy, and late-night ideas to life through every piece of work we create.
                    </p>
                </div>
            </section>

            {/* Grid Section */}
            <section className="relative z-10 bg-black w-full pb-32 pt-10 px-6 md:px-10">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-x-12 md:gap-y-16 max-w-5xl mx-auto text-left">
                        {/* Row 1 */}
                        <div className="flex flex-col">
                            <img src="/img/ananda.png" alt="Ananda Sartana" className="w-full aspect-[3/4] object-cover mb-4" />
                            <h3 className="text-white text-xl font-bold font-sans tracking-tight">Ananda Sartana</h3>
                            <p className="text-white/70 text-sm font-light mt-1">CEO</p>
                        </div>
                        <div className="flex flex-col">
                            <img src="/img/felix.png" alt="Felix Marbun" className="w-full aspect-[3/4] object-cover mb-4" />
                            <h3 className="text-white text-xl font-bold font-sans tracking-tight">Felix Marbun</h3>
                            <p className="text-white/70 text-sm font-light mt-1">Operational Manager</p>
                        </div>
                        <div className="flex flex-col">
                            <img src="/img/aurel.png" alt="Aurelia Pramesty" className="w-full aspect-[3/4] object-cover mb-4" />
                            <h3 className="text-white text-xl font-bold font-sans tracking-tight">Aurelia Pramesty</h3>
                            <p className="text-white/70 text-sm font-light mt-1">Project Manager</p>
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-col">
                            <img src="/img/nayaka.png" alt="Nayaka Darmika" className="w-full aspect-[3/4] object-cover mb-4" />
                            <h3 className="text-white text-xl font-bold font-sans tracking-tight">Nayaka Darmika</h3>
                            <p className="text-white/70 text-sm font-light mt-1">Production Crew</p>
                        </div>
                        <div className="flex flex-col">
                            <img src="/img/nandiya.png" alt="Nandiya Zhou" className="w-full aspect-[3/4] object-cover mb-4" />
                            <h3 className="text-white text-xl font-bold font-sans tracking-tight">Nandiya Zhou</h3>
                            <p className="text-white/70 text-sm font-light mt-1">Social Media Specialist</p>
                        </div>
                        <div className="flex flex-col">
                            <img src="/img/mourent.png" alt="Mourent" className="w-full aspect-[3/4] object-cover mb-4" />
                            <h3 className="text-white text-xl font-bold font-sans tracking-tight">Mourent</h3>
                            <p className="text-white/70 text-sm font-light mt-1">Social Media Specialist</p>
                        </div>

                        {/* Row 3 - Centered on Desktop */}
                        <div className="md:col-start-1 md:col-end-4 flex flex-col sm:flex-row gap-8 md:gap-12 justify-center mt-4">
                            <div className="flex flex-col w-full sm:w-1/2 md:w-1/3">
                                <img src="/img/setiawan.png" alt="Setiawan" className="w-full aspect-[3/4] object-cover mb-4" />
                                <h3 className="text-white text-xl font-bold font-sans tracking-tight">Setiawan</h3>
                                <p className="text-white/70 text-sm font-light mt-1">Fullstack Developer</p>
                            </div>
                            <div className="flex flex-col w-full sm:w-1/2 md:w-1/3">
                                <img src="/img/dhais.png" alt="Dhais Alfa Rysy" className="w-full aspect-[3/4] object-cover mb-4" />
                                <h3 className="text-white text-xl font-bold font-sans tracking-tight">Dhais Alfa Rysy</h3>
                                <p className="text-white/70 text-sm font-light mt-1">Graphic Designer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="flex flex-col">
                {/* Contact Section - appears first on mobile */}
                <section id="contact-form-section" className="relative bg-black flex flex-col justify-center lg:min-h-[600px] lg:order-2">
                    <div className="absolute inset-0">
                        <img
                            src="/img/inquiries.webp?v=3"
                            alt=""
                            className="w-full h-full"
                            style={{ objectFit: 'cover' }}
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.05) 100%)' }} />
                        <div className="absolute top-0 left-0 right-0 h-[30px] pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)', zIndex: 5 }} />
                        <div className="absolute bottom-0 left-0 right-0 h-[30px] pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)', zIndex: 5 }} />
                    </div>

                    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 py-24 pb-32 md:py-20 lg:py-0">
                        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-16 items-center">


                            <div
                                className="rounded-[20px] p-6 md:p-10 w-full max-w-md lg:order-1"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.45)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                }}
                            >
                                {/* Step 1: Contact Info */}
                                {formStep === 1 && (
                                    <div>
                                        <h3 className="text-[32px] md:text-3xl font-bold text-white mb-8">
                                            Let&rsquo;s Get Started
                                        </h3>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-[#3d3d3d]/95 border-none rounded-[10px] px-5 py-4 text-white placeholder-white/80 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors text-[15px]"
                                            />
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-[#3d3d3d]/95 border-none rounded-[10px] px-5 py-4 text-white placeholder-white/80 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors text-[15px]"
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Whatsapp Number"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-[#3d3d3d]/95 border-none rounded-[10px] px-5 py-4 text-white placeholder-white/80 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors text-[15px]"
                                            />
                                        </div>
                                        <button
                                            onClick={handleNext}
                                            className="mt-8 bg-[#16d110] hover:bg-[#11b00c] text-black font-bold rounded-[8px] px-8 py-3 text-[14px] transition-colors cursor-pointer"
                                        >
                                            Submit
                                        </button>
                                        <p className="text-white text-[13px] mt-10 leading-[1.6]">
                                            Fill this up, and tell us about your brand .<br />
                                            We will approach you soon
                                        </p>
                                    </div>
                                )}

                                {/* Step 2: Business Goals */}
                                {formStep === 2 && (
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-light text-white mb-6 leading-snug">
                                            What is your main<br />business goal right now?
                                        </h3>
                                        <div className="space-y-3">
                                            {['Brand awareness', 'Increase sales', 'Improve social media presence', 'Launch a new product/service'].map((goal) => (
                                                <button
                                                    key={goal}
                                                    onClick={() => toggleGoal(goal)}
                                                    className={`w-full text-left px-5 py-4 rounded-xl text-white text-sm transition-all cursor-pointer ${businessGoals.includes(goal)
                                                        ? 'bg-white/30 border border-white/50'
                                                        : 'bg-white/15 border border-transparent hover:bg-white/20'
                                                        }`}
                                                >
                                                    {goal}
                                                </button>
                                            ))}
                                            <div
                                                className={`flex items-center px-5 py-4 rounded-xl text-white text-sm transition-all ${businessGoals.includes('Others')
                                                    ? 'bg-white/30 border border-white/50'
                                                    : 'bg-white/15 border border-transparent'
                                                    }`}
                                            >
                                                <button
                                                    onClick={() => toggleGoal('Others')}
                                                    className="cursor-pointer bg-transparent text-white"
                                                >
                                                    Others:
                                                </button>
                                                <input
                                                    type="text"
                                                    value={othersText}
                                                    onChange={(e) => { setOthersText(e.target.value); if (!businessGoals.includes('Others')) toggleGoal('Others'); }}
                                                    className="ml-2 bg-transparent border-b border-white/40 text-white outline-none flex-1 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-6 flex items-center gap-4">
                                            <button
                                                onClick={() => setFormStep(1)}
                                                className="w-10 h-10 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-all cursor-pointer"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2L4 7L9 12" /></svg>
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                className="bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg px-8 py-3 transition-colors cursor-pointer"
                                            >
                                                Next
                                            </button>
                                            <span className="ml-auto text-white/50 text-xs text-right">You may select<br />more than one</span>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Business Stage */}
                                {formStep === 3 && (
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-light text-white mb-6 leading-snug">
                                            What is your current<br />business stage?
                                        </h3>
                                        <div className="space-y-3">
                                            {['Just starting (0–6 months)', 'Running, but looking to scale', 'Established, looking to optimize & grow'].map((stage) => (
                                                <button
                                                    key={stage}
                                                    onClick={() => setBusinessStage(stage)}
                                                    className={`w-full text-left px-5 py-4 rounded-xl text-white text-sm transition-all cursor-pointer ${businessStage === stage
                                                        ? 'bg-white/30 border border-white/50'
                                                        : 'bg-white/15 border border-transparent hover:bg-white/20'
                                                        }`}
                                                >
                                                    {stage}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-6 flex items-center gap-4">
                                            <button
                                                onClick={() => setFormStep(2)}
                                                className="w-10 h-10 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-all cursor-pointer"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2L4 7L9 12" /></svg>
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                className="bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg px-8 py-3 transition-colors cursor-pointer"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Budget */}
                                {formStep === 4 && (
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-light text-white mb-6 leading-snug">
                                            What is your estimated<br />budget range?
                                        </h3>
                                        <div className="space-y-3">
                                            {['Below $300', '$300 – $700', '$700 – $1,500', '$1,500+'].map((range) => (
                                                <button
                                                    key={range}
                                                    onClick={() => setBudget(range)}
                                                    className={`w-full text-left px-5 py-4 rounded-xl text-white text-sm transition-all cursor-pointer ${budget === range
                                                        ? 'bg-white/30 border border-white/50'
                                                        : 'bg-white/15 border border-transparent hover:bg-white/20'
                                                        }`}
                                                >
                                                    {range}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-6 flex items-center gap-4">
                                            <button
                                                onClick={() => setFormStep(3)}
                                                className="w-10 h-10 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-all cursor-pointer"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2L4 7L9 12" /></svg>
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                className="bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg px-8 py-3 transition-colors cursor-pointer"
                                            >
                                                Next
                                            </button>
                                            <span className="ml-auto text-white/50 text-xs text-right">This helps us recommend<br />the best scope for you</span>
                                        </div>
                                    </div>
                                )}

                                {/* Step 5: Timeline */}
                                {formStep === 5 && (
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-light text-white mb-6 leading-snug">
                                            What is your expected<br />timeline?
                                        </h3>
                                        <div className="space-y-3">
                                            {['ASAP', 'Within 1 month', '2–3 months', 'Flexible'].map((t) => (
                                                <button
                                                    key={t}
                                                    onClick={() => setTimeline(t)}
                                                    className={`w-full text-left px-5 py-4 rounded-xl text-white text-sm transition-all cursor-pointer ${timeline === t
                                                        ? 'bg-white/30 border border-white/50'
                                                        : 'bg-white/15 border border-transparent hover:bg-white/20'
                                                        }`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-6 flex items-center gap-4">
                                            <button
                                                onClick={() => setFormStep(4)}
                                                className="w-10 h-10 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-all cursor-pointer"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2L4 7L9 12" /></svg>
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                className="bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg px-8 py-3 transition-colors cursor-pointer"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 6: Additional Details */}
                                {formStep === 6 && (
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-light text-white mb-6 leading-snug">
                                            Additional Details or Request :
                                        </h3>
                                        <textarea
                                            placeholder="Type here ....."
                                            value={additionalDetails}
                                            onChange={(e) => setAdditionalDetails(e.target.value)}
                                            rows={8}
                                            className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors resize-none"
                                            style={{
                                                backdropFilter: 'blur(6px)',
                                                WebkitBackdropFilter: 'blur(6px)',
                                                fontSize: '15px',
                                                lineHeight: '1.6',
                                            }}
                                        />
                                        <div className="mt-6 flex items-center gap-4">
                                            <button
                                                onClick={() => setFormStep(5)}
                                                className="w-10 h-10 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-all cursor-pointer"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2L4 7L9 12" /></svg>
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                disabled={isSubmitting}
                                                className="bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg px-8 py-3 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? 'Sending...' : 'Get Quote Now'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 7: Thank You */}
                                {formStep === 7 && (
                                    <div className="py-6">
                                        <h3 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
                                            Thank<br />You
                                        </h3>
                                        <p className="text-white/60 text-lg font-light italic">
                                            We'll approach you soon
                                        </p>
                                        <button
                                            onClick={handleRestart}
                                            className="mt-8 border border-white/30 hover:bg-white/10 text-white font-light rounded-lg px-6 py-3 transition-all cursor-pointer text-sm"
                                        >
                                            Submit another response
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Right Text / Desktop */}
                            <div className="hidden lg:flex items-center justify-end lg:order-2">
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-right leading-tight">
                                    Get your instant <br />
                                    quotation<br />
                                    here<br />
                                </h2>
                            </div>
                        </div>
                    </div>
                </section>


            </div>

            {/* Success/Error Popup */}

            {/* Success/Error Popup */}
            {popup.show && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(8px)',
                        animation: 'popupFadeIn 0.3s ease',
                    }}
                    onClick={() => setPopup({ ...popup, show: false })}
                >
                    <div
                        style={{
                            background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95), rgba(30, 30, 30, 0.9))',
                            border: popup.success ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '20px',
                            padding: '40px 48px',
                            maxWidth: '420px',
                            width: '90%',
                            textAlign: 'center',
                            boxShadow: popup.success
                                ? '0 0 60px rgba(34, 197, 94, 0.15), 0 25px 50px rgba(0, 0, 0, 0.5)'
                                : '0 0 60px rgba(239, 68, 68, 0.15), 0 25px 50px rgba(0, 0, 0, 0.5)',
                            animation: 'popupScaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div
                            style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: popup.success
                                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))'
                                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))',
                                border: popup.success ? '2px solid rgba(34, 197, 94, 0.4)' : '2px solid rgba(239, 68, 68, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                animation: 'popupIconPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both',
                            }}
                        >
                            {popup.success ? (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            )}
                        </div>

                        {/* Title */}
                        <h3 style={{
                            color: '#ffffff',
                            fontSize: '20px',
                            fontWeight: '600',
                            marginBottom: '8px',
                            letterSpacing: '-0.02em',
                        }}>
                            {popup.success ? 'Thank You!' : 'Oops!'}
                        </h3>

                        {/* Message */}
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '15px',
                            lineHeight: '1.5',
                            marginBottom: '28px',
                        }}>
                            {popup.message}
                        </p>

                        {/* Button */}
                        <button
                            onClick={() => setPopup({ ...popup, show: false })}
                            style={{
                                background: popup.success
                                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                                    : 'linear-gradient(135deg, #ef4444, #dc2626)',
                                color: popup.success ? '#000' : '#fff',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '12px 32px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                letterSpacing: '0.02em',
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                                e.target.style.boxShadow = popup.success
                                    ? '0 8px 25px rgba(34, 197, 94, 0.4)'
                                    : '0 8px 25px rgba(239, 68, 68, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Team;
