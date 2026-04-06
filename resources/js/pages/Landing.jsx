import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

function Landing() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [formStep, setFormStep] = useState(1);
    const [businessGoals, setBusinessGoals] = useState([]);
    const [othersText, setOthersText] = useState('');
    const [businessStage, setBusinessStage] = useState('');
    const [budget, setBudget] = useState('');
    const [timeline, setTimeline] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [showClientWrap, setShowClientWrap] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [popup, setPopup] = useState({ show: false, success: true, message: '' });

    useEffect(() => {
        if (popup.show) {
            const timer = setTimeout(() => setPopup({ ...popup, show: false }), 4000);
            return () => clearTimeout(timer);
        }
    }, [popup.show]);

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

    const runImages = [...Array(6)];

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Loader />
            {/* Header - Logo and Contact Button */}
            <div className="fixed top-3 left-3 md:top-6 md:left-6 z-50">
                <a href="/">
                    <img
                        src="/img/tb.png"
                        alt="Tigapagi Logo"
                        className="h-9 md:h-12 object-contain"
                    />
                </a>
            </div>

            <div className="fixed top-3 right-3 md:top-6 md:right-6 z-50 flex items-center gap-2 md:gap-3 overflow-visible">
                {/* Contact Button */}
                <a
                    href="https://api.whatsapp.com/send/?phone=6289638893601&text&type=phone_number&app_absent=0"
                    className="
        h-9 md:h-12
        flex items-center justify-center gap-2
        bg-transparent
        border border-white/30
        px-3 md:px-4
        rounded-lg
        text-xs md:text-sm font-medium text-white
        hover:border-white/50
        transition-colors
        "
                    style={{ backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="/img/wa.png"
                        alt="WhatsApp"
                        className="w-4 h-4 md:w-5 md:h-5 rounded-full object-cover"
                    />
                    Contact
                </a>
            </div>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 md:px-12">
                {/* Background Layer 1 - BG.png (bottom layer, with blur and pan animation) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
                    <div
                        className="animate-pan-smooth h-full"
                        style={{
                            width: '300%',
                            backgroundImage: 'url(/img/BG.png)',
                            backgroundSize: '50% auto',
                            backgroundRepeat: 'repeat-x',
                            backgroundPosition: 'center',
                            opacity: 0.95,
                            filter: 'blur(100px)',
                        }}
                    />
                </div>

                {/* Background Layer 2 - BG2.png (top layer, static) */}
                <div
                    className="absolute inset-0 bg-cover bg-center pointer-events-none"
                    style={{
                        backgroundImage: 'url(/img/BG2.png)',
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

                <div className="relative z-10 w-full px-6 md:px-12 text-left">
                    <h1
                        className="text-7xl md:text-8xl lg:text-9xl leading-[1.1] text-white"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}
                    >
                        Brands trust us.<br />
                        Results prove it.<br />
                        Now it&rsquo;s your turn.
                    </h1>
                </div>
            </section>

            {/* Works Section */}
            <section className="relative py-20 bg-black overflow-hidden">
                <div className="relative z-10 max-w-6xl mx-auto px-6">
                    <p className="text-base md:text-lg text-white/70 leading-relaxed text-justify mb-16">
                        <strong className="text-white">Studio Tigapagi</strong> is a creative makerspace located in Sanur, Bali. Powered by &ldquo;Passionate nocturnal folks&rdquo; with high standarts and high commitment. Helping brands grow through branding, digital content strategy, social media campaigns, and visual production.
                    </p>

                    <h2 className="text-white mb-16 leading-tight w-full" style={{ fontSize: 'clamp(1rem, 2.8vw, 2.6rem)' }}>
                        Let&rsquo;s Unlock Your Brand's <strong className="font-bold italic">Potential</strong> with our Strategy
                    </h2>

                    {/* Service Pills Image */}
                    <img src="/img/todo.svg" alt="Our Services" className="w-full mx-auto mb-20" style={{ maxWidth: '1100px' }} />

                    {/* Selected Works */}
                    <div className="mt-4">
                        <h2 className="text-4xl md:text-5xl font-light text-white mb-12 leading-tight">
                            Selected <strong className="font-bold">Works</strong>
                        </h2>

                        <div className="space-y-0">
                            {[
                                { num: '01', name: 'Tanuki Sushi & Bar', tags: ['Branding', 'Social Media Management', 'Photo Production'] },
                                { num: '02', name: 'The Smoke House', tags: ['Social Media Management', 'Photo Production'] },
                                { num: '03', name: 'Blue Marlin Komodo', tags: ['Ads Management', 'Photo Production'] },
                                { num: '04', name: 'Yamaha Bali', tags: ['Content Creation'] },
                                { num: '05', name: 'Pertamina', tags: ['Social Media Management'] },
                            ].map((work) => (
                                <div
                                    key={work.num}
                                    className="border-t border-white/20 py-6 flex flex-col md:flex-row md:items-center gap-3 md:gap-8"
                                >
                                    <span className="text-white/60 text-base font-light shrink-0 md:w-20">{work.num}</span>
                                    <span className="text-white font-bold text-lg md:text-xl shrink-0 md:w-[520px]">{work.name}</span>
                                    <div className="flex flex-col gap-2 md:items-start">
                                        {work.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-4 py-1.5 rounded-full border border-white/40 text-white text-xs md:text-sm font-light whitespace-nowrap"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {/* Bottom border */}
                            <div className="border-t border-white/20" />
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mt-16 leading-tight">
                            And <strong className="font-bold">Many More</strong>
                        </h2>
                    </div>
                </div>
            </section>

            {/* Running Animation Section */}
            <section className="bg-black overflow-hidden">
                <div className="flex overflow-hidden">
                    <div className="flex w-max animate-scroll">
                        {runImages.map((_, index) => (
                            <img
                                key={`run-a-${index}`}
                                src="/img/run.png"
                                alt="Running"
                                className="h-[60vh] md:h-[70vh] lg:h-[60vh] w-auto object-cover shrink-0"
                            />
                        ))}
                        {runImages.map((_, index) => (
                            <img
                                key={`run-b-${index}`}
                                src="/img/run.png"
                                alt="Running"
                                className="h-[60vh] md:h-[70vh] lg:h-[60vh] w-auto object-cover shrink-0"
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Clients Section */}
            <section className="py-20 bg-black">
                <div className="max-w-6xl mx-auto px-6 text-left">
                    <h2 className="text-2xl md:text-4xl font-light text-white mb-12">
                        Our <strong className="font-semibold">Clients</strong>
                    </h2>

                    {/* Client Image Container */}
                    <div
                        className="relative overflow-hidden transition-all duration-700 ease-in-out"
                        style={{ maxHeight: showClientWrap ? '2000px' : '80px' }}
                    >
                        <img
                            src="/img/full client.webp"
                            alt="Our Clients"
                            className="w-full"
                        />
                        {/* Gradient fade at bottom when collapsed */}
                        {!showClientWrap && (
                            <div
                                className="absolute bottom-0 left-0 right-0 h-[40px] pointer-events-none"
                                style={{ background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)' }}
                            />
                        )}
                    </div>

                    <div className="mt-8 flex items-center gap-3">
                        <button
                            onClick={() => setShowClientWrap(!showClientWrap)}
                            className="flex items-center gap-2 bg-transparent text-white text-lg font-light cursor-pointer border-none outline-none hover:opacity-70 transition-opacity duration-300"
                        >
                            {showClientWrap ? 'Show less' : 'View all clients'}
                            <span
                                className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-white/60 transition-transform duration-500"
                                style={{ transform: showClientWrap ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            >
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 4.5L6 8.5L10 4.5" />
                                </svg>
                            </span>
                        </button>
                    </div>

                </div>
            </section>

            {/* Motion Video Section */}
            <section className="bg-black">
                <video
                    src="/img/MOTION TP.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full"
                    style={{ display: 'block', objectFit: 'cover' }}
                />
            </section>

            {/* Contact Section */}
            <section className="relative bg-black">
                {/* Background Image - full width like the video */}
                <img
                    src="/img/inquiries.webp"
                    alt=""
                    className="w-full block min-h-[600px] md:min-h-0"
                    style={{ objectFit: 'cover' }}
                />
                {/* Overlay with content */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.05) 100%)' }} />

                {/* Gradient top edge */}
                <div className="absolute top-0 left-0 right-0 h-[30px] pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)', zIndex: 5 }} />
                {/* Gradient bottom edge */}
                <div className="absolute bottom-0 left-0 right-0 h-[30px] pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)', zIndex: 5 }} />

                <div className="absolute inset-0 z-10 flex items-center">
                    <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div
                                className="rounded-2xl p-8 md:p-10 max-w-md"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.65)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                }}
                            >
                                {/* Step 1: Contact Info */}
                                {formStep === 1 && (
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                                            Let&rsquo;s Get Started
                                        </h3>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-zinc-900/70 border border-zinc-600 rounded-xl px-6 py-4 text-white placeholder-zinc-400 focus:outline-none focus:border-green-400 transition-colors"
                                            />
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-zinc-900/70 border border-zinc-600 rounded-xl px-6 py-4 text-white placeholder-zinc-400 focus:outline-none focus:border-green-400 transition-colors"
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Phone number"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-zinc-900/70 border border-zinc-600 rounded-xl px-6 py-4 text-white placeholder-zinc-400 focus:outline-none focus:border-green-400 transition-colors"
                                            />
                                        </div>
                                        <button
                                            onClick={handleNext}
                                            className="mt-6 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg px-8 py-3 transition-colors cursor-pointer"
                                        >
                                            Next
                                        </button>
                                        <p className="text-white/50 text-sm mt-6 leading-relaxed">
                                            Fill this up, and tell us about your brand :<br />
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
                                                {isSubmitting ? 'Sending...' : 'Next'}
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

                            {/* Right Text */}
                            <div className="hidden lg:flex items-center justify-end">
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-right leading-tight">
                                    Get your instant <br />
                                    quotation<br />
                                    here<br />
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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

            {/* Popup Animations */}
            <style>{`
                @keyframes popupFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes popupScaleIn {
                    from { opacity: 0; transform: scale(0.85) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes popupIconPop {
                    from { opacity: 0; transform: scale(0) rotate(-45deg); }
                    to { opacity: 1; transform: scale(1) rotate(0deg); }
                }
            `}</style>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default Landing;
