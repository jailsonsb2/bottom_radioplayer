/* ============================================================
   Renderiza as seções do site (notícias, vídeos, programação,
   equipe) a partir de window.siteContent (content.js).
   Cada seção só é montada se o elemento existir na página —
   páginas internas podem usar só um subconjunto.
   Compatível com a navegação seamless do player (reexecuta a
   cada troca de página sem efeitos colaterais).
   ============================================================ */

(function () {
    "use strict";

    const content = window.siteContent || {};

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text) node.textContent = text;
        return node;
    }

    // --- marca do header (logo substitui o texto quando configurado) ------

    const brand = content.brand || {};
    document.querySelectorAll(".site-brand").forEach((brandEl) => {
        const nameEl = brandEl.querySelector(".site-brand-name");
        if (brand.name && nameEl) nameEl.textContent = brand.name;
        if (brand.logo && !brandEl.querySelector(".site-brand-logo")) {
            const img = el("img", "site-brand-logo");
            img.src = brand.logo;
            img.alt = brand.name || "logo";
            brandEl.appendChild(img);
            if (nameEl) nameEl.remove();
        }
    });

    // --- tema claro/escuro (persistido; o pré-boot no <head> evita flash) --

    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        const icon = () => (document.documentElement.dataset.theme === "light" ? "🌙" : "☀️");
        themeToggle.textContent = icon();
        // onclick (e não addEventListener): se este script for reexecutado
        // sobre o mesmo DOM, a atribuição substitui em vez de acumular —
        // dois listeners alternariam o tema duas vezes (efeito nulo)
        themeToggle.onclick = () => {
            const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
            document.documentElement.dataset.theme = next;
            localStorage.setItem("site:theme", next);
            themeToggle.textContent = icon();
        };
    }

    // --- hero: slider com autoavanço ---------------------------------------

    const heroRoot = document.getElementById("site-hero");
    const slides = content.slides || (content.hero ? [{ ...content.hero, button: { label: "▶ Ouvir agora", action: "play" } }] : []);
    if (heroRoot && slides.length) {
        // navegação seamless reexecuta este script: derruba o timer da página
        // anterior para não acumular intervalos apontando para DOM removido
        if (window.__heroSliderTimer) {
            clearInterval(window.__heroSliderTimer);
            window.__heroSliderTimer = null;
        }

        const slidesWrap = el("div", "hero-slides");
        const imagesWrap = el("div", "hero-images");
        const dots = el("div", "hero-dots");
        const slideEls = [];
        const imageEls = [];
        const dotEls = [];

        slides.forEach((slide, index) => {
            const item = el("div", "hero-slide");

            const badge = el("span", "hero-badge");
            badge.appendChild(el("span", "site-brand-dot"));
            badge.appendChild(el("span", "hero-badge-text", " " + (slide.badge || "")));
            item.appendChild(badge);

            item.appendChild(el("h1", null, slide.title || ""));
            item.appendChild(el("p", null, slide.subtitle || ""));

            if (slide.button) {
                if (slide.button.action === "play") {
                    const button = el("button", "hero-cta", slide.button.label);
                    button.type = "button";
                    button.addEventListener("click", () => {
                        if (window.RadioPlayer) window.RadioPlayer.toggle();
                    });
                    item.appendChild(button);
                } else {
                    const link = el("a", "hero-cta", slide.button.label);
                    link.href = slide.button.url || "#";
                    if (/^https?:/i.test(slide.button.url || "")) {
                        link.target = "_blank";
                        link.rel = "noopener";
                    }
                    item.appendChild(link);
                }
            }

            // A imagem vive numa camada separada (irmã dos slides), nunca
            // dentro do slide: o transform da transição do slide viraria
            // containing block da imagem absoluta e ela "pulava" de posição
            // no fim da animação.
            if (slide.image) {
                const img = el("img", "hero-slide-image");
                img.src = slide.image;
                img.alt = "";
                img.loading = "lazy";
                imagesWrap.appendChild(img);
                imageEls[index] = img;
            }

            slidesWrap.appendChild(item);
            slideEls.push(item);

            const dot = el("button", "hero-dot");
            dot.type = "button";
            dot.setAttribute("aria-label", "Slide " + (index + 1));
            dot.addEventListener("click", () => {
                show(index);
                restart();
            });
            dots.appendChild(dot);
            dotEls.push(dot);
        });

        let current = 0;

        function show(index) {
            current = index;
            slideEls.forEach((s, i) => s.classList.toggle("is-active", i === index));
            imageEls.forEach((img, i) => { if (img) img.classList.toggle("is-active", i === index); });
            dotEls.forEach((d, i) => d.classList.toggle("is-active", i === index));
        }

        function restart() {
            if (window.__heroSliderTimer) clearInterval(window.__heroSliderTimer);
            if (slideEls.length > 1) {
                window.__heroSliderTimer = setInterval(() => show((current + 1) % slideEls.length), 6000);
            }
        }

        heroRoot.appendChild(imagesWrap);
        heroRoot.appendChild(slidesWrap);
        heroRoot.appendChild(dots);
        show(0);
        restart();

        // pausa o autoavanço enquanto o mouse está sobre o slide
        heroRoot.addEventListener("mouseenter", () => {
            if (window.__heroSliderTimer) clearInterval(window.__heroSliderTimer);
        });
        heroRoot.addEventListener("mouseleave", restart);
    }

    // --- notícias --------------------------------------------------------

    function formatDate(iso) {
        const date = new Date(iso + "T00:00:00");
        return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    }

    // Modal com o conteúdo completo da notícia (fecha por X, overlay ou Esc)
    function openNewsModal(item) {
        const overlay = el("div", "news-modal");
        const card = el("article", "news-modal-card");

        const closeButton = el("button", "news-modal-close", "✕");
        closeButton.type = "button";
        closeButton.setAttribute("aria-label", "Fechar");
        card.appendChild(closeButton);

        if (item.image) {
            const img = el("img");
            img.src = item.image;
            img.alt = item.title;
            card.appendChild(img);
        }

        const body = el("div", "news-modal-body");
        if (item.date) body.appendChild(el("div", "news-card-date", formatDate(item.date)));
        body.appendChild(el("h2", null, item.title));
        String(item.content || item.excerpt || "").split(/\n+/).forEach((paragraph) => {
            if (paragraph.trim()) body.appendChild(el("p", null, paragraph.trim()));
        });
        card.appendChild(body);

        overlay.appendChild(card);
        document.body.appendChild(overlay);
        document.body.classList.add("news-modal-open");

        function close() {
            overlay.remove();
            document.body.classList.remove("news-modal-open");
            document.removeEventListener("keydown", onKey);
        }
        function onKey(event) {
            if (event.key === "Escape") close();
        }

        closeButton.addEventListener("click", close);
        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) close();
        });
        document.addEventListener("keydown", onKey);

        requestAnimationFrame(() => overlay.classList.add("is-open"));
    }

    const newsGrid = document.getElementById("site-news");
    if (newsGrid && Array.isArray(content.news)) {
        content.news.forEach((item) => {
            const card = el("a", "news-card");
            card.href = item.url || "#";

            if (item.content) {
                // Notícia com conteúdo próprio: abre no modal da página
                card.addEventListener("click", (event) => {
                    event.preventDefault();
                    openNewsModal(item);
                });
            } else if (/^https?:/i.test(item.url || "")) {
                card.target = "_blank";
                card.rel = "noopener";
            }

            const img = el("img");
            img.src = item.image;
            img.alt = item.title;
            img.loading = "lazy";
            card.appendChild(img);

            const body = el("div", "news-card-body");
            if (item.date) body.appendChild(el("div", "news-card-date", formatDate(item.date)));
            body.appendChild(el("h3", null, item.title));
            body.appendChild(el("p", null, item.excerpt || ""));
            body.appendChild(el("span", "news-card-more", "Ler mais →"));
            card.appendChild(body);

            newsGrid.appendChild(card);
        });
    }

    // --- vídeos (click-to-play: thumbnail leve, iframe só ao clicar) -----
    //
    // Integração com a rádio: dar play num vídeo pausa a rádio; pausar (ou
    // terminar) o vídeo retoma a rádio sozinho. Usa o protocolo postMessage
    // do IFrame do YouTube (enablejsapi=1) — sem biblioteca externa.

    // Estado global (sobrevive às trocas de página do seamless, que
    // reexecutam este script): a rádio deve voltar quando o vídeo parar?
    window.__videoState = window.__videoState || { resume: false, playing: new Set() };
    const videoState = window.__videoState;

    function handleYouTubeMessage(event) {
        if (!/(^|\.)youtube(-nocookie)?\.com$/.test((() => { try { return new URL(event.origin).hostname; } catch (e) { return ""; } })())) return;
        let data;
        try { data = JSON.parse(event.data); } catch (e) { return; }
        const state = data && data.info && typeof data.info.playerState === "number" ? data.info.playerState : null;
        if (state === null) return;

        const id = data.id || "yt";
        if (state === 1) { // tocando
            videoState.playing.add(id);
            if (window.RadioPlayer && !window.RadioPlayer.audio.paused) {
                videoState.resume = true;
                window.RadioPlayer.pause();
            }
        } else if (state === 2 || state === 0) { // pausado ou terminou
            videoState.playing.delete(id);
            if (videoState.resume && videoState.playing.size === 0 && window.RadioPlayer && window.RadioPlayer.audio.paused) {
                window.RadioPlayer.play();
                if (state === 0) videoState.resume = false;
            }
        }
    }

    // substitui o listener global em vez de acumular (reexecuções)
    if (window.__ytWatcher) window.removeEventListener("message", window.__ytWatcher);
    window.__ytWatcher = handleYouTubeMessage;
    window.addEventListener("message", window.__ytWatcher);

    // --- modo vídeo: mini-player flutuante que sobrevive à navegação ------
    // O dock é marcado com data-seamless-keep: a troca de página não o
    // remove, então o vídeo continua tocando enquanto o visitante navega
    // (mesma ideia do áudio da rádio).

    function closeVideoDock() {
        const dock = document.getElementById("video-dock");
        if (!dock) return;
        dock.remove();
        videoState.playing.clear();
        videoState.lastClipId = null;
        if (videoState.resume && window.RadioPlayer && window.RadioPlayer.audio.paused) {
            window.RadioPlayer.play();
        }
        videoState.resume = false;
    }

    function openVideoDock(video, index) {
        let dock = document.getElementById("video-dock");
        if (!dock) {
            dock = el("div", "video-dock");
            dock.id = "video-dock";
            dock.setAttribute("data-seamless-keep", "");

            const header = el("div", "video-dock-header");
            header.appendChild(el("span", "video-dock-title"));
            const close = el("button", "video-dock-close", "✕");
            close.type = "button";
            close.setAttribute("aria-label", "Fechar vídeo");
            close.addEventListener("click", closeVideoDock);
            header.appendChild(close);

            dock.appendChild(header);
            dock.appendChild(el("div", "video-dock-body"));
            document.body.appendChild(dock);
        }

        dock.querySelector(".video-dock-title").textContent = video.title;

        const body = dock.querySelector(".video-dock-body");
        body.innerHTML = "";
        const iframe = el("iframe");
        iframe.src = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&enablejsapi=1` + (video.start ? `&start=${video.start}` : "");
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.title = video.title;
        // handshake do widget: faz o player emitir os eventos de estado
        iframe.addEventListener("load", () => {
            const hello = JSON.stringify({ event: "listening", id: "video-" + index, channel: "widget" });
            iframe.contentWindow.postMessage(hello, "*");
        });
        body.appendChild(iframe);

        // pausa a rádio para não tocar por cima do vídeo
        if (window.RadioPlayer && !window.RadioPlayer.audio.paused) {
            videoState.resume = true;
            window.RadioPlayer.pause();
        }
    }

    // --- modo clipe: quando a API do now-playing entrega o youtubeId da
    // música, um botão "Clipe" aparece no player — ligado, o mini-player
    // mostra o clipe da música tocando e troca de embed a cada faixa.
    // O botão só é injetado quando a API demonstra suportar o campo.

    const CLIP_KEY = "site:clipmode";
    const clipModeOn = () => localStorage.getItem(CLIP_KEY) === "1";

    function openClip(track) {
        if (!track.youtubeId || videoState.lastClipId === track.youtubeId) return;
        videoState.lastClipId = track.youtubeId;

        // Sincroniza com a rádio: o clipe começa no ponto em que a música
        // está (elapsed da API + tempo desde a resposta), não do zero.
        // Aproximado por natureza: o stream tem atraso de buffer e o clipe
        // pode ser outra versão da música.
        let start = 0;
        if (track.elapsed && track.receivedAt) {
            start = Math.floor(track.elapsed + (Date.now() - track.receivedAt) / 1000);
            if (track.duration && start >= track.duration - 5) start = 0; // já no fim: melhor do início
            if (start < 8) start = 0; // começo da música: não vale a busca
        }

        openVideoDock({ id: track.youtubeId, title: track.title + " — " + track.artist, start }, "clip");
    }

    function ensureClipButton() {
        if (!window.RadioPlayer || !window.RadioPlayer.root) return;
        const right = window.RadioPlayer.root.querySelector(".player-right");
        if (!right || right.querySelector(".player-button-clip")) return;

        const button = el("button", "player-button player-button-clip");
        button.type = "button";
        button.title = "Modo clipe: mostra o clipe da música que está tocando";
        button.innerHTML = '<svg class="i" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="3"></rect><path d="m10 9 5 3-5 3z"></path></svg>Clipe';
        button.classList.toggle("is-active", clipModeOn());

        button.addEventListener("click", () => {
            const turningOn = !clipModeOn();
            localStorage.setItem(CLIP_KEY, turningOn ? "1" : "0");
            button.classList.toggle("is-active", turningOn);
            if (turningOn) {
                const track = window.RadioPlayer.currentTrack;
                if (track && track.youtubeId) openClip(track);
            } else {
                videoState.lastClipId = null;
                closeVideoDock();
            }
        });

        right.insertBefore(button, right.querySelector(".player-button-history"));
    }

    function onTrackChange(event) {
        const track = event.detail;
        if (track.youtubeId) ensureClipButton(); // a API suporta clipes
        if (!clipModeOn()) return;

        if (track.youtubeId) {
            openClip(track);
        } else {
            // música sem clipe: fecha o vídeo e volta para a rádio
            videoState.lastClipId = null;
            closeVideoDock();
        }
    }

    // substitui o listener em reexecuções (navegação seamless)
    if (window.__clipWatcher) document.removeEventListener("radioplayer:track", window.__clipWatcher);
    window.__clipWatcher = onTrackChange;
    document.addEventListener("radioplayer:track", window.__clipWatcher);

    // reinjeta o botão se o player já conhece uma faixa com clipe
    if (window.RadioPlayer && window.RadioPlayer.currentTrack && window.RadioPlayer.currentTrack.youtubeId) {
        ensureClipButton();
    }

    const videosGrid = document.getElementById("site-videos");
    if (videosGrid && Array.isArray(content.videos)) {
        content.videos.forEach((video, index) => {
            const card = el("div", "video-card");

            const thumb = el("button", "video-thumb");
            thumb.type = "button";
            thumb.setAttribute("aria-label", "Assistir: " + video.title);

            const img = el("img");
            img.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
            img.alt = video.title;
            img.loading = "lazy";
            thumb.appendChild(img);

            thumb.addEventListener("click", () => openVideoDock(video, index));

            card.appendChild(thumb);
            card.appendChild(el("div", "video-card-title", video.title));
            videosGrid.appendChild(card);
        });
    }

    // --- programação (abas por dia, hoje pré-selecionado) ----------------

    const scheduleRoot = document.getElementById("site-schedule");
    if (scheduleRoot && content.schedule) {
        const DAYS = [
            { key: "seg", label: "Segunda" },
            { key: "ter", label: "Terça" },
            { key: "qua", label: "Quarta" },
            { key: "qui", label: "Quinta" },
            { key: "sex", label: "Sexta" },
            { key: "sab", label: "Sábado" },
            { key: "dom", label: "Domingo" },
        ];
        const WEEKDAY_KEYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
        const todayKey = WEEKDAY_KEYS[new Date().getDay()];

        const tabs = el("div", "schedule-tabs");
        const list = el("div", "schedule-list");

        function renderDay(key) {
            list.innerHTML = "";
            const slots = content.schedule[key] || [];
            if (!slots.length) {
                list.appendChild(el("div", "schedule-empty", "Programação musical contínua."));
                return;
            }
            slots.forEach((slot) => {
                const item = el("div", "schedule-item");
                item.appendChild(el("span", "schedule-time", slot.time));
                item.appendChild(el("span", "schedule-name", slot.name));
                item.appendChild(el("span", "schedule-host", slot.host || ""));
                list.appendChild(item);
            });
        }

        DAYS.forEach((day) => {
            const tab = el("button", "schedule-tab", day.label);
            tab.type = "button";
            if (day.key === todayKey) tab.classList.add("is-active");
            tab.addEventListener("click", () => {
                tabs.querySelectorAll(".schedule-tab").forEach((t) => t.classList.remove("is-active"));
                tab.classList.add("is-active");
                renderDay(day.key);
            });
            tabs.appendChild(tab);
        });

        scheduleRoot.appendChild(tabs);
        scheduleRoot.appendChild(list);
        renderDay(todayKey);
    }

    // --- equipe -----------------------------------------------------------

    const teamGrid = document.getElementById("site-team");
    if (teamGrid && Array.isArray(content.team)) {
        content.team.forEach((member) => {
            const card = el("div", "team-card");
            const img = el("img");
            img.src = member.photo;
            img.alt = member.name;
            img.loading = "lazy";
            card.appendChild(img);
            card.appendChild(el("h3", null, member.name));
            card.appendChild(el("span", null, member.role));
            teamGrid.appendChild(card);
        });
    }

    // --- redes sociais (saíram do player; vivem no rodapé do site) --------

    const SOCIAL_ICONS = {
        facebook: '<svg viewBox="0 0 24 24"><path d="M17 14h-3v8h-4v-8H7v-4h3V7a5 5 0 0 1 5-5h3v4h-3q-1 0-1 1v3h4Z"></path></svg>',
        twitter: '<svg viewBox="0 0 24 24"><path d="m3 21 7.5-7.5m3-3L21 3M8 3H3l13 18h5Z"></path></svg>',
        instagram: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><rect width="20" height="20" x="2" y="2" rx="5"></rect><path d="M17.5 6.5h0"></path></svg>',
        youtube: '<svg viewBox="0 0 24 24"><path d="M1.5 17q-1-5.5 0-10Q1.9 4.8 4 4.5q8-1 16 0 2.1.3 2.5 2.5 1 4.5 0 10-.4 2.2-2.5 2.5-8 1-16 0-2.1-.3-2.5-2.5Zm8-8.5v7l6-3.5Z"></path></svg>',
        tiktok: '<svg viewBox="0 0 24 24"><path d="M22 6v5q-4 0-6-2v7a7 7 0 1 1-5-6.7m0 6.7a2 2 0 1 0-2 2 2 2 0 0 0 2-2V1h5q2 5 6 5"></path></svg>',
        whatsapp: '<svg viewBox="0 0 24 24"><circle cx="9" cy="9" r="1"></circle><circle cx="15" cy="15" r="1"></circle><path d="M8 9a7 7 0 0 0 7 7m-9 5.2A11 11 0 1 0 2.8 18L2 22Z"></path></svg>',
        telegram: '<svg viewBox="0 0 24 24"><path d="M12.5 16 9 19.5 7 13l-5.5-2 21-8-4 18-7.5-7 4-3"></path></svg>',
    };

    const socialWrap = document.getElementById("site-social");
    const socialData = content.social || (window.streams && window.streams.stations && window.streams.stations[0] && window.streams.stations[0].social) || null;
    if (socialWrap && socialData) {
        Object.keys(socialData).forEach((key) => {
            const url = socialData[key];
            if (!url || !SOCIAL_ICONS[key]) return;
            const link = el("a", "site-social-item");
            link.href = url;
            link.target = "_blank";
            link.rel = "noopener";
            link.setAttribute("aria-label", key);
            link.innerHTML = SOCIAL_ICONS[key];
            socialWrap.appendChild(link);
        });
    }

    // --- footer -----------------------------------------------------------

    const footerText = document.getElementById("site-footer-text");
    if (footerText && content.footer) {
        footerText.textContent = "© " + new Date().getFullYear() + " " + (content.footer.text || "");
    }
})();
