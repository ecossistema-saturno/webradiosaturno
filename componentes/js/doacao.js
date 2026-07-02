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

            var toggleCheckbox = document.getElementById('toggle-qrcode');
            var qrContainer = document.getElementById('qrcode-container');
            toggleCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    qrContainer.classList.add('visible');
                } else {
                    qrContainer.classList.remove('visible');
                }
            });

            var btnCopiar = document.getElementById('btn-copiar-pix');
            btnCopiar.addEventListener('click', function(e) {
                e.preventDefault();
                var chave = 'contato.webradiosaturno@gmail.com';
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(chave).then(function() {
                        alert('Chave Pix copiada: ' + chave);
                    }).catch(function() {
                        alert('Não foi possível copiar. Copie manualmente: ' + chave);
                    });
                } else {
                    var textarea = document.createElement('textarea');
                    textarea.value = chave;
                    document.body.appendChild(textarea);
                    textarea.select();
                    try {
                        document.execCommand('copy');
                        alert('Chave Pix copiada: ' + chave);
                    } catch (e2) {
                        alert('Copie manualmente: ' + chave);
                    }
                    document.body.removeChild(textarea);
                }
            });

            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) { console.log('SW registrado!', reg); })
                    .catch(function(err) { console.warn('Falha ao registrar SW:', err); });
            }

            document.getElementById('copyright-year').textContent = new Date().getFullYear();

        })();
