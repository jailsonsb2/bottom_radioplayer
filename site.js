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

    // --- idioma ------------------------------------------------------------
    // O js/i18n.js é opcional: sem ele o site inteiro fica no português que
    // está escrito no HTML e nas chamadas abaixo. Por isso todo t() carrega o
    // texto original como segundo argumento — ele não é "a tradução default",
    // é o que aparece quando a camada de idiomas não está na página.
    const i18n = window.SiteI18n || null;
    const t = (chave, padrao, ...args) => (i18n ? i18n.t(chave, ...args) : padrao);
    if (i18n) i18n.apply(document);

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text) node.textContent = text;
        return node;
    }

    // --- cor de destaque do site (content.theme) ---------------------------
    // Uma cor só configura tudo: o degradê dos botões (--site-accent-2), o
    // brilho do fundo (--site-glow-1), a cor do texto sobre o accent
    // (--site-accent-ink, escolhida pelo contraste) e a cor de partida do
    // player (--accent, até a capa da música ditar a dela). Vai num <style>
    // porque o tema claro é um seletor de atributo — style inline não chega
    // lá.

    function hexToRgb(hex) {
        const clean = String(hex || "").trim().replace(/^#/, "");
        const full = clean.length === 3 ? clean.replace(/./g, (c) => c + c) : clean;
        if (!/^[0-9a-f]{6}$/i.test(full)) return null;
        const n = parseInt(full, 16);
        return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    }

    const rgbToHex = ({ r, g, b }) =>
        "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");

    // luminância relativa (WCAG) — decide se o texto sobre a cor fica claro
    // ou escuro e se o accent precisa escurecer no tema claro
    function luminance({ r, g, b }) {
        const channel = (value) => {
            const v = value / 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    }

    const scaleRgb = (rgb, factor) => ({ r: rgb.r * factor, g: rgb.g * factor, b: rgb.b * factor });
    const rgba = (rgb, alpha) => `rgba(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}, ${alpha})`;
    const inkFor = (rgb) => (luminance(rgb) > 0.45 ? "#04252a" : "#ffffff");

    const accentRgb = hexToRgb((content.theme || {}).accent);
    if (accentRgb) {
        // tema claro: usa a cor informada ou escurece a principal quando ela
        // é clara demais para servir de fundo de texto branco
        const lightRgb = hexToRgb((content.theme || {}).accentLight) ||
            (luminance(accentRgb) > 0.45 ? scaleRgb(accentRgb, 0.7) : accentRgb);

        let styleTag = document.getElementById("site-theme-vars");
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = "site-theme-vars";
            document.head.appendChild(styleTag);
        }
        styleTag.textContent =
            ":root{" +
            `--site-accent:${rgbToHex(accentRgb)};` +
            `--site-accent-2:${rgbToHex(scaleRgb(accentRgb, 0.62))};` +
            `--site-accent-ink:${inkFor(accentRgb)};` +
            `--site-glow-1:${rgba(accentRgb, 0.12)};` +
            `--accent:${rgbToHex(accentRgb)}}` +
            ':root[data-theme="light"]{' +
            `--site-accent:${rgbToHex(lightRgb)};` +
            `--site-accent-2:${rgbToHex(scaleRgb(lightRgb, 0.75))};` +
            `--site-accent-ink:${inkFor(lightRgb)};` +
            `--site-glow-1:${rgba(lightRgb, 0.14)}}`;
    }

    // --- estilo visual (content.theme.style) -------------------------------
    // Um atributo no <html> troca a linguagem visual do site E do dock:
    // glass (padrão) · clay · minimal · liquid · spatial. Quem pinta é o
    // css/ui-styles.css; aqui só validamos a escolha.
    // As páginas do site já aplicam isto no pré-boot do <head> (antes do
    // primeiro paint, para não piscar o vidro antes do estilo certo) — esta
    // linha é a rede de segurança para páginas sem o pré-boot e o ponto de
    // reaplicação após a navegação seamless.

    const UI_STYLES = ["glass", "clay", "minimal", "liquid", "spatial"];
    const uiStyle = String((content.theme || {}).style || "glass");
    document.documentElement.dataset.ui = UI_STYLES.includes(uiStyle) ? uiStyle : "glass";

    // --- zoom no hover (content.theme.hoverZoom) ---------------------------
    // Só o crescer é opcional; o levantar e a borda que acende ficam. Marcamos
    // apenas a RECUSA (data-hover-zoom="off") em vez de escrever "on" no caso
    // normal: sem o atributo o CSS é byte a byte o de sempre, e quem nunca
    // ouviu falar deste campo não paga nada por ele.
    if ((content.theme || {}).hoverZoom === false) {
        document.documentElement.dataset.hoverZoom = "off";
    } else {
        delete document.documentElement.dataset.hoverZoom;
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

    // --- menu mobile (hambúrguer) ------------------------------------------
    // Em telas pequenas o .site-nav vira um painel colapsável; o botão
    // alterna a classe nav-open no header. onclick (e não addEventListener)
    // pelo mesmo motivo do toggle de tema: reexecução via seamless.

    const navToggle = document.getElementById("nav-toggle");
    if (navToggle) {
        const header = navToggle.closest(".site-header");
        const setOpen = (open) => {
            header.classList.toggle("nav-open", open);
            navToggle.setAttribute("aria-expanded", open ? "true" : "false");
            navToggle.setAttribute("aria-label", open ? t("a11y.menuClose", "Fechar menu") : t("a11y.menuOpen", "Abrir menu"));
        };
        navToggle.onclick = () => setOpen(!header.classList.contains("nav-open"));
        // clicar num link do menu fecha o painel (âncoras não recarregam a página)
        header.querySelectorAll(".site-nav a").forEach((link) => {
            link.onclick = () => setOpen(false);
        });

        // --- o menu cabe na linha? ------------------------------------------
        // Abaixo de 1150px a media query já resolve por largura de tela; aqui
        // é o caso que ela não enxerga: acima disso o header ainda pode ficar
        // sem espaço porque GANHOU um item. O botão de instalar chega segundos
        // depois do primeiro desenho (quando o navegador dispara o
        // beforeinstallprompt), o chip de clima se remove sozinho se o serviço
        // não responder, e o menu muda de largura junto com o idioma — é
        // conteúdo variável, não largura de janela.
        //
        // A medida é o topo do primeiro link comparado ao do último: se
        // diferem, algum item caiu para a segunda fileira.
        const nav = header.querySelector(".site-nav");
        const extras = () => header.querySelector(".header-extras");

        // Ligar/desligar a classe muda a altura do header, e isso acorda o
        // ResizeObserver de novo. Sem esta trava a medição chamaria a si
        // mesma — o navegador reclama de "ResizeObserver loop" e o header
        // pisca.
        let medindo = false;

        function ajustarMenu() {
            if (medindo) return;
            if (!nav || !nav.children.length) return;
            medindo = true;
            try {
                medir();
            } finally {
                // solta a trava só no quadro seguinte, depois de o layout
                // novo já ter acordado (e sido ignorado por) o observador
                requestAnimationFrame(() => { medindo = false; });
            }
        }

        function medir() {
            // No território da media query ela é a dona: com o menu já virado
            // painel absoluto, medir aqui só devolveria "cabe" e ficaríamos
            // ligando e desligando a classe para sempre.
            if (window.matchMedia("(max-width: 1150px)").matches) {
                header.classList.remove("is-crowded");
                return;
            }

            // Mede sempre no estado expandido: com .is-crowded valendo, o menu
            // está fora do fluxo e qualquer medida diria que sobra espaço.
            // Tirar e repor na mesma execução não chega a pintar na tela.
            const estava = header.classList.contains("is-crowded");
            header.classList.remove("is-crowded");

            const links = nav.children;
            const quebrou = links[links.length - 1].offsetTop > links[0].offsetTop;

            header.classList.toggle("is-crowded", quebrou);
            if (estava && !quebrou) setOpen(false); // voltou a caber: fecha o painel
        }

        // A navegação seamless reexecuta este script: derruba os observadores
        // da página anterior, que apontam para nós que já saíram do documento.
        if (window.__headerObservers) {
            window.__headerObservers.forEach((o) => o.disconnect());
        }
        const observadores = [];

        if ("ResizeObserver" in window) {
            // pega redimensionamento da janela e mudança de largura dos chips
            // (o clima só sabe a temperatura depois que o fetch volta)
            const ro = new ResizeObserver(() => ajustarMenu());
            ro.observe(header);
            observadores.push(ro);
        } else {
            window.addEventListener("resize", ajustarMenu);
            // embrulhado para o disconnect() lá de cima também alcançar este
            observadores.push({ disconnect: () => window.removeEventListener("resize", ajustarMenu) });
        }

        if ("MutationObserver" in window) {
            // e a chegada tardia do botão de instalar, que é o caso que
            // desconfigurava o header depois de tudo já estar no lugar
            const mo = new MutationObserver(() => ajustarMenu());
            const alvo = extras() || header.querySelector(".site-header-inner");
            if (alvo) mo.observe(alvo, { childList: true, subtree: true });
            observadores.push(mo);
        }

        window.__headerObservers = observadores;
        ajustarMenu();
    }

    // --- seções: ordem (content.order) e visibilidade ----------------------
    //
    // As seções vivem no HTML numa ordem fixa; content.order reordena os
    // blocos da página E os links do menu sem tocar no HTML. O hero fica
    // sempre em cima e o rodapé embaixo (nenhum dos dois entra na lista).
    //
    // has() repete a condição que cada bloco de renderização usa mais
    // abaixo: sem conteúdo, a seção some no fim do script (título incluso) e
    // leva o link do menu junto. É por conteúdo, e não por "o container ficou
    // vazio", porque as páginas internas têm o menu sem ter as seções — lá o
    // link precisa sumir do mesmo jeito.

    const SECTIONS = [
        { id: "noticias", has: () => !!(content.news || []).length },
        { id: "videos", has: () => !!(content.videos || []).length },
        { id: "galeria", has: () => !!photos.length },
        { id: "programacao", has: () => !!content.schedule },
        { id: "equipe", has: () => !!(content.team || []).length },
        { id: "contato", has: () => !!content.about },
    ];

    // o link do menu aponta para "#id" na home e "index.html#id" nas internas
    const navLinkFor = (id) => document.querySelector('.site-nav a[href$="#' + id + '"]');

    // ordem pedida, sem repetidos nem nomes desconhecidos; o que faltar vai
    // para o fim na ordem padrão (assim uma lista incompleta não perde seção)
    const sectionOrder = (Array.isArray(content.order) ? content.order : [])
        .filter((id, i, list) => list.indexOf(id) === i && SECTIONS.some((s) => s.id === id));
    SECTIONS.forEach((s) => {
        if (!sectionOrder.includes(s.id)) sectionOrder.push(s.id);
    });

    const container = document.querySelector(".site-container");
    if (container) {
        // reinserir antes do rodapé mantém o hero (que não está na lista) no topo
        const siteFooter = container.querySelector(".site-footer");
        sectionOrder.forEach((id) => {
            const section = document.getElementById(id);
            if (section && section.parentNode === container) container.insertBefore(section, siteFooter);
        });
    }

    const siteNav = document.querySelector(".site-nav");
    if (siteNav) {
        // links que não são de seção (o "Sobre", que é outra página) ficam no
        // fim, na ordem em que estavam — daí o rank alto e o sort estável
        const rank = (link) => {
            const href = link.getAttribute("href") || "";
            const id = sectionOrder.findIndex((sid) => href.endsWith("#" + sid));
            return id === -1 ? sectionOrder.length : id;
        };
        Array.from(siteNav.children)
            .sort((a, b) => rank(a) - rank(b))
            .forEach((link) => siteNav.appendChild(link));
    }

    // --- hero: slider com autoavanço ---------------------------------------

    const heroRoot = document.getElementById("site-hero");
    const slides = content.slides || (content.hero ? [{ ...content.hero, button: { label: t("hero.listen", "▶ Ouvir agora"), action: "play" } }] : []);
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
            dot.setAttribute("aria-label", t("hero.slide", "Slide " + (index + 1), index + 1));
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
        // a data acompanha o idioma: "26 de julho de 2026" vira "July 26, 2026"
        return date.toLocaleDateString(i18n ? i18n.locale() : "pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    }

    // Modal com o conteúdo completo da notícia (fecha por X, overlay ou Esc)
    function openNewsModal(item) {
        const overlay = el("div", "news-modal");
        const card = el("article", "news-modal-card");

        const closeButton = el("button", "news-modal-close", "✕");
        closeButton.type = "button";
        closeButton.setAttribute("aria-label", t("a11y.close", "Fechar"));
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
            body.appendChild(el("span", "news-card-more", t("news.more", "Ler mais →")));
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
            // Pausa MANUAL do vídeo (2) com o modo clipe ligado = o usuário
            // escolheu o áudio: desliga o modo para a troca de música não
            // reabrir o vídeo. Vídeo que TERMINOU (0) mantém o modo.
            if (state === 2 && localStorage.getItem("site:clipmode") === "1") {
                localStorage.setItem("site:clipmode", "0");
                const clipButton = window.RadioPlayer && window.RadioPlayer.root && window.RadioPlayer.root.querySelector(".player-button-clip");
                if (clipButton) clipButton.classList.remove("is-active");
                videoState.lastClipId = null;
                closeVideoDock();
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
            close.setAttribute("aria-label", t("video.close", "Fechar vídeo"));
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
        button.title = t("video.clipTitle", "Modo clipe: mostra o clipe da música que está tocando");
        button.innerHTML = '<svg class="i" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="3"></rect><path d="m10 9 5 3-5 3z"></path></svg>' + t("video.clip", "Clipe");
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

        // Clipe fica junto da Letra: os dois são extras da música que está
        // tocando (a fita vai de som → música → histórico → rádio → divulgar)
        right.insertBefore(button, right.querySelector(".player-button-lyrics"));
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
            thumb.setAttribute("aria-label", t("video.watch", "Assistir: " + video.title, video.title));

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

    // --- galeria de fotos (grid + lightbox) -------------------------------
    //
    // As miniaturas usam photo.thumb quando existir (versão leve) e caem
    // para a própria foto. O lightbox navega com setas, teclado e swipe.

    function openLightbox(photos, startIndex) {
        let index = startIndex;

        const overlay = el("div", "lightbox");
        const figure = el("figure", "lightbox-figure");
        const img = el("img");
        const caption = el("figcaption", "lightbox-caption");
        const counter = el("div", "lightbox-counter");

        const closeButton = el("button", "lightbox-close", "✕");
        closeButton.type = "button";
        closeButton.setAttribute("aria-label", t("a11y.close", "Fechar"));

        const prevButton = el("button", "lightbox-nav lightbox-prev", "‹");
        prevButton.type = "button";
        prevButton.setAttribute("aria-label", t("gallery.prev", "Foto anterior"));

        const nextButton = el("button", "lightbox-nav lightbox-next", "›");
        nextButton.type = "button";
        nextButton.setAttribute("aria-label", t("gallery.next", "Próxima foto"));

        figure.appendChild(img);
        figure.appendChild(caption);
        overlay.appendChild(closeButton);
        overlay.appendChild(prevButton);
        overlay.appendChild(figure);
        overlay.appendChild(nextButton);
        overlay.appendChild(counter);

        if (photos.length < 2) {
            prevButton.hidden = true;
            nextButton.hidden = true;
            counter.hidden = true;
        }

        function show(next) {
            index = (next + photos.length) % photos.length;
            const photo = photos[index];
            img.src = photo.image || photo.thumb;
            img.alt = photo.caption || "";
            caption.textContent = photo.caption || "";
            caption.hidden = !photo.caption;
            counter.textContent = index + 1 + " / " + photos.length;
        }

        function close() {
            overlay.remove();
            document.body.classList.remove("lightbox-open");
            document.removeEventListener("keydown", onKey);
        }

        function onKey(event) {
            if (event.key === "Escape") close();
            else if (event.key === "ArrowRight") show(index + 1);
            else if (event.key === "ArrowLeft") show(index - 1);
        }

        closeButton.addEventListener("click", close);
        prevButton.addEventListener("click", () => show(index - 1));
        nextButton.addEventListener("click", () => show(index + 1));
        // clique no fundo (fora da foto e dos botões) fecha
        overlay.addEventListener("click", (event) => {
            if (event.target === overlay || event.target === figure) close();
        });
        document.addEventListener("keydown", onKey);

        // swipe horizontal no celular
        let touchStartX = null;
        overlay.addEventListener("touchstart", (event) => {
            touchStartX = event.changedTouches[0].clientX;
        }, { passive: true });
        overlay.addEventListener("touchend", (event) => {
            if (touchStartX === null) return;
            const delta = event.changedTouches[0].clientX - touchStartX;
            touchStartX = null;
            if (Math.abs(delta) > 50) show(index + (delta < 0 ? 1 : -1));
        }, { passive: true });

        show(index);
        document.body.appendChild(overlay);
        document.body.classList.add("lightbox-open");
        requestAnimationFrame(() => overlay.classList.add("is-open"));
    }

    const galleryGrid = document.getElementById("site-gallery");
    const photos = (content.gallery || []).filter((photo) => photo && (photo.image || photo.thumb));
    if (galleryGrid && photos.length) {
        photos.forEach((photo, index) => {
            const item = el("button", "gallery-item");
            item.type = "button";
            const descricao = photo.caption || t("gallery.photo", "foto " + (index + 1), index + 1);
            item.setAttribute("aria-label", t("gallery.zoom", "Ampliar: " + descricao, descricao));

            const img = el("img");
            img.src = photo.thumb || photo.image;
            img.alt = photo.caption || "";
            img.loading = "lazy";
            item.appendChild(img);

            if (photo.caption) item.appendChild(el("span", "gallery-caption", photo.caption));

            item.addEventListener("click", () => openLightbox(photos, index));
            galleryGrid.appendChild(item);
        });
    }

    // --- programação (abas por dia, hoje pré-selecionado) ----------------

    const scheduleRoot = document.getElementById("site-schedule");
    if (scheduleRoot && content.schedule) {
        const DAYS = [
            { key: "seg", label: t("day.seg", "Segunda"), short: t("day.short.seg", "Seg") },
            { key: "ter", label: t("day.ter", "Terça"), short: t("day.short.ter", "Ter") },
            { key: "qua", label: t("day.qua", "Quarta"), short: t("day.short.qua", "Qua") },
            { key: "qui", label: t("day.qui", "Quinta"), short: t("day.short.qui", "Qui") },
            { key: "sex", label: t("day.sex", "Sexta"), short: t("day.short.sex", "Sex") },
            { key: "sab", label: t("day.sab", "Sábado"), short: t("day.short.sab", "Sáb") },
            { key: "dom", label: t("day.dom", "Domingo"), short: t("day.short.dom", "Dom") },
        ];
        const WEEKDAY_KEYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
        const todayKey = WEEKDAY_KEYS[new Date().getDay()];

        const tabs = el("div", "schedule-tabs");
        const list = el("div", "schedule-list");

        function renderDay(key) {
            list.innerHTML = "";
            const slots = content.schedule[key] || [];
            if (!slots.length) {
                list.appendChild(el("div", "schedule-empty", t("schedule.empty", "Programação musical contínua.")));
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

        // Os dois rótulos saem juntos no HTML e quem escolhe é o CSS: no
        // desktop cabe "Segunda", no celular só "Seg" — sete abas em uma
        // linha só, sem a segunda fileira quebrada que sobrava antes. Fazer
        // isto por media query, e não medindo a tela no script, é o que
        // mantém o rótulo certo quando a pessoa vira o aparelho.
        DAYS.forEach((day) => {
            const tab = el("button", "schedule-tab");
            tab.appendChild(el("span", "schedule-tab-long", day.label));
            tab.appendChild(el("span", "schedule-tab-short", day.short));
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
    if (teamGrid && Array.isArray(content.team) && content.team.length) {
        teamGrid.classList.remove("team-grid");
        teamGrid.classList.add("team-track");

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

        // Setas esquerda/direita: rolam um cartão por clique. Só fazem
        // sentido (e só aparecem) quando o conteúdo realmente transborda —
        // com poucos membros, o grid já mostra tudo sem precisar rolar.
        const wrap = el("div", "team-carousel");
        teamGrid.parentNode.insertBefore(wrap, teamGrid);

        const prevButton = el("button", "team-arrow team-arrow-prev", "‹");
        prevButton.type = "button";
        prevButton.setAttribute("aria-label", t("team.prev", "Membro anterior"));

        const nextButton = el("button", "team-arrow team-arrow-next", "›");
        nextButton.type = "button";
        nextButton.setAttribute("aria-label", t("team.next", "Próximo membro"));

        wrap.appendChild(prevButton);
        wrap.appendChild(teamGrid);
        wrap.appendChild(nextButton);

        function scrollAmount() {
            const card = teamGrid.querySelector(".team-card");
            return (card ? card.getBoundingClientRect().width : 200) + 20;
        }
        prevButton.addEventListener("click", () => teamGrid.scrollBy({ left: -scrollAmount(), behavior: "smooth" }));
        nextButton.addEventListener("click", () => teamGrid.scrollBy({ left: scrollAmount(), behavior: "smooth" }));

        function updateArrows() {
            const overflowing = teamGrid.scrollWidth > teamGrid.clientWidth + 4;
            wrap.classList.toggle("has-overflow", overflowing);
            prevButton.disabled = teamGrid.scrollLeft <= 4;
            nextButton.disabled = teamGrid.scrollLeft >= teamGrid.scrollWidth - teamGrid.clientWidth - 4;
        }
        teamGrid.addEventListener("scroll", updateArrows);
        window.addEventListener("resize", updateArrows);
        updateArrows();
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

    // --- sobre a rádio: história + contato (home e página Sobre) ----------

    const CONTACT_ICONS = {
        address: '<svg viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
        phone: '<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5 12.8 12.8 0 0 0 2.8.7 2 2 0 0 1 1.7 2Z"></path></svg>',
        whatsapp: SOCIAL_ICONS.whatsapp,
        email: '<svg viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="3"></rect><path d="m2 7 10 7L22 7"></path></svg>',
    };

    // anel da Alexa (card "Como nos ouvir")
    const ALEXA_ICON = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="3.5"></circle></svg>';

    function weatherEmoji(desc) {
        const text = String(desc || "").toLowerCase();
        if (/thunder/.test(text)) return "⛈️";
        if (/snow|sleet|ice/.test(text)) return "❄️";
        if (/rain|drizzle|shower/.test(text)) return "🌧️";
        if (/fog|mist|haze/.test(text)) return "🌫️";
        if (/overcast|cloudy/.test(text)) return "☁️";
        if (/partly/.test(text)) return "⛅";
        if (/clear|sunny/.test(text)) return "☀️";
        return "🌡️";
    }

    const about = content.about || {};

    // --- extras no header (topo): clima + botão de doação -----------------
    // Ficam no topo, à la portal (UOL): um chip de clima discreto (emoji +
    // cidade + temperatura) e um botão pequeno de doação. Injetados no
    // header por JS para valer nas duas páginas sem duplicar HTML; o guard
    // por .header-extras evita reinjeção na navegação seamless.
    const HEART_ICON = '<svg viewBox="0 0 24 24"><path d="M12 21s-7-4.35-9.5-8.5A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6.5C19 16.65 12 21 12 21Z"></path></svg>';
    const GLOBE_ICON = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18"></path></svg>';

    document.querySelectorAll(".site-header-inner").forEach((headerInner) => {
        if (headerInner.querySelector(".header-extras")) return;
        const themeToggle = headerInner.querySelector("#theme-toggle");
        const extras = el("div", "header-extras");

        // clima da cidade (wttr.in — sem chave de API)
        if (about.city) {
            const weather = el("a", "header-weather");
            weather.href = "https://wttr.in/" + encodeURIComponent(about.city);
            weather.target = "_blank";
            weather.rel = "noopener";
            weather.title = t("about.weather", "Previsão do tempo em " + about.city, about.city);
            const icon = el("span", "header-weather-icon", "🌡️");
            const info = el("span", "header-weather-info");
            info.appendChild(el("span", "header-weather-city", about.city));
            const temp = el("span", "header-weather-temp", "--°");
            info.appendChild(temp);
            weather.appendChild(icon);
            weather.appendChild(info);
            extras.appendChild(weather);

            fetch(`https://wttr.in/${encodeURIComponent(about.city)}?format=j1`)
                .then((response) => (response.ok ? response.json() : Promise.reject()))
                .then((data) => {
                    const current = data.current_condition && data.current_condition[0];
                    if (!current) return Promise.reject();
                    const desc = (current.weatherDesc && current.weatherDesc[0] && current.weatherDesc[0].value) || "";
                    icon.textContent = weatherEmoji(desc);
                    temp.textContent = current.temp_C + "°C";
                })
                .catch(() => weather.remove()); // serviço indisponível: não mostra chip quebrado
        }

        // botão de doação
        if (about.donation && about.donation.url) {
            const donate = el("a", "header-donate");
            donate.href = about.donation.url;
            donate.target = "_blank";
            donate.rel = "noopener";
            const heart = el("span", "header-donate-icon");
            heart.innerHTML = HEART_ICON;
            donate.appendChild(heart);
            donate.appendChild(el("span", null, about.donation.label || t("about.donate", "Doar")));
            extras.appendChild(donate);
        }

        // seletor de idioma (só existe se o js/i18n.js estiver na página)
        if (i18n) {
            const picker = el("label", "header-lang");
            picker.setAttribute("title", t("a11y.language", "Idioma"));

            const globo = el("span", "header-lang-icon");
            globo.innerHTML = GLOBE_ICON;
            globo.setAttribute("aria-hidden", "true");

            // <select> de verdade, e não um menu desenhado por nós: no celular
            // ele abre a roleta nativa do sistema, já vem navegável por teclado
            // e o leitor de tela anuncia sozinho quantas opções existem.
            //
            // O rótulo é a SIGLA, não "Português" por extenso: o cabeçalho tem
            // 1120px para o menu de sete itens mais os chips, e o nome inteiro
            // (132px) empurrava "Sobre" para uma segunda linha. Com a sigla
            // sobra espaço, e quem precisa do nome tem o globo ao lado, o
            // title e o aria-label — a sigla nunca fica sozinha como pista.
            const select = el("select");
            select.setAttribute("aria-label", t("a11y.language", "Idioma"));
            i18n.LANGS.forEach((lang) => {
                const option = el("option", null, lang.code.toUpperCase());
                option.value = lang.code;
                option.title = lang.label;
                if (lang.code === i18n.get()) option.selected = true;
                select.appendChild(option);
            });
            select.onchange = () => i18n.set(select.value);

            picker.appendChild(globo);
            picker.appendChild(select);
            extras.appendChild(picker);
        }

        if (extras.childNodes.length && themeToggle) headerInner.insertBefore(extras, themeToggle);
    });

    // --- apps oficiais: badges das lojas -----------------------------------
    // Usa os SVGs oficiais em assets/app/ (badge branco completo). O CSS
    // inverte a cor no tema claro para manter contraste. content.apps tem
    // prioridade; cai para o config.js do player quando vazio.

    const STORE_BADGES = {
        android: "assets/app/android.svg",
        ios: "assets/app/ios.svg",
    };
    const STORE_NAMES = { android: "Google Play", ios: "App Store" };

    const stationApps = (window.streams && window.streams.stations && window.streams.stations[0] && window.streams.stations[0].apps) || {};
    const appsData = Object.assign({}, stationApps, content.apps || {});
    const storeKeys = Object.keys(STORE_BADGES).filter((key) => appsData[key] && appsData[key] !== "#");

    function storeBadge(key) {
        const badge = el("a", "store-badge");
        badge.href = appsData[key];
        badge.target = "_blank";
        badge.rel = "noopener";
        badge.setAttribute("aria-label", STORE_NAMES[key]);
        const img = el("img");
        img.src = STORE_BADGES[key];
        img.alt = STORE_NAMES[key];
        img.loading = "lazy";
        badge.appendChild(img);
        return badge;
    }

    // --- sobre a rádio: história + como ouvir + contato + mapa ------------

    const aboutRoot = document.getElementById("site-about");
    if (aboutRoot && content.about) {
        const history = el("div", "about-history");
        String(about.history || "").split(/\n+/).forEach((paragraph) => {
            if (paragraph.trim()) history.appendChild(el("p", null, paragraph.trim()));
        });
        aboutRoot.appendChild(history);

        // coluna da direita: "como nos ouvir" em cima, contato embaixo
        const side = el("div", "about-side");

        // card "Como nos ouvir": apps das lojas + frase da Alexa
        // content.listen ausente = card com os textos padrão; listen: null
        // (ou false) esconde o card de vez
        const listen = content.listen === undefined ? {} : content.listen;
        if (listen && (storeKeys.length || listen.alexaPhrase || appsData.alexa)) {
            const card = el("div", "listen-card");
            card.appendChild(el("h3", null, listen.title || t("listen.title", "Como nos ouvir?")));
            if (listen.text) card.appendChild(el("p", "listen-text", listen.text));

            if (storeKeys.length) {
                const stores = el("div", "listen-stores");
                storeKeys.forEach((key) => stores.appendChild(storeBadge(key)));
                card.appendChild(stores);
            }

            if (listen.alexaPhrase || appsData.alexa) {
                card.appendChild(el("span", "listen-alexa-label", t("listen.alexa", "Ou peça para a Alexa:")));
                const chip = el(appsData.alexa ? "a" : "div", "listen-alexa");
                if (appsData.alexa) {
                    chip.href = appsData.alexa;
                    chip.target = "_blank";
                    chip.rel = "noopener";
                }
                const icon = el("span", "listen-alexa-icon");
                icon.innerHTML = ALEXA_ICON;
                chip.appendChild(icon);
                chip.appendChild(el("span", null, "“" + (listen.alexaPhrase || t("listen.alexaPhrase", "Alexa, tocar " + (brand.name || "a rádio"), brand.name || t("listen.station", "a rádio"))) + "”"));
                card.appendChild(chip);
            }

            side.appendChild(card);
        }

        const contact = about.contact || {};
        const items = [
            { key: "address", label: contact.address },
            { key: "phone", label: contact.phone, href: contact.phone ? "tel:" + String(contact.phone).replace(/[^+\d]/g, "") : "" },
            { key: "whatsapp", label: contact.whatsapp ? "WhatsApp" : "", href: contact.whatsapp },
            { key: "email", label: contact.email, href: contact.email ? "mailto:" + contact.email : "" },
        ].filter((item) => item.label);

        if (items.length) {
            const card = el("div", "contact-card");
            card.appendChild(el("h3", null, t("contact.title", "Contato")));
            items.forEach((item) => {
                const row = el(item.href ? "a" : "div", "contact-item");
                if (item.href) {
                    row.href = item.href;
                    if (/^https?:/i.test(item.href)) {
                        row.target = "_blank";
                        row.rel = "noopener";
                    }
                }
                const icon = el("span", "contact-icon");
                icon.innerHTML = CONTACT_ICONS[item.key];
                row.appendChild(icon);
                row.appendChild(el("span", null, item.label));
                card.appendChild(row);
            });
            side.appendChild(card);
        }

        if (side.childNodes.length) aboutRoot.appendChild(side);

        // mapa da cidade (Google Maps embed — sem chave de API)
        const mapQuery = contact.address || about.city;
        if (mapQuery) {
            const mapCard = el("div", "map-card");
            const iframe = el("iframe");
            iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
            iframe.loading = "lazy";
            iframe.title = t("about.map", "Mapa: " + mapQuery, mapQuery);
            mapCard.appendChild(iframe);
            aboutRoot.appendChild(mapCard);
        }
    }

    // --- apps oficiais no rodapé (badges de loja) ------------------------

    document.querySelectorAll(".site-footer").forEach((footer) => {
        if (footer.querySelector(".footer-apps") || !storeKeys.length) return;

        const wrap = el("div", "footer-apps");
        storeKeys.forEach((key) => wrap.appendChild(storeBadge(key)));
        footer.insertBefore(wrap, footer.firstChild);
    });

    // --- footer -----------------------------------------------------------

    const footerText = document.getElementById("site-footer-text");
    if (footerText && content.footer) {
        footerText.textContent = "© " + new Date().getFullYear() + " " + (content.footer.text || "");
    }

    // --- seção vazia some (título incluso) e leva o link do menu junto -----
    //
    // Atribuir hidden nos dois sentidos (e não só true) mantém isto
    // idempotente na reexecução da navegação seamless.

    SECTIONS.forEach(({ id, has }) => {
        const empty = !has();
        const section = document.getElementById(id);
        if (section) section.hidden = empty;
        const link = navLinkFor(id);
        if (link) link.hidden = empty;
    });

    // --- rolagem das âncoras, com duração própria --------------------------
    //
    // O scroll-behavior: smooth do CSS já suaviza, mas a DURAÇÃO é do
    // navegador e não se configura: o Chrome despacha qualquer distância em
    // ~300ms, o que numa página longa lê como corte seco. Por isso a
    // animação vem para cá, com o tempo proporcional ao caminho.
    //
    // A regra do CSS fica onde está de propósito: continua valendo para o
    // que não passa por aqui (voltar pelo histórico, âncora aberta direto
    // pela URL) e é a rede de segurança se este script não rodar.

    const querMenosMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // dá para afinar pelo content.js: theme.scrollDuration em milissegundos
    const DURACAO_MAX = Number((content.theme || {}).scrollDuration) || 1100;
    const DURACAO_MIN = Math.min(500, DURACAO_MAX);

    // Milissegundos por pixel percorrido. Sai do teto em vez de ser um número
    // fixo para o ajuste responder na faixa inteira: com um fator fixo, subir
    // o scrollDuration acima da duração natural do trecho mais longo da
    // página não mudava nada, e quem pedisse "mais devagar" não veria efeito.
    // O divisor é a página de referência (1800px de percurso); no padrão de
    // 1100 dá ~0,61 ms/px, que é o ritmo que estas seções já tinham.
    const RITMO = DURACAO_MAX / 1800;

    // acelera e freia simétrico (easeInOutCubic)
    const suavizar = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    if (window.__rolagemFrame) {
        cancelAnimationFrame(window.__rolagemFrame);
        window.__rolagemFrame = null;
    }

    // devolve a duração escolhida — quem chama usa para casar a trava do
    // destaque do menu com o tempo real da viagem
    function rolarAte(destinoY) {
        if (window.__rolagemFrame) cancelAnimationFrame(window.__rolagemFrame);

        const partida = window.scrollY;
        const teto = document.documentElement.scrollHeight - window.innerHeight;
        const distancia = Math.max(0, Math.min(destinoY, teto)) - partida;
        const duracao = Math.min(Math.max(Math.abs(distancia) * RITMO, DURACAO_MIN), DURACAO_MAX);

        if (querMenosMovimento || !distancia) {
            // "instant" aqui e no laço abaixo é obrigatório: sem ele o
            // scroll-behavior do CSS suavizaria cada passo da nossa própria
            // animação, e as duas suavizações brigariam
            window.scrollTo({ top: partida + distancia, behavior: "instant" });
            return 0;
        }

        // rolar no meio do caminho cancela a viagem: insistir seria brigar
        // com quem está tentando rolar na mão
        const desligar = () => {
            window.removeEventListener("wheel", cancelar);
            window.removeEventListener("touchstart", cancelar);
            window.removeEventListener("keydown", cancelar);
        };
        function cancelar() {
            if (window.__rolagemFrame) cancelAnimationFrame(window.__rolagemFrame);
            window.__rolagemFrame = null;
            desligar();
        }
        window.addEventListener("wheel", cancelar, { passive: true });
        window.addEventListener("touchstart", cancelar, { passive: true });
        window.addEventListener("keydown", cancelar);

        const inicio = performance.now();
        const passo = (agora) => {
            const t = Math.min((agora - inicio) / duracao, 1);
            window.scrollTo({ top: partida + distancia * suavizar(t), behavior: "instant" });
            if (t < 1) {
                window.__rolagemFrame = requestAnimationFrame(passo);
            } else {
                window.__rolagemFrame = null;
                desligar();
            }
        };
        window.__rolagemFrame = requestAnimationFrame(passo);
        return duracao;
    }

    // onde a seção deve parar: lê o scroll-padding-top do CSS em vez de
    // repetir o número aqui, para o recuo ter uma fonte só
    const recuoDoHeader = () =>
        parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;

    // --- menu: destaca a seção em que o visitante está ---------------------
    //
    // Uma faixa logo abaixo do header (o rootMargin recorta a viewport entre
    // 88px e 40% da altura) funciona de leitor: a seção que a cruza é a
    // atual. Vai depois do bloco acima de propósito — seção escondida não
    // entra na conta, senão marcaria um link que nem está no menu.
    //
    // Precisa da limpeza no topo porque a navegação seamless reexecuta este
    // script: sem desconectar, o observer da página anterior continuaria
    // vivo apontando para DOM removido (mesmo motivo do __heroSliderTimer).

    if (window.__navSpy) {
        window.__navSpy.disconnect();
        window.__navSpy = null;
    }
    if (window.__navSpyClick) {
        document.removeEventListener("click", window.__navSpyClick);
        window.__navSpyClick = null;
    }

    const spySections = sectionOrder
        .map((id) => document.getElementById(id))
        .filter((section) => section && !section.hidden);

    if (siteNav && spySections.length && "IntersectionObserver" in window) {
        // o clique trava a marcação por um instante: a rolagem suave
        // atravessa as seções do caminho e, sem a trava, o destaque piscava
        // em cada uma delas até assentar no destino
        let lockedUntil = 0;

        const markActive = (id) => {
            const current = id ? navLinkFor(id) : null;
            siteNav.querySelectorAll("a").forEach((link) => {
                link.classList.toggle("is-active", link === current);
            });
        };

        const crossing = new Set();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) crossing.add(entry.target.id);
                else crossing.delete(entry.target.id);
            });
            if (Date.now() < lockedUntil) return;
            // a faixa é alta e pode pegar duas seções: vale a de cima
            const current = spySections.find((section) => crossing.has(section.id));
            markActive(current ? current.id : null);
        }, { rootMargin: "-88px 0px -60% 0px" });

        spySections.forEach((section) => observer.observe(section));
        window.__navSpy = observer;

        // delegado no document (e não link.onclick) para não sobrescrever o
        // onclick que o menu mobile já usa para fechar o painel
        window.__navSpyClick = (event) => {
            if (event.defaultPrevented || event.button !== 0) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            const link = event.target.closest(".site-nav a");
            if (!link) return;
            const href = link.getAttribute("href") || "";
            const id = href.split("#")[1];
            const alvo = id && document.getElementById(id);
            if (!alvo) return;

            // só a âncora desta mesma página; "index.html#videos" clicado de
            // uma interna é troca de página, assunto do roteador do player
            const mesmaPagina = href.startsWith("#") ||
                new URL(href, location.href).pathname === location.pathname;
            if (!mesmaPagina) return;

            // preventDefault antes de rolar: sem isso o salto nativo do
            // navegador aconteceria junto e chegaríamos lá antes de animar.
            // O roteador do player ignora eventos já cancelados, então ele
            // também não se mete.
            event.preventDefault();
            const duracao = rolarAte(alvo.getBoundingClientRect().top + window.scrollY - recuoDoHeader());
            history.pushState(null, "", "#" + id);

            // a trava acompanha a viagem real: se o percurso é longo, ela
            // dura mais; se é curto, solta antes
            lockedUntil = Date.now() + duracao + 120;
            markActive(id);
        };
        document.addEventListener("click", window.__navSpyClick);
    }

    // --- entrada dos cartões ao rolar --------------------------------------
    //
    // Observer separado do __navSpy porque a faixa de leitura é outra: o spy
    // quer uma tira estreita no topo, a revelação quer disparar quando o
    // cartão está entrando na tela.
    //
    // Revela uma vez e para de observar: com a rolagem suave das âncoras,
    // clicar num item do menu atravessa várias seções em ~1s — se elas
    // reanimassem a cada passagem, o resultado seria pisca-pisca.
    //
    // Mesma limpeza do __navSpy (a navegação seamless reexecuta o script).

    if (window.__revealObserver) {
        window.__revealObserver.disconnect();
        window.__revealObserver = null;
    }

    if (!querMenosMovimento && "IntersectionObserver" in window) {
        // Os cartões das grades verticais entram um a um. A equipe entra
        // inteira, como bloco: é carrossel horizontal, e cartão parado fora
        // da faixa visível dele nunca cruzaria a viewport — ficaria invisível
        // até alguém rolar o carrossel de lado.
        const alvos = [
            ...document.querySelectorAll(".news-grid > *, .videos-grid > *, .gallery-grid > *"),
            ...document.querySelectorAll(".team-carousel"),
        ];

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-in");
                obs.unobserve(entry.target);
            });
        }, { rootMargin: "0px 0px -40px 0px" });

        alvos.forEach((alvo) => {
            if (alvo.classList.contains("is-in")) return; // já revelado antes
            // escadinha curta: o ciclo de 4 dá a cascata dentro da linha da
            // grade sem que o último cartão de uma lista longa fique meio
            // segundo esperando a vez
            const irmaos = alvo.parentNode ? [...alvo.parentNode.children] : [alvo];
            alvo.style.animationDelay = (irmaos.indexOf(alvo) % 4) * 60 + "ms";
            alvo.classList.add("reveal");
            observer.observe(alvo);
        });

        window.__revealObserver = observer;
    }
})();
