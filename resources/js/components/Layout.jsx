import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Layout() {
    const location = useLocation();

    useEffect(() => {
        // Meta Pixel Code - Initialize only once
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', '1439408024111143');
    }, []);

    // Track PageView on route change (SPA support)
    useEffect(() => {
        if (typeof window.fbq === 'function') {
            window.fbq('track', 'PageView');
        }
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <noscript>
                <img height="1" width="1" style={{ display: 'none' }} src="https://www.facebook.com/tr?id=1439408024111143&ev=PageView&noscript=1" alt="" />
            </noscript>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
