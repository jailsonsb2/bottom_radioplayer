/* ============================================================
   Idiomas do site — português, inglês, espanhol e italiano
   ------------------------------------------------------------
   O QUE ENTRA AQUI
   Só os textos FIXOS: títulos de seção, menu, dias da semana,
   rótulos de botão e as descrições de acessibilidade. O que você
   escreve no content.js (notícias, programas, nomes da equipe,
   slides) sai como está — é o seu conteúdo, não a moldura, e
   traduzi-lo seria inventar palavras que você não escreveu.

   COMO O IDIOMA É ESCOLHIDO
   1. o que a pessoa escolheu antes (localStorage)
   2. o idioma do navegador dela, se for um dos quatro
   3. content.theme.language, se você definir um padrão
   4. português

   COMO USAR NO HTML
       <h2 data-i18n="section.news">Últimas notícias</h2>
       <button data-i18n-aria-label="a11y.menu" aria-label="Abrir menu">

   O texto que fica no HTML é o português. Não é redundância: é o
   que aparece se este arquivo não carregar, e é o que os
   buscadores leem antes de qualquer script rodar.

   COMO USAR NO JS
       const t = window.SiteI18n.t;
       botao.textContent = t("news.more");

   TRADUÇÃO FALTANDO
   Cai no português e segue a vida — nunca mostra a chave crua na
   tela. Para acrescentar um idioma, copie um bloco inteiro,
   traduza os valores e ponha o código em LANGS.
   ============================================================ */

(function () {
    "use strict";

    const LANGS = [
        { code: "pt", label: "Português", htmlLang: "pt-BR", locale: "pt-BR" },
        { code: "en", label: "English", htmlLang: "en", locale: "en-US" },
        { code: "es", label: "Español", htmlLang: "es", locale: "es-ES" },
        { code: "it", label: "Italiano", htmlLang: "it", locale: "it-IT" },
    ];

    const STORAGE_KEY = "site:lang";
    const FALLBACK = "pt";

    const DICT = {
        pt: {
            // navegação e cabeçalho
            "nav.news": "Notícias",
            "nav.videos": "Vídeos",
            "nav.gallery": "Galeria",
            "nav.schedule": "Programação",
            "nav.team": "Equipe",
            "nav.contact": "Contato",
            "nav.about": "Sobre",

            // títulos das seções
            "section.news": "Últimas notícias",
            "section.videos": "Vídeos em destaque",
            "section.gallery": "Galeria de fotos",
            "section.schedule": "Programação da semana",
            "section.team": "Nossa equipe",
            "section.about": "Sobre a rádio",
            "section.history": "Nossa história",

            // página "sobre"
            "page.about.title": "Sobre a rádio",
            "page.about.badge": "Sobre nós",
            "page.about.heading": "Uma rádio que não para 🎶",
            "page.about.text": "Você navegou para outra página e a música continuou tocando — o player é um componente que intercepta a navegação interna e troca só o conteúdo da página, mantendo o áudio vivo.",

            // rodapé
            "footer.about": "Sobre a rádio",
            "footer.home": "Voltar ao início",

            // notícias
            "news.more": "Ler mais →",

            // vídeos
            "video.watch": "Assistir: {0}",
            "video.close": "Fechar vídeo",
            "video.clip": "Clipe",
            "video.clipTitle": "Modo clipe: mostra o clipe da música que está tocando",

            // galeria
            "gallery.zoom": "Ampliar: {0}",
            "gallery.photo": "foto {0}",
            "gallery.prev": "Foto anterior",
            "gallery.next": "Próxima foto",

            // programação
            "day.seg": "Segunda",
            "day.ter": "Terça",
            "day.qua": "Quarta",
            "day.qui": "Quinta",
            "day.sex": "Sexta",
            "day.sab": "Sábado",
            "day.dom": "Domingo",
            "day.short.seg": "Seg",
            "day.short.ter": "Ter",
            "day.short.qua": "Qua",
            "day.short.qui": "Qui",
            "day.short.sex": "Sex",
            "day.short.sab": "Sáb",
            "day.short.dom": "Dom",
            "schedule.empty": "Programação musical contínua.",

            // equipe
            "team.prev": "Membro anterior",
            "team.next": "Próximo membro",

            // sobre / contato
            "listen.title": "Como nos ouvir?",
            "listen.alexa": "Ou peça para a Alexa:",
            "listen.alexaPhrase": "Alexa, tocar {0}",
            "listen.station": "a rádio",
            "contact.title": "Contato",
            "about.map": "Mapa: {0}",
            "about.weather": "Previsão do tempo em {0}",
            "about.donate": "Doar",

            // hero
            "hero.listen": "▶ Ouvir agora",
            "hero.slide": "Slide {0}",

            // genéricos e acessibilidade
            "a11y.close": "Fechar",
            "a11y.theme": "Alternar tema claro/escuro",
            "a11y.menuOpen": "Abrir menu",
            "a11y.menuClose": "Fechar menu",
            "a11y.language": "Idioma",

            // app instalável (pwa.js)
            "pwa.install": "Instalar app",
            "pwa.installLong": "Instalar a rádio como aplicativo",
            "pwa.update": "Nova versão disponível",
            "pwa.updateAction": "Atualizar",
            "pwa.dismiss": "Dispensar",
            "pwa.iosTitle": "Instalar no iPhone/iPad",
            "pwa.installApp": "Instalar como aplicativo",
            "pwa.iosStep1": "1. Toque no botão Compartilhar (o quadrado com a seta para cima), na barra do Safari.",
            "pwa.iosStep2": "2. Escolha “Adicionar à Tela de Início”.",
            "pwa.iosStep3": "3. Confirme em “Adicionar”. Pronto: a rádio abre como um aplicativo, em tela cheia.",

            // player (js/radioplayer.js)
            "player.collapse": "Recolher o player",
            "player.expand": "Mostrar o player",
            "player.prevStation": "Estação anterior",
            "player.nextStation": "Próxima estação",
            "player.playPause": "Play/Pause",
            "player.more": "Mais controles",
            "player.volume": "Volume",
            "player.lyrics": "Letra da música",
            "player.history": "Músicas que já tocaram",
            "player.stations": "Trocar de estação",
            "player.share": "Compartilhar",
            "player.live": "Assistir ao vivo",
            "player.waiting": "Aguardando interação...",
            "player.noLyrics": "Letra não disponível",
            "player.loadingHistory": "Carregando histórico...",
            "player.artist": "Artista",
            "player.onAir": "Ao vivo",
            "player.lyricsShort": "Letra",
            "player.historyShort": "Histórico",
            "player.stationsShort": "Estações",
            "player.shareShort": "Compartilhar",
            "player.shareTitle": "Compartilhe nas redes sociais",
        },

        en: {
            "nav.news": "News",
            "nav.videos": "Videos",
            "nav.gallery": "Gallery",
            "nav.schedule": "Schedule",
            "nav.team": "Team",
            "nav.contact": "Contact",
            "nav.about": "About",

            "section.news": "Latest news",
            "section.videos": "Featured videos",
            "section.gallery": "Photo gallery",
            "section.schedule": "This week's schedule",
            "section.team": "Our team",
            "section.about": "About the station",
            "section.history": "Our story",

            "page.about.title": "About the station",
            "page.about.badge": "About us",
            "page.about.heading": "A station that never stops 🎶",
            "page.about.text": "You moved to another page and the music kept playing — the player is a component that intercepts internal navigation and swaps only the page content, keeping the audio alive.",

            "footer.about": "About the station",
            "footer.home": "Back to home",

            "news.more": "Read more →",

            "video.watch": "Watch: {0}",
            "video.close": "Close video",
            "video.clip": "Clip",
            "video.clipTitle": "Clip mode: shows the video of the song on air",

            "gallery.zoom": "Enlarge: {0}",
            "gallery.photo": "photo {0}",
            "gallery.prev": "Previous photo",
            "gallery.next": "Next photo",

            "day.seg": "Monday",
            "day.ter": "Tuesday",
            "day.qua": "Wednesday",
            "day.qui": "Thursday",
            "day.sex": "Friday",
            "day.sab": "Saturday",
            "day.dom": "Sunday",
            "day.short.seg": "Mon",
            "day.short.ter": "Tue",
            "day.short.qua": "Wed",
            "day.short.qui": "Thu",
            "day.short.sex": "Fri",
            "day.short.sab": "Sat",
            "day.short.dom": "Sun",
            "schedule.empty": "Non-stop music.",

            "team.prev": "Previous member",
            "team.next": "Next member",

            "listen.title": "How to listen",
            "listen.alexa": "Or just ask Alexa:",
            "listen.alexaPhrase": "Alexa, play {0}",
            "listen.station": "the station",
            "contact.title": "Contact",
            "about.map": "Map: {0}",
            "about.weather": "Weather in {0}",
            "about.donate": "Donate",

            "hero.listen": "▶ Listen now",
            "hero.slide": "Slide {0}",

            "a11y.close": "Close",
            "a11y.theme": "Switch between light and dark theme",
            "a11y.menuOpen": "Open menu",
            "a11y.menuClose": "Close menu",
            "a11y.language": "Language",

            "pwa.install": "Install app",
            "pwa.installLong": "Install the station as an app",
            "pwa.update": "New version available",
            "pwa.updateAction": "Update",
            "pwa.dismiss": "Dismiss",
            "pwa.iosTitle": "Install on iPhone/iPad",
            "pwa.installApp": "Install as an app",
            "pwa.iosStep1": "1. Tap the Share button (the square with an arrow pointing up) in the Safari bar.",
            "pwa.iosStep2": "2. Choose “Add to Home Screen”.",
            "pwa.iosStep3": "3. Confirm with “Add”. That's it: the station opens as an app, full screen.",

            "player.collapse": "Collapse the player",
            "player.expand": "Show the player",
            "player.prevStation": "Previous station",
            "player.nextStation": "Next station",
            "player.playPause": "Play/Pause",
            "player.more": "More controls",
            "player.volume": "Volume",
            "player.lyrics": "Song lyrics",
            "player.history": "Recently played",
            "player.stations": "Change station",
            "player.share": "Share",
            "player.live": "Watch live",
            "player.waiting": "Waiting for interaction...",
            "player.noLyrics": "Lyrics not available",
            "player.loadingHistory": "Loading history...",
            "player.artist": "Artist",
            "player.onAir": "On air",
            "player.lyricsShort": "Lyrics",
            "player.historyShort": "History",
            "player.stationsShort": "Stations",
            "player.shareShort": "Share",
            "player.shareTitle": "Share on social media",
        },

        es: {
            "nav.news": "Noticias",
            "nav.videos": "Vídeos",
            "nav.gallery": "Galería",
            "nav.schedule": "Programación",
            "nav.team": "Equipo",
            "nav.contact": "Contacto",
            "nav.about": "Nosotros",

            "section.news": "Últimas noticias",
            "section.videos": "Vídeos destacados",
            "section.gallery": "Galería de fotos",
            "section.schedule": "Programación de la semana",
            "section.team": "Nuestro equipo",
            "section.about": "Sobre la radio",
            "section.history": "Nuestra historia",

            "page.about.title": "Sobre la radio",
            "page.about.badge": "Sobre nosotros",
            "page.about.heading": "Una radio que no para 🎶",
            "page.about.text": "Navegaste a otra página y la música siguió sonando — el reproductor es un componente que intercepta la navegación interna y cambia solo el contenido de la página, manteniendo el audio vivo.",

            "footer.about": "Sobre la radio",
            "footer.home": "Volver al inicio",

            "news.more": "Leer más →",

            "video.watch": "Ver: {0}",
            "video.close": "Cerrar vídeo",
            "video.clip": "Clip",
            "video.clipTitle": "Modo clip: muestra el vídeo de la canción que suena",

            "gallery.zoom": "Ampliar: {0}",
            "gallery.photo": "foto {0}",
            "gallery.prev": "Foto anterior",
            "gallery.next": "Foto siguiente",

            "day.seg": "Lunes",
            "day.ter": "Martes",
            "day.qua": "Miércoles",
            "day.qui": "Jueves",
            "day.sex": "Viernes",
            "day.sab": "Sábado",
            "day.dom": "Domingo",
            "day.short.seg": "Lun",
            "day.short.ter": "Mar",
            "day.short.qua": "Mié",
            "day.short.qui": "Jue",
            "day.short.sex": "Vie",
            "day.short.sab": "Sáb",
            "day.short.dom": "Dom",
            "schedule.empty": "Música sin parar.",

            "team.prev": "Miembro anterior",
            "team.next": "Miembro siguiente",

            "listen.title": "¿Cómo escucharnos?",
            "listen.alexa": "O pídeselo a Alexa:",
            "listen.alexaPhrase": "Alexa, pon {0}",
            "listen.station": "la radio",
            "contact.title": "Contacto",
            "about.map": "Mapa: {0}",
            "about.weather": "El tiempo en {0}",
            "about.donate": "Donar",

            "hero.listen": "▶ Escuchar ahora",
            "hero.slide": "Diapositiva {0}",

            "a11y.close": "Cerrar",
            "a11y.theme": "Cambiar entre tema claro y oscuro",
            "a11y.menuOpen": "Abrir menú",
            "a11y.menuClose": "Cerrar menú",
            "a11y.language": "Idioma",

            "pwa.install": "Instalar app",
            "pwa.installLong": "Instalar la radio como aplicación",
            "pwa.update": "Nueva versión disponible",
            "pwa.updateAction": "Actualizar",
            "pwa.dismiss": "Descartar",
            "pwa.iosTitle": "Instalar en iPhone/iPad",
            "pwa.installApp": "Instalar como aplicación",
            "pwa.iosStep1": "1. Toca el botón Compartir (el cuadrado con la flecha hacia arriba) en la barra de Safari.",
            "pwa.iosStep2": "2. Elige “Añadir a pantalla de inicio”.",
            "pwa.iosStep3": "3. Confirma en “Añadir”. Listo: la radio se abre como una aplicación, a pantalla completa.",

            "player.collapse": "Ocultar el reproductor",
            "player.expand": "Mostrar el reproductor",
            "player.prevStation": "Emisora anterior",
            "player.nextStation": "Emisora siguiente",
            "player.playPause": "Reproducir/Pausar",
            "player.more": "Más controles",
            "player.volume": "Volumen",
            "player.lyrics": "Letra de la canción",
            "player.history": "Canciones ya sonadas",
            "player.stations": "Cambiar de emisora",
            "player.share": "Compartir",
            "player.live": "Ver en directo",
            "player.waiting": "Esperando interacción...",
            "player.noLyrics": "Letra no disponible",
            "player.loadingHistory": "Cargando historial...",
            "player.artist": "Artista",
            "player.onAir": "En vivo",
            "player.lyricsShort": "Letra",
            "player.historyShort": "Historial",
            "player.stationsShort": "Emisoras",
            "player.shareShort": "Compartir",
            "player.shareTitle": "Comparte en las redes sociales",
        },

        it: {
            "nav.news": "Notizie",
            "nav.videos": "Video",
            "nav.gallery": "Galleria",
            "nav.schedule": "Palinsesto",
            "nav.team": "Squadra",
            "nav.contact": "Contatti",
            "nav.about": "Chi siamo",

            "section.news": "Ultime notizie",
            "section.videos": "Video in evidenza",
            "section.gallery": "Galleria fotografica",
            "section.schedule": "Programmazione della settimana",
            "section.team": "La nostra squadra",
            "section.about": "Sulla radio",
            "section.history": "La nostra storia",

            "page.about.title": "Sulla radio",
            "page.about.badge": "Chi siamo",
            "page.about.heading": "Una radio che non si ferma 🎶",
            "page.about.text": "Sei passato a un'altra pagina e la musica ha continuato a suonare — il player è un componente che intercetta la navigazione interna e cambia solo il contenuto della pagina, tenendo vivo l'audio.",

            "footer.about": "Sulla radio",
            "footer.home": "Torna all'inizio",

            "news.more": "Leggi di più →",

            "video.watch": "Guarda: {0}",
            "video.close": "Chiudi video",
            "video.clip": "Clip",
            "video.clipTitle": "Modalità clip: mostra il video della canzone in onda",

            "gallery.zoom": "Ingrandisci: {0}",
            "gallery.photo": "foto {0}",
            "gallery.prev": "Foto precedente",
            "gallery.next": "Foto successiva",

            "day.seg": "Lunedì",
            "day.ter": "Martedì",
            "day.qua": "Mercoledì",
            "day.qui": "Giovedì",
            "day.sex": "Venerdì",
            "day.sab": "Sabato",
            "day.dom": "Domenica",
            "day.short.seg": "Lun",
            "day.short.ter": "Mar",
            "day.short.qua": "Mer",
            "day.short.qui": "Gio",
            "day.short.sex": "Ven",
            "day.short.sab": "Sab",
            "day.short.dom": "Dom",
            "schedule.empty": "Musica senza sosta.",

            "team.prev": "Membro precedente",
            "team.next": "Membro successivo",

            "listen.title": "Come ascoltarci?",
            "listen.alexa": "Oppure chiedi ad Alexa:",
            "listen.alexaPhrase": "Alexa, metti {0}",
            "listen.station": "la radio",
            "contact.title": "Contatti",
            "about.map": "Mappa: {0}",
            "about.weather": "Meteo a {0}",
            "about.donate": "Dona",

            "hero.listen": "▶ Ascolta ora",
            "hero.slide": "Diapositiva {0}",

            "a11y.close": "Chiudi",
            "a11y.theme": "Alterna tema chiaro/scuro",
            "a11y.menuOpen": "Apri il menu",
            "a11y.menuClose": "Chiudi il menu",
            "a11y.language": "Lingua",

            "pwa.install": "Installa l'app",
            "pwa.installLong": "Installa la radio come applicazione",
            "pwa.update": "Nuova versione disponibile",
            "pwa.updateAction": "Aggiorna",
            "pwa.dismiss": "Ignora",
            "pwa.iosTitle": "Installa su iPhone/iPad",
            "pwa.installApp": "Installa come applicazione",
            "pwa.iosStep1": "1. Tocca il pulsante Condividi (il quadrato con la freccia verso l'alto) nella barra di Safari.",
            "pwa.iosStep2": "2. Scegli “Aggiungi a Home”.",
            "pwa.iosStep3": "3. Conferma con “Aggiungi”. Fatto: la radio si apre come un'applicazione, a schermo intero.",

            "player.collapse": "Riduci il player",
            "player.expand": "Mostra il player",
            "player.prevStation": "Stazione precedente",
            "player.nextStation": "Stazione successiva",
            "player.playPause": "Riproduci/Pausa",
            "player.more": "Altri controlli",
            "player.volume": "Volume",
            "player.lyrics": "Testo della canzone",
            "player.history": "Brani già trasmessi",
            "player.stations": "Cambia stazione",
            "player.share": "Condividi",
            "player.live": "Guarda in diretta",
            "player.waiting": "In attesa di interazione...",
            "player.noLyrics": "Testo non disponibile",
            "player.loadingHistory": "Caricamento cronologia...",
            "player.artist": "Artista",
            "player.onAir": "In diretta",
            "player.lyricsShort": "Testo",
            "player.historyShort": "Cronologia",
            "player.stationsShort": "Stazioni",
            "player.shareShort": "Condividi",
            "player.shareTitle": "Condividi sui social",
        },
    };

    const codigos = LANGS.map((l) => l.code);
    const suportado = (code) => codigos.indexOf(String(code || "").slice(0, 2).toLowerCase()) >= 0;

    function guardado() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            // navegador com armazenamento bloqueado: segue sem memória
            return null;
        }
    }

    // A ordem importa: a escolha explícita de quem está lendo vale mais que o
    // idioma do aparelho, que por sua vez vale mais que o padrão da rádio.
    // navigator.languages vem em ordem de preferência — o primeiro que estiver
    // traduzido ganha, então quem tem "fr, it, en" recebe italiano.
    function resolver() {
        const salvo = guardado();
        if (suportado(salvo)) return salvo.slice(0, 2).toLowerCase();

        const doNavegador = navigator.languages && navigator.languages.length
            ? navigator.languages
            : [navigator.language];
        for (const preferido of doNavegador) {
            if (suportado(preferido)) return String(preferido).slice(0, 2).toLowerCase();
        }

        const padrao = ((window.siteContent || {}).theme || {}).language;
        if (suportado(padrao)) return String(padrao).slice(0, 2).toLowerCase();

        return FALLBACK;
    }

    let atual = resolver();

    const info = (code) => LANGS.find((l) => l.code === (code || atual)) || LANGS[0];

    // {0}, {1}... viram os argumentos. Existe porque frase montada com "+"
    // no meio do código não sobrevive à tradução: em inglês "Watch: X" e em
    // alemão o verbo iria para o fim — a ordem tem que caber na string.
    function t(chave) {
        const tabela = DICT[atual] || DICT[FALLBACK];
        let texto = tabela[chave];
        if (texto === undefined) texto = DICT[FALLBACK][chave];
        if (texto === undefined) return chave;

        const args = Array.prototype.slice.call(arguments, 1);
        return texto.replace(/\{(\d+)\}/g, (bruto, i) => (args[i] === undefined ? bruto : args[i]));
    }

    // Traduz o que já está no HTML. data-i18n troca o texto; as variantes
    // data-i18n-<atributo> trocam um atributo, que é como title, aria-label e
    // alt entram na tradução sem virar elemento.
    function apply(raiz) {
        const escopo = raiz || document;

        escopo.querySelectorAll("[data-i18n]").forEach((node) => {
            node.textContent = t(node.getAttribute("data-i18n"));
        });

        ["aria-label", "title", "alt", "placeholder"].forEach((attr) => {
            escopo.querySelectorAll(`[data-i18n-${attr}]`).forEach((node) => {
                node.setAttribute(attr, t(node.getAttribute(`data-i18n-${attr}`)));
            });
        });

        const doc = escopo.ownerDocument || escopo;
        if (doc.documentElement) doc.documentElement.lang = info().htmlLang;
    }

    // Trocar de idioma remonta a página inteira, e é de propósito: metade dos
    // textos é desenhada pelo site.js a partir do content.js, então mandar
    // renderizar de novo é mais honesto (e bem menos frágil) que sair
    // caçando nó por nó o que mudou. Quem remonta é a navegação seamless do
    // player, a mesma que troca de página sem parar o áudio — a música não
    // para por causa de uma troca de idioma. Sem o player na página, recarga
    // normal.
    function set(code) {
        if (!suportado(code)) return;
        const novo = String(code).slice(0, 2).toLowerCase();
        if (novo === atual) return;

        atual = novo;
        try {
            localStorage.setItem(STORAGE_KEY, novo);
        } catch (e) {
            // sem armazenamento: vale só para esta visita
        }
        document.documentElement.lang = info().htmlLang;

        if (window.RadioPlayer && typeof window.RadioPlayer.reload === "function") {
            window.RadioPlayer.reload();
        } else {
            location.reload();
        }
    }

    window.SiteI18n = {
        LANGS,
        t,
        apply,
        set,
        get: () => atual,
        locale: () => info().locale,
    };

    // O lang do <html> vale desde já: leitor de tela e o hífen automático do
    // navegador leem esse atributo antes de qualquer render nosso.
    document.documentElement.lang = info().htmlLang;
})();
