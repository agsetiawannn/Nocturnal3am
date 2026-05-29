import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import FloatingPopups from '../components/FloatingPopups';

function MobileWorkCard({ work }) {
    const [slideIdx, setSlideIdx] = useState(0);
    return (
        <div className="snap-center shrink-0 w-[85vw] md:w-[400px] h-auto relative overflow-hidden group">
            <div className="relative w-full aspect-[3/4] overflow-hidden">
                <img
                    src={work.imgs[slideIdx]}
                    alt={work.name}
                    className="w-full h-full object-cover transition-opacity duration-500"
                />
                {work.imgs.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); setSlideIdx(prev => (prev - 1 + work.imgs.length) % work.imgs.length); }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white z-10 border-none cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setSlideIdx(prev => (prev + 1) % work.imgs.length); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white z-10 border-none cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {work.imgs.map((_, i) => (
                                <button key={i} onClick={(e) => { e.stopPropagation(); setSlideIdx(i); }} className={`w-1.5 h-1.5 rounded-full border-none cursor-pointer transition-all ${i === slideIdx ? 'bg-white w-4' : 'bg-white/40'}`} />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-white/80 text-sm font-light">{work.num}</span>
                    <span className="text-white font-bold text-lg leading-tight">{work.name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {work.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full border border-white/50 text-white text-[10px] font-light whitespace-nowrap">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

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
    const [hoveredWork, setHoveredWork] = useState(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [showScrollTop, setShowScrollTop] = useState(false);


    // Popup settings
    const [showContactPopup, setShowContactPopup] = useState(false);
    const [popupClosing, setPopupClosing] = useState(false);
    const [landingSettings, setLandingSettings] = useState({
        popup_title: "Let's Get Started",
        popup_subtitle: "Fill this up, and tell us about your brand .\nWe will approach you soon"
    });

    const closePopup = () => {
        setPopupClosing(true);
        setTimeout(() => {
            setShowContactPopup(false);
            setPopupClosing(false);
            setShowCloseConfirm(false);
        }, 400);
    };

    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    const handleCloseAttempt = () => {
        setShowCloseConfirm(true);
    };

    useEffect(() => {
        // Meta Pixel Code
        !function (f, b, e, v, n, t, s) {
            if (f.fbq) return; n = f.fbq = function () {
                n.callMethod ?
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
        }(window, document, 'script',
            'https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', '1439408024111143');
        window.fbq('track', 'PageView');

        // Fetch Settings
        fetch('/api/tracking/public/landing-settings')
            .then(res => res.json())
            .then(data => {
                if (data.settings) {
                    setLandingSettings(data.settings);
                }
            })
            .catch(err => console.error(err));

        // Show popup after loader
        const timer = setTimeout(() => {
            setShowContactPopup(true);
        }, 5800);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (popup.show) {
            const timer = setTimeout(() => setPopup({ ...popup, show: false }), 4000);
            return () => clearTimeout(timer);
        }
    }, [popup.show]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                if (window.fbq) window.fbq('track', 'Lead');
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
        // Step 6 (Additional details) is optional by default

        if (!isValid) {
            setPopup({ show: true, success: false, message: errorMessage });
            return;
        }

        if (formStep === 1) {
            // Send partial data in the background
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

    const scrollToForm = (e) => {
        e.preventDefault();
        const formEl = document.getElementById('contact-form-section');
        if (formEl) {
            const isDesktop = window.matchMedia('(min-width: 768px)').matches;
            formEl.scrollIntoView({
                behavior: 'smooth',
                block: isDesktop ? 'center' : 'start'
            });
        }
    };

    const runImages = [...Array(1)];

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <noscript>
                <img height="1" width="1" style={{ display: 'none' }} src="https://www.facebook.com/tr?id=1439408024111143&ev=PageView&noscript=1" alt="" />
            </noscript>
            {/* Desktop Floating Image Preview on Hover */}
            <div
                className={`hidden md:block fixed pointer-events-none z-[100] transition-all duration-300 ease-out ${hoveredWork ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                style={{
                    left: cursorPos.x + 'px',
                    top: cursorPos.y + 'px',
                    width: '320px',
                    height: '420px',
                    transform: 'translate(20px, -50%)',
                }}
            >
                {hoveredWork && (
                    <img src={hoveredWork} alt="Preview" className="w-full h-full object-cover rounded-xl shadow-2xl border border-white/10" />
                )}
            </div>

            <Loader />

            {/* Contact Popup */}
            {showContactPopup && (
                <div
                    className={`fixed inset-0 z-[150] flex items-center justify-center p-4 ${popupClosing ? 'popup-overlay-out' : 'popup-overlay-in'}`}
                    onClick={(e) => { if (e.target === e.currentTarget) handleCloseAttempt(); }}
                >
                    <div className={`bg-[#111] border border-white/5 rounded-[20px] p-8 md:p-10 w-full max-w-md relative shadow-2xl ${popupClosing ? 'popup-card-out' : 'popup-card-in'}`}>
                        <button
                            onClick={handleCloseAttempt}
                            className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors cursor-pointer"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Close Confirmation Overlay */}
                        {showCloseConfirm && (
                            <div className="absolute inset-0 z-20 bg-black/80 rounded-[20px] flex flex-col items-center justify-center gap-6 p-8">
                                <p className="text-white text-lg font-semibold text-center leading-relaxed">Are you sure want to leave this offers?</p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={closePopup}
                                        className="px-6 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-colors cursor-pointer"
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() => setShowCloseConfirm(false)}
                                        className="px-6 py-2.5 bg-[#16d110] text-black rounded-xl font-bold hover:bg-[#11b00c] transition-colors cursor-pointer border-none"
                                    >
                                        No, stay
                                    </button>
                                </div>
                            </div>
                        )}

                        <h3 className="text-[32px] md:text-3xl font-bold text-white mb-8 leading-tight tracking-tight">
                            {landingSettings.popup_title}
                        </h3>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-[#3d3d3d] border-none rounded-[10px] px-5 py-4 text-white placeholder-white/80 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors text-[15px]"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-[#3d3d3d] border-none rounded-[10px] px-5 py-4 text-white placeholder-white/80 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors text-[15px]"
                            />
                            <input
                                type="tel"
                                placeholder="Phone number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-[#3d3d3d] border-none rounded-[10px] px-5 py-4 text-white placeholder-white/80 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors text-[15px]"
                            />
                        </div>

                        <div className="mt-8 flex flex-col gap-8">
                            <button
                                onClick={() => {
                                    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
                                        setPopup({ show: true, success: false, message: 'Please fill in all required fields.' });
                                        return;
                                    }

                                    // Submit partial data
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
                                            additional_details: '[Lead - Popup Submission]',
                                        }),
                                    }).catch(e => console.error('Error sending popup data:', e));

                                    closePopup();
                                }}
                                className="bg-[#16d110] hover:bg-[#11b00c] text-black font-bold py-3 px-8 rounded-xl transition-colors cursor-pointer self-start border-none"
                            >
                                Submit
                            </button>

                            <p className="text-white/90 text-[15px] font-light leading-relaxed whitespace-pre-wrap">
                                {landingSettings.popup_subtitle}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes popupOverlayIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes popupOverlayOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                @keyframes popupCardIn {
                    from { opacity: 0; transform: scale(0.92) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes popupCardOut {
                    from { opacity: 1; transform: scale(1) translateY(0); }
                    to { opacity: 0; transform: scale(0.92) translateY(20px); }
                }
                .popup-overlay-in {
                    animation: popupOverlayIn 0.4s ease-out forwards;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                }
                .popup-overlay-out {
                    animation: popupOverlayOut 0.4s ease-in forwards;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                }
                .popup-card-in {
                    animation: popupCardIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .popup-card-out {
                    animation: popupCardOut 0.35s ease-in forwards;
                }
            `}</style>

            {/* Header - Logo and Contact Button */}
            <div className="fixed top-3 left-3 md:top-6 md:left-[5.5rem] z-50">
                <a href="/">
                    <img
                        src="/img/tb.png"
                        alt="Tigapagi Logo"
                        className="h-9 md:h-12 object-contain"
                    />
                </a>
            </div>

            <div className="fixed top-3 right-3 md:top-6 md:right-[5.5rem] z-50 flex items-center gap-2 md:gap-3 overflow-visible">
                {/* Get Quote Button */}
                <button
                    onClick={(e) => {
                        scrollToForm(e);
                        if (window.fbq) window.fbq('track', 'GetQuoteBtn');
                    }}
                    className="
                        hidden md:flex h-9 md:h-12
                        items-center justify-center
                        bg-[#16d110] hover:bg-[#11b00c] text-black
                        px-4 md:px-5
                        rounded-lg
                        text-xs md:text-sm font-bold
                        transition-colors cursor-pointer border-none
                    "
                    style={{ backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }}
                >
                    Get Quote
                </button>
                {/* Contact Button */}
                <a
                    href="https://api.whatsapp.com/send/?phone=6289638893601&text&type=phone_number&app_absent=0"
                    onClick={() => { if (window.fbq) window.fbq('track', 'Contact'); }}
                    className="
        hidden md:flex h-9 md:h-12
        items-center justify-center gap-2
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
                {/* Background Layer 1 - bg.webp?v=3 (bottom layer, with blur and pan animation) */}
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

                {/* Background Layer 2 - glass_mirror.webp?v=3 (top layer, static) */}
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

                {/* Floating Popups */}
                <FloatingPopups />

                <div className="relative z-10 w-full px-2 md:px-10 text-left mt-10 md:mt-0">
                    <h1
                        className="text-[5.5vw] md:text-[60px] lg:text-[80px] text-white leading-[1.2] md:leading-[1.1]"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}
                    >
                        Hundreds of businesses<br />
                        transformed through our vision.
                    </h1>
                </div>

                {/* Mobile Contact & Quote Buttons in Hero */}
                <div className="absolute bottom-12 left-6 z-20 md:hidden flex gap-3">
                    <button
                        onClick={(e) => {
                            scrollToForm(e);
                            if (window.fbq) window.fbq('track', 'GetQuoteBtn');
                        }}
                        className="
                            h-10 flex items-center justify-center
                            bg-[#16d110] hover:bg-[#11b00c] text-black
                            px-5 rounded-xl text-xs font-bold transition-colors border-none cursor-pointer
                        "
                        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                    >
                        Get Quote
                    </button>
                    <a
                        href="https://api.whatsapp.com/send/?phone=6289638893601&text&type=phone_number&app_absent=0"
                        onClick={() => { if (window.fbq) window.fbq('track', 'Contact'); }}
                        className="
                            h-10 flex items-center justify-center gap-2
                            bg-transparent border border-white/30 hover:border-white/50
                            px-5 rounded-xl text-xs font-light text-white transition-colors
                        "
                        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src="/img/wa.png"
                            alt="WhatsApp"
                            className="w-4 h-4 rounded-full object-cover"
                        />
                        Contact
                    </a>
                </div>
            </section>

            {/* Works Section */}
            <section className="relative py-16 md:py-20 bg-black overflow-hidden">
                <div className="relative z-10 max-w-6xl mx-auto px-6">
                    <p className="text-[15px] md:text-lg text-white/90 md:text-white/70 leading-[1.7] md:leading-relaxed text-justify mb-14 md:mb-16 font-light md:font-normal tracking-wide md:tracking-normal">
                        <strong className="text-white font-bold md:font-normal">Studio Tigapagi</strong> is a creative makerspace located in Sanur, Bali. Powered by &ldquo;Passionate nocturnal folks&rdquo; with high standarts and high commitment. Helping brands grow through branding, digital content strategy, social media campaigns, and visual production.
                    </p>

                    {/* Desktop Version */}
                    <h2 className="text-white mb-16 leading-tight w-full hidden md:block" style={{ fontSize: 'clamp(1rem, 2.8vw, 2.6rem)' }}>
                        Let&rsquo;s Unlock Your Brand's <strong className="font-bold italic">Potential</strong> with our Strategy
                    </h2>
                    {/* Mobile Version */}
                    <h2 className="text-white text-[26px] mb-14 leading-[1.3] w-full font-normal block md:hidden">
                        Let&rsquo;s Unlock Your Brand's <strong className="font-bold">Potential</strong><br />
                        with our Strategy
                    </h2>

                    {/* Service Pills Image */}
                    <picture>
                        <source media="(max-width: 767px)" srcSet="/img/brand%20potential.webp?v=3" />
                        <img src="/img/todo.svg" alt="Our Services" className="w-full h-auto object-contain mx-auto mb-20" style={{ maxWidth: '1100px' }} />
                    </picture>

                    {/* Selected Works */}
                    <div className="mt-4">
                        <h2 className="text-4xl md:text-5xl font-light text-white mb-12 leading-tight">
                            Selected <strong className="font-bold">Works</strong>
                        </h2>

                        {/* Desktop List Layout */}
                        <div className="space-y-0 hidden md:block" onMouseLeave={() => { setHoveredWork(null); if (window._workInterval) { clearInterval(window._workInterval); window._workInterval = null; } }}>
                            {[
                                { num: '01', name: 'Tanuki Sushi & Bar', tags: ['Branding', 'Social Media Management', 'Photo Production'], imgs: ['/img/Tanuki1_2x.webp', '/img/Tanuki2_2x.webp', '/img/Tanuki3_2x.webp', '/img/Tanuki4_2x.webp', '/img/Tanuki5_2x.webp'] },
                                { num: '02', name: 'The Smoke House', tags: ['Social Media Management', 'Photo Production'], imgs: ['/img/TSH1_2x.webp', '/img/TSH2_2x.webp', '/img/TSH3_2x.webp', '/img/TSH4_2x.webp', '/img/TSH5_2x.webp'] },
                                { num: '03', name: 'Blue Marlin Komodo', tags: ['Ads Management', 'Photo Production'], imgs: ['/img/BMK1_2x.webp', '/img/BMK2_2x.webp', '/img/BMK3_2x.webp', '/img/BMK4_2x.webp', '/img/BMK5_2x.webp'] },
                                { num: '04', name: 'Surf & Brew Cafe', tags: ['Social Media Management'], imgs: ['/img/SNB1_2x.webp', '/img/SNB2_2x.webp', '/img/SNB3_2x.webp', '/img/SNB4_2x.webp', '/img/SNB5_2x.webp'] },
                                { num: '05', name: 'Hot Stone', tags: ['Social Media Management'], imgs: ['/img/HS1_2x.webp', '/img/HS2_2x.webp', '/img/HS3_2x.webp', '/img/HS4_2x.webp', '/img/HS5_2x.webp'] },
                            ].map((work) => (
                                <div
                                    key={work.num}
                                    className="border-t border-white/20 py-6 flex flex-col md:flex-row md:items-center gap-3 md:gap-8 group relative transition-colors duration-300 hover:bg-white/5 cursor-pointer"
                                    onMouseEnter={() => {
                                        window._workSlideIdx = 0;
                                        window._workImgs = work.imgs;
                                        window._lastMoveX = 0;
                                        setHoveredWork(work.imgs[0]);
                                    }}
                                    onMouseLeave={() => {
                                        window._workImgs = null;
                                    }}
                                    onMouseMove={(e) => {
                                        setCursorPos({ x: e.clientX, y: e.clientY });
                                        if (window._workImgs) {
                                            const diff = Math.abs(e.clientX - (window._lastMoveX || 0));
                                            if (diff > 80) {
                                                window._lastMoveX = e.clientX;
                                                window._workSlideIdx = ((window._workSlideIdx || 0) + 1) % window._workImgs.length;
                                                setHoveredWork(window._workImgs[window._workSlideIdx]);
                                            }
                                        }
                                    }}
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

                        {/* Mobile Horizontal Slide Layout */}
                        <div className="block md:hidden -mx-6 mt-6">
                            <div className="flex overflow-x-auto gap-4 px-6 pb-6 snap-x snap-mandatory scrollbar-hide">
                                {[
                                    { id: 'tanuki', num: '01', name: 'Tanuki Sushi & Bar', tags: ['Branding', 'Social Media Management', 'Photo Production'], imgs: ['/img/Tanuki1_2x.webp', '/img/Tanuki2_2x.webp', '/img/Tanuki3_2x.webp', '/img/Tanuki4_2x.webp', '/img/Tanuki5_2x.webp'] },
                                    { id: 'tsh', num: '02', name: 'The Smoke House', tags: ['Photo Production', 'Social Media Management'], imgs: ['/img/TSH1_2x.webp', '/img/TSH2_2x.webp', '/img/TSH3_2x.webp', '/img/TSH4_2x.webp', '/img/TSH5_2x.webp'] },
                                    { id: 'bmk', num: '03', name: 'Blue Marlin Komodo', tags: ['Photo Production', 'Ads Management'], imgs: ['/img/BMK1_2x.webp', '/img/BMK2_2x.webp', '/img/BMK3_2x.webp', '/img/BMK4_2x.webp', '/img/BMK5_2x.webp'] },
                                    { id: 'snb', num: '04', name: 'Surf & Brew Cafe', tags: ['Social Media Management'], imgs: ['/img/SNB1_2x.webp', '/img/SNB2_2x.webp', '/img/SNB3_2x.webp', '/img/SNB4_2x.webp', '/img/SNB5_2x.webp'] },
                                    { id: 'hs', num: '05', name: 'Hot Stone', tags: ['Social Media Management'], imgs: ['/img/HS1_2x.webp', '/img/HS2_2x.webp', '/img/HS3_2x.webp', '/img/HS4_2x.webp', '/img/HS5_2x.webp'] },
                                ].map((work) => (
                                    <MobileWorkCard key={work.num} work={work} />
                                ))}
                            </div>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mt-16 leading-tight">
                            And <strong className="font-bold">Many More</strong>
                        </h2>
                    </div>
                </div>
            </section>

            {/* Photo Showcase Section */}
            <section className="bg-black overflow-hidden">
                <div className="w-full overflow-hidden whitespace-nowrap text-[0]">
                    <div className="inline-block animate-scroll align-top">
                        <div className="inline-block w-[400vw] md:w-[300vw] lg:w-[200vw]">
                            <img src="/img/photowrap.webp?v=3" alt="Photo Showcase" className="w-full h-auto block" />
                        </div>
                        <div className="inline-block w-[400vw] md:w-[300vw] lg:w-[200vw]">
                            <img src="/img/photowrap.webp?v=3" alt="Photo Showcase" className="w-full h-auto block" />
                        </div>
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
                        className="relative overflow-hidden transition-[max-height] duration-700 ease-in-out"
                        style={{ maxHeight: showClientWrap ? '2500px' : '80px' }}
                    >
                        <picture>
                            <source media="(max-width: 767px)" srcSet="/img/clientm.webp?v=3" />
                            <img
                                src="/img/full client.webp?v=3"
                                alt="And many more"
                                className="w-full"
                            />
                        </picture>
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
                            className="flex items-center gap-2 bg-transparent text-white text-lg font-light cursor-pointer border-none outline-none active:opacity-70 md:hover:opacity-70 transition-opacity duration-300 whitespace-nowrap"
                        >
                            {showClientWrap ? 'And many more' : 'View all clients'}
                            <span
                                className="inline-flex flex-shrink-0 items-center justify-center w-7 h-7 rounded-full border border-white/60 transition-transform duration-500"
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



            {/* Responsive Wrapper - Form first in DOM, Video second */}
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

                {/* Motion Video Section - SECOND in DOM, lg:order-1 for desktop */}
                <section className="bg-black lg:order-1">
                    <video
                        src="/img/MOTION TP.MP4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full"
                        style={{ display: 'block', objectFit: 'cover' }}
                    />
                </section>
            </div>

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

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-500 backdrop-blur-md cursor-pointer ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15" />
                </svg>
            </button>

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
