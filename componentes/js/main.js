        const SUPABASE_URL = "https://zbtuydxefpysgcgpwbzm.supabase.co";
        const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpidHV5ZHhlZnB5c2djZ3B3YnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzcyODcsImV4cCI6MjA5ODMxMzI4N30.tCmYwoIccZQqZyIOKP_GbQ3NDInS3muOQtI4vGMyzXI";

        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => {
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        });

        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        function updateOnlineStatus() {
            const banner = document.getElementById('offline-banner');
            if (navigator.onLine) {
                banner.style.display = 'none';
            } else {
                banner.style.display = 'block';
            }
        }
        updateOnlineStatus();

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // navigator.serviceWorker.register('/sw.js').then(reg => {}).catch(err => {});
            });
        }
