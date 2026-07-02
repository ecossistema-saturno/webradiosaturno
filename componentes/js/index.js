        (function() {
            'use strict';

            if (window.location.search.includes('utm_source=')) {
                document.getElementById('utm-blocker').style.display = 'flex';
                document.body.style.overflow = 'hidden';
                document.querySelector('header').style.display = 'none';
                document.querySelector('nav').style.display = 'none';
                document.querySelector('.main-layout').style.display = 'none';
                document.querySelector('footer').style.display = 'none';
                return;
            }

            var themeToggle = document.getElementById('theme-toggle');
            var currentTheme = localStorage.getItem('theme') || 'light';
            if (currentTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
            themeToggle.addEventListener('click', function() {
                var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                if (isDark) {
                    document.documentElement.removeAttribute('data-theme');
                    localStorage.setItem('theme', 'light');
                } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                }
            });

            var menuToggle = document.getElementById('menu-toggle');
            var navMenu = document.getElementById('nav-menu');
            menuToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
            });

            var SUPABASE_URL = 'https://zbtuydxefpysgcgpwbzm.supabase.co';
            var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpidHV5ZHhlZnB5c2djZ3B3YnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzcyODcsImV4cCI6MjA5ODMxMzI4N30.tCmYwoIccZQqZyIOKP_GbQ3NDInS3muOQtI4vGMyzXI';

            function fetchLiveStatus() {
                return fetch(SUPABASE_URL + '/rest/v1/status?select=ao_vivo,mensagem_ao_vivo,mensagem_fora_ar&limit=1', {
                    headers: { 'apikey': SUPABASE_KEY }
                })
                .then(function(response) {
                    if (!response.ok) throw new Error('Erro ao buscar status');
                    return response.json();
                })
                .then(function(data) {
                    return data[0] || { ao_vivo: true, mensagem_ao_vivo: 'A programação está no ar neste momento.', mensagem_fora_ar: 'No momento estamos fora do ar. Volte em breve!' };
                })
                .catch(function(e) {
                    console.warn('Erro ao carregar status ao vivo:', e);
                    return { ao_vivo: true, mensagem_ao_vivo: 'A programação está no ar.', mensagem_fora_ar: 'Fora do ar.' };
                });
            }

            function fetchNoticias() {
                return fetch(SUPABASE_URL + '/rest/v1/noticias?select=*&order=created_at.desc&limit=5', {
                    headers: { 'apikey': SUPABASE_KEY }
                })
                .then(function(response) {
                    if (!response.ok) throw new Error('Erro ao buscar notícias');
                    return response.json();
                })
                .catch(function(e) {
                    console.warn('Erro ao carregar notícias:', e);
                    return [];
                });
            }

            function fetchProgramacao() {
                return fetch(SUPABASE_URL + '/rest/v1/programacao?select=*&order=horario.asc&limit=10', {
                    headers: { 'apikey': SUPABASE_KEY }
                })
                .then(function(response) {
                    if (!response.ok) throw new Error('Erro ao buscar programação');
                    return response.json();
                })
                .catch(function(e) {
                    console.warn('Erro ao carregar programação:', e);
                    return [];
                });
            }

            function fetchPlantao() {
                return fetch(SUPABASE_URL + '/rest/v1/plantao?select=*&ativo=eq.true&order=created_at.desc&limit=1', {
                    headers: { 'apikey': SUPABASE_KEY }
                })
                .then(function(response) {
                    if (!response.ok) throw new Error('Erro ao buscar plantão');
                    return response.json();
                })
                .then(function(data) {
                    return data[0] || null;
                })
                .catch(function(e) {
                    console.warn('Erro ao carregar plantão:', e);
                    return null;
                });
            }

            function updateStatus(statusData) {
                var card = document.getElementById('status-card');
                var badge = card.querySelector('.status-badge');
                var dot = badge.querySelector('.dot');
                var msg = badge.querySelector('.status-message');
                var textEl = document.getElementById('status-text');
                var isLive = statusData.ao_vivo;
                var message = isLive ? statusData.mensagem_ao_vivo : statusData.mensagem_fora_ar;

                if (isLive) {
                    card.className = 'glass-card status-card live';
                    dot.style.background = '#FFFFFF';
                    dot.style.animation = 'pulse-dot 1.5s infinite';
                    msg.textContent = 'AO VIVO';
                } else {
                    card.className = 'glass-card status-card offair';
                    dot.style.background = '#888';
                    dot.style.animation = 'none';
                    msg.textContent = 'FORA DO AR';
                }
                textEl.textContent = message || (isLive ? 'A programação está no ar.' : 'Fora do ar.');
            }

            function renderNoticias(noticias) {
                var container = document.getElementById('news-container');
                if (!noticias || noticias.length === 0) {
                    container.innerHTML = '<div class="empty-state">Nenhuma notícia disponível.</div>';
                    return;
                }
                var html = '';
                for (var i = 0; i < noticias.length; i++) {
                    var n = noticias[i];
                    html += '<div class="news-item"><div class="news-title">' + (n.titulo || 'Sem título') + '</div><div class="news-sub">' + (n.resumo || '') + '</div></div>';
                }
                container.innerHTML = html;
            }

            function renderProgramacao(prog) {
                var container = document.getElementById('prog-container');
                if (!prog || prog.length === 0) {
                    container.innerHTML = '<div class="empty-state">Nenhum programa agendado.</div>';
                    return;
                }
                var html = '';
                for (var i = 0; i < prog.length; i++) {
                    var p = prog[i];
                    var diasHtml = p.dias ? '<span class="prog-dias">' + p.dias + '</span>' : '';
                    html += '<div class="prog-item"><span class="prog-time">' + (p.horario || '--:--') + '</span><div class="prog-info"><div class="prog-name">' + (p.nome || 'Programa') + '</div>' + diasHtml + '<div class="prog-host">' + (p.apresentador || '') + '</div></div></div>';
                }
                container.innerHTML = html;
            }

            function renderPlantao(plantao) {
                var container = document.getElementById('plantao-container');
                var body = document.getElementById('plantao-body');
                if (plantao) {
                    container.style.display = 'block';
                    body.innerHTML = '<p style="font-weight:bold;">' + (plantao.titulo || 'Aviso') + '</p><p>' + (plantao.conteudo || '') + '</p>';
                } else {
                    container.style.display = 'none';
                }
            }

            function carregarTudo() {
                Promise.all([fetchLiveStatus(), fetchNoticias(), fetchProgramacao(), fetchPlantao()])
                    .then(function(results) {
                        var statusData = results[0];
                        var noticias = results[1];
                        var prog = results[2];
                        var plantao = results[3];
                        updateStatus(statusData);
                        renderNoticias(noticias);
                        renderProgramacao(prog);
                        renderPlantao(plantao);
                    })
                    .catch(function(e) {
                        console.error('Erro ao carregar dados iniciais:', e);
                    });
            }

            carregarTudo();

            var newsletterForm = document.getElementById('newsletter-form');
            var newsletterEmail = document.getElementById('newsletter-email');
            var newsletterStatus = document.getElementById('newsletter-status');
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var email = newsletterEmail.value.trim();
                if (!email) return;
                newsletterStatus.textContent = 'Enviando...';
                newsletterStatus.className = 'newsletter-status';
                fetch(SUPABASE_URL + '/rest/v1/newsletter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_KEY,
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({ email: email })
                })
                .then(function() {
                    newsletterStatus.textContent = 'Inscrição realizada com sucesso! 📬';
                    newsletterStatus.className = 'newsletter-status success';
                    newsletterEmail.value = '';
                })
                .catch(function(err) {
                    console.error('Erro ao inscrever:', err);
                    newsletterStatus.textContent = 'Erro ao inscrever. Tente novamente.';
                    newsletterStatus.className = 'newsletter-status error';
                });
            });

            var cookieBanner = document.getElementById('cookie-banner');
            var cookieAccept = document.getElementById('cookie-accept');
            var cookieReject = document.getElementById('cookie-reject');
            var cookieInfo = document.getElementById('cookie-info');
            if (!localStorage.getItem('cookie-consent')) {
                cookieBanner.style.display = 'flex';
            }
            cookieAccept.addEventListener('click', function() {
                localStorage.setItem('cookie-consent', 'accepted');
                cookieBanner.style.display = 'none';
            });
            cookieReject.addEventListener('click', function() {
                localStorage.setItem('cookie-consent', 'rejected');
                cookieBanner.style.display = 'none';
            });
            cookieInfo.addEventListener('click', function() {
                alert('Política de Cookies: Utilizamos cookies para melhorar sua experiência. Você pode gerenciar suas preferências a qualquer momento.');
            });

            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) { console.log('SW registrado!', reg); })
                    .catch(function(err) { console.warn('Falha ao registrar SW:', err); });
            }

            document.getElementById('copyright-year').textContent = new Date().getFullYear();

            var playerContainer = document.getElementById('player-container');
            var script = document.createElement('script');
            script.src = 'https://cdn.cloud.caster.fm//widgets/embed.js';
            script.async = true;
            script.defer = true;
            playerContainer.appendChild(script);
        })();
