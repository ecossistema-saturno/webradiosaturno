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

            var offlineBanner = document.getElementById('offline-banner');
            function updateOfflineStatus() {
                if (!navigator.onLine) {
                    offlineBanner.style.display = 'block';
                } else {
                    offlineBanner.style.display = 'none';
                }
            }
            window.addEventListener('online', updateOfflineStatus);
            window.addEventListener('offline', updateOfflineStatus);
            updateOfflineStatus();

            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) { console.log('SW registrado!', reg); })
                    .catch(function(err) { console.warn('Falha ao registrar SW:', err); });
            }

            document.getElementById('copyright-year').textContent = new Date().getFullYear();

            var form = document.getElementById('contato-form');
            var statusEl = document.getElementById('form-status');

            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var nome = document.getElementById('contato-nome').value.trim();
                var email = document.getElementById('contato-email').value.trim();
                var assunto = document.getElementById('contato-assunto').value;
                var mensagem = document.getElementById('contato-mensagem').value.trim();

                if (!nome || !email || !mensagem) {
                    statusEl.textContent = 'Preencha todos os campos obrigatórios.';
                    statusEl.className = 'form-status error';
                    return;
                }
                if (!email.includes('@') || !email.includes('.')) {
                    statusEl.textContent = 'Digite um e-mail válido.';
                    statusEl.className = 'form-status error';
                    return;
                }

                statusEl.textContent = 'Enviando...';
                statusEl.className = 'form-status';

                setTimeout(function() {
                    statusEl.textContent = 'Mensagem enviada com sucesso! Em breve responderemos.';
                    statusEl.className = 'form-status success';
                    form.reset();
                }, 1200);

                fetch('https://zbtuydxefpysgcgpwbzm.supabase.co/rest/v1/contatos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpidHV5ZHhlZnB5c2djZ3B3YnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzcyODcsImV4cCI6MjA5ODMxMzI4N30.tCmYwoIccZQqZyIOKP_GbQ3NDInS3muOQtI4vGMyzXI',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({ nome, email, assunto, mensagem })
                })
                .then(function(res) {
                    if (!res.ok) throw new Error('Erro no servidor');
                    statusEl.textContent = 'Mensagem enviada com sucesso!';
                    statusEl.className = 'form-status success';
                    form.reset();
                })
                .catch(function(err) {
                    statusEl.textContent = 'Erro ao enviar. Tente novamente mais tarde.';
                    statusEl.className = 'form-status error';
                    console.error(err);
                });
            });

        })();
