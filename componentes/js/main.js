        const SUPABASE_URL = "https://zbtuydxefpysgcgpwbzm.supabase.co";
        const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpidHV5ZHhlZnB5c2djZ3B3YnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzcyODcsImV4cCI6MjA5ODMxMzI4N30.tCmYwoIccZQqZyIOKP_GbQ3NDInS3muOQtI4vGMyzXI";

        const headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json"
        };

        async function loadSupabaseData() {
            if (SUPABASE_URL.includes("SUA_PROJECT_URL")) return;

            try {
                const configRes = await fetch(`${SUPABASE_URL}/rest/v1/configuracoes?id=eq.1`, { headers });
                const configData = await configRes.json();
                
                if (configData && configData[0]) {
                    const config = configData[0];
                    
                    if (config.stream_url && config.stream_url !== 'SUA_URL_AQUI') {
                        const player = document.getElementById('radio-player');
                        player.src = config.stream_url;
                    }

                    const plantaoCard = document.getElementById('plantao-container');
                    const plantaoBody = document.getElementById('plantao-body');
                    if (config.plantao_saturno_ativo === true) {
                        plantaoBody.innerHTML = `
                            <div class="news-title" style="color:#CC0000;">${config.plantao_titulo || ''}</div>
                            <div class="news-sub">${config.plantao_conteudo || ''}</div>
                        `;
                        plantaoCard.style.display = 'block';
                    } else {
                        plantaoCard.style.display = 'none';
                    }
                }

                const newsRes = await fetch(`${SUPABASE_URL}/rest/v1/noticias?publicado=eq.true&order=created_at.desc`, { headers });
                const newsData = await newsRes.json();
                const newsContainer = document.getElementById('news-container');
                
                if (!newsData || newsData.length === 0) {
                    newsContainer.innerHTML = '<div class="empty-state">Sem notícias disponíveis.</div>';
                } else {
                    newsContainer.innerHTML = newsData.map(item => `
                        <div class="news-item">
                            <div class="news-title">${item.titulo || ''}</div>
                            <div class="news-sub">${item.subtitulo || ''}</div>
                        </div>
                    `).join('');
                }

                const progRes = await fetch(`${SUPABASE_URL}/rest/v1/programacao?ativo=eq.true&order=horario.asc`, { headers });
                const progData = await progRes.json();
                const progContainer = document.getElementById('prog-container');
                
                if (!progData || progData.length === 0) {
                    progContainer.innerHTML = '<div class="empty-state">Sem programação disponível.</div>';
                } else {
                    progContainer.innerHTML = progData.map(item => `
                        <div class="prog-item">
                            <span class="prog-time">${item.horario ? item.horario.substring(0, 5) : ''}</span>
                            <div class="prog-info">
                                <div class="prog-name">${item.programa || ''}</div>
                                <div class="prog-host">${item.apresentador || ''}</div>
                                <div style="font-size: 11px; opacity: 0.6; margin-top: 2px;">${item.dia_semana || ''}</div>
                            </div>
                        </div>
                    `).join('');
                }

            } catch (error) {
                console.error("Erro ao carregar dados do Supabase:", error);
                document.getElementById('news-container').innerHTML = '<div class="empty-state">Sem notícias disponíveis.</div>';
                document.getElementById('prog-container').innerHTML = '<div class="empty-state">Sem programação disponível.</div>';
            }
        }

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
            banner.style.display = navigator.onLine ? 'none' : 'block';
        }

        updateOnlineStatus();
        loadSupabaseData();
