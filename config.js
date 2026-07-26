window.streams = {
    timeRefresh: 10000,
    // Letras da música tocando: use false para ocultar o botão "Lyrics"
    // e desativar a busca de letras (lyrics.ovh / LRCLIB)
    lyrics: true,
    // Bargraph atrás do player (as barras que dançam com o áudio).
    // false não só esconde: nem chega a abrir o AudioContext.
    visualizer: true,
    // Barra de progresso da faixa. Três valores:
    //   "wave"   → onda balançando na crista do preenchimento
    //   "simple" → só o traço, sem animação
    //   false    → desligada
    // Com o bargraph ligado, "simple" combina melhor: a onda e as barras
    // disputam a mesma faixa na base do dock e o rodapé fica poluído.
    // Só aparece quando a API entrega o tempo da música (elapsed/duration);
    // em stream ao vivo puro ela fica invisível de qualquer jeito.
    progress: "simple",
    stations: [
        {
            name: "Jailson Webradio",
            hash: "jailson",
            description: "Música sem parar",
            logo: "assets/jailson_logo.png",
            album: "assets/jailson_cover.png",
            cover: "assets/jailson_cover.png",
            api: "",
            //api: "api.php?url=https://stream.zeno.fm/yn65fsaurfhvv",
            stream_url: "https://stream.zeno.fm/yn65fsaurfhvv",
            tv_url: "https://eu1.servers10.com:2020/VideoPlayer/8106?autoplay=1",
            server: "",
            social: {
                whatsapp: "",
                twitter: "https://twitter.com/",
                tiktok: "",
                youtube: "",
                instagram: "https://www.instagram.com/",
            },
            apps: {
                android: "https://play.google.com/store/apps/details?id=com.jbcast.jwradio",
                ios: "",
            },
        },
        {
            name: "BENDICIÓN STEREO",
            hash: "bendicion",
            description: "Bendecidos para bendecir!",
            logo: "assets/bendicion_logo.png",
            album: "assets/bendicion_cover.png",
            cover: "assets/bendicion_cover.png",
            api: "",
            stream_url: "https://sv2.globalhostlive.com/proxy/bendistereo/stream2",
            tv_url: "https://eu1.servers10.com:2020/VideoPlayer/8106?autoplay=1",
            server: "",
            social: {
                facebook: "https://facebook.com/BendicionStereo",
                twitter: "https://twitter.com/BendiStereo",
                instagram: "https://www.instagram.com/BendiStereo/",
            },
            apps: {
                android: "#",
                ios: "#",
            },
        },
        {
            name: "Rádio Capital Fm",
            hash: "Capital Fm",
            description: "A sua Rádio Pop/Rock!",
            logo: "assets/capital_logo.png",
            album: "assets/capitallogo_preto.png",
            cover: "assets/capitallogo_preto.png",
            api: "",
            stream_url: "https://stm16.xcast.com.br:7208/stream",
            //tv_url: "https://eu1.servers10.com:2020/VideoPlayer/8106?autoplay=1",
            server: "spotify",
            social: {
                facebook: "https://www.facebook.com/CapitalFmRadio/",
                whatsapp: "https://api.whatsapp.com/send/?phone=5522999080266&text=Ol%C3%A1+tudo+bem%3F&type=phone_number&app_absent=0",
                //twitter: "https://twitter.com/",
                //tiktok: "",
                //youtube: "",
                instagram: "https://www.instagram.com/capitalfmradio",
            },
            apps: {
                android: "https://player.xcast.com.br/player-app-multi-plataforma/7208",
                ios: "https://player.xcast.com.br/player-app-multi-plataforma/7208",
            },
        },
    ],
};
