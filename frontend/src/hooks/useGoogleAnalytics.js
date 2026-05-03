import { useEffect } from 'react';

const useGoogleAnalytics = () => {
    useEffect(() => {
        // Cargar el script
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-HGW54LC8NG';
        document.head.appendChild(script1);

        // Inicializar gtag
        const script2 = document.createElement('script');
        script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-HGW54LC8NG');
    `;
        document.head.appendChild(script2);
    }, []);
};

export default useGoogleAnalytics;