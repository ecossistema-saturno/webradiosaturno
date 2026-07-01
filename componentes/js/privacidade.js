        const themeToggleBtn = document.getElementById('theme-toggle');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                if (document.documentElement.getAttribute('data-theme') === 'dark') {
                    document.documentElement.removeAttribute('data-theme');
                } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                }
            });
        }

        const menuToggleBtn = document.getElementById('menu-toggle');
        const navMenuEl = document.getElementById('nav-menu');
        if (menuToggleBtn && navMenuEl) {
            menuToggleBtn.addEventListener('click', () => {
                navMenuEl.classList.toggle('active');
            });
        }

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        function updateOnlineStatus() {
            const banner = document.getElementById('offline-banner');
            if (banner) banner.style.display = navigator.onLine ? 'none' : 'block';
        }
        updateOnlineStatus();
