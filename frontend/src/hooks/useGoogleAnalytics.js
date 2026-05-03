// src/hooks/useGoogleAnalytics.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_MEASUREMENT_ID = 'G-HGW54LC8NG';

const useGoogleAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        // Inicialización única
        if (!window.gtag) {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            window.gtag = function () {
                window.dataLayer.push(arguments);
            };
            window.gtag('js', new Date());
        }

        // Envío de evento de página vista
        console.log('GA Page View:', location.pathname + location.search);
        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: location.pathname + location.search,
            send_page_view: true // Aseguramos que se envíe la vista
        });
    }, [location]); // Se dispara cada vez que cambia la URL
};

export default useGoogleAnalytics;