// src/hooks/useGoogleAnalytics.js
import { useEffect } from 'react';

const useGoogleAnalytics = () => {
    useEffect(() => {
        // Evitar duplicados
        if (window.gtag) return;

        // Script 1: Cargar la librería
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-HGW54LC8NG';
        document.head.appendChild(script1);

        // Script 2: Inicializar gtag (ejecutar inmediatamente)
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };

        // Configurar GA
        window.gtag('js', new Date());
        window.gtag('config', 'G-HGW54LC8NG');
    }, []);
};

export default useGoogleAnalytics;