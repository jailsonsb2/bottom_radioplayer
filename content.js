/* ============================================================
   Conteúdo do SITE (notícias, vídeos, programação, equipe)
   ------------------------------------------------------------
   Edite este arquivo com o conteúdo da sua rádio — o site.js
   renderiza estas seções na página. Nada aqui afeta o player
   (que é configurado no config.js).
   ============================================================ */

window.siteContent = {
    // Marca do site (header) — com logo, a imagem substitui o texto
    brand: {
        name: "Minha Rádio",
        logo: "assets/jailson_logo.png",
    },

    // Cor de destaque do site (botões, links, chips, selos). O site deriva
    // sozinho o degradê, o brilho do fundo e a cor do texto sobre a cor —
    // basta trocar aqui (ou usar o seletor de cor do gerador.html).
    // accentLight é opcional: em branco, o tema claro escurece a cor
    // principal só o quanto precisar para o contraste.
    //
    // style é a LINGUAGEM VISUAL do site e do player (troque e recarregue):
    //   "glass"    vidro fosco — o padrão do projeto
    //   "clay"     massa opaca e fofa, cantos redondos, sem borda
    //   "minimal"  plano: fio de 1px, zero sombra, dock colado no rodapé
    //   "liquid"   vidro espesso, borda especular, dock em cápsula
    //   "spatial"  objetos flutuando: sombras amplas e profundidade
    //
    // scrollDuration é o TETO, em milissegundos, da viagem até a seção
    // quando alguém clica no menu (padrão 1100). Não é tempo fixo: o
    // percurso curto chega em meio segundo, só o fim da página gasta o
    // teto inteiro. Aumente para uma rolagem mais contemplativa, diminua
    // para uma mais direta. Quem pediu menos movimento no sistema vai
    // direto para a seção, seja qual for o valor.
    //
    // hoverZoom liga o CRESCER ao passar o mouse (padrão true): o cartão
    // que aumenta um tico, a foto da galeria e a miniatura de vídeo que
    // dão um zoom por baixo da moldura, o botão de ação que incha. Com
    // false só o crescer sai — o levantar de cada estilo, a troca de
    // borda e a sombra continuam, então o hover segue respondendo.
    //
    // language é o idioma de PARTIDA do site: "pt", "en", "es" ou "it".
    // Não é uma trava — quem chega vê o próprio idioma se o navegador
    // dele for um dos quatro, e a escolha no seletor do topo manda em
    // tudo. Este campo é o desempate para o visitante cujo idioma o
    // site não fala. Só a moldura (menus, títulos de seção, dias da
    // semana, botões) muda de língua; as notícias, os programas e os
    // nomes daqui de baixo saem como você escreveu.
    theme: {
        accent: "#38b6ff",
        accentLight: "#80daff",
        style: "spatial",
        scrollDuration: 1300,
        hoverZoom: true,
        language: "pt",
    },

    // Ordem das seções na home (e dos links do menu). O topo (slides) fica
    // sempre em primeiro e o rodapé em último; estas seis é que você escolhe
    // como empilhar — coloque na frente o que a sua rádio tem de mais forte.
    // Nomes válidos: noticias, videos, galeria, programacao, equipe, contato.
    // Remova a lista inteira (ou um nome dela) para manter a ordem padrão;
    // seções sem conteúdo somem sozinhas, então não precisa tirar daqui.
    order: ["noticias", "videos", "galeria", "programacao", "equipe", "contato"],

    // Slides do topo da página — o primeiro botão pode dar play na rádio
    // (action: "play") ou abrir um link (url). image é opcional (fundo suave
    // à direita no desktop).
    slides: [
        {
            badge: "No ar 24 horas",
            title: "A trilha sonora do seu dia",
            subtitle: "Música sem parar, notícias e os melhores programas — aqui a rádio não para, nem quando você navega.",
            image: "https://picsum.photos/seed/hero-radio/900/600",
            button: { label: "▶ Ouvir agora", action: "play" },
        },
        {
            badge: "Aplicativo",
            title: "Leve a rádio no bolso",
            subtitle: "Baixe o app oficial para Android e ouça em qualquer lugar, com qualidade superior e sem travar.",
            image: "https://picsum.photos/seed/hero-app/900/600",
            button: { label: "Baixar o app", url: "https://play.google.com/store/apps/details?id=com.jbcast.jwradio" },
        },
        {
            badge: "Promoção",
            title: "Concorra a ingressos toda sexta",
            subtitle: "Participe pelo WhatsApp durante o programa da tarde e concorra a pares de ingressos para os shows da cidade.",
            image: "https://picsum.photos/seed/hero-promo/900/600",
            button: { label: "Saiba mais", url: "#noticias" },
        },
    ],

    // Sobre a rádio — história e contato, renderizados na home (seção
    // "Sobre a rádio") e na página Sobre. Parágrafos separados por linha
    // em branco (\n\n). Deixe "" para ocultar um item do contato.
    about: {
        history: "No ar desde 2024, a Minha Rádio nasceu para levar música sem parar para todo lugar. Hoje somos multi-estação, com programação ao vivo, aplicativo próprio e uma comunidade de ouvintes que cresce a cada dia.\n\nEste site é a demonstração do componente bottom_radioplayer — o player fixo no rodapé funciona em qualquer página com apenas duas linhas de código, e o áudio não para quando o visitante navega.",
        contact: {
            address: "Av. Principal, 123 — Centro, Minha Cidade",
            phone: "+55 (00) 0000-0000",
            whatsapp: "https://wa.me/5500000000000",
            email: "contato@minharadio.com",
        },
        // Cidade usada no card de clima e no mapa do rodapé de contato.
        // Deixe "" para ocultar os dois cards.
        city: "São Paulo",
        // Link de doação (PayPal, Pix, Ko-fi, etc.) — deixe "" para ocultar o botão.
        // O botão flutuante do Ko-fi (fim do <body> em index.html/pagina2.html)
        // já cobre esse mesmo link; os dois convivem sem conflito.
        donation: {
            url: "https://ko-fi.com/C1C1ZZ2EP",
            label: "Apoiar",
        },
    },

    // Links dos apps oficiais — deixe "" para ocultar o respectivo botão.
    // Se vazios aqui, o site usa os links já cadastrados em config.js
    // (window.streams.stations[0].apps). O alexa é o link da skill na
    // Amazon (opcional: sem link, a frase da Alexa ainda aparece).
    apps: {
        android: "https://play.google.com/store/apps/details?id=com.jbcast.jwradio",
        ios: "",
        alexa: "",
    },

    // "Como nos ouvir" — card na seção Sobre com os apps e a frase da Alexa.
    // Deixe listen: null (ou os campos vazios) para ocultar o card.
    listen: {
        title: "Como nos ouvir?",
        text: "Ouça agora mesmo aqui no site, pelo player do rodapé. Para levar a rádio com você, baixe o aplicativo gratuito no celular:",
        alexaPhrase: "Alexa, tocar Minha Rádio",
    },

    // Redes sociais do site (aparecem no rodapé) — deixe "" para ocultar
    social: {
        whatsapp: "https://wa.me/5500000000000",
        instagram: "https://www.instagram.com/",
        facebook: "",
        twitter: "https://twitter.com/",
        youtube: "",
        tiktok: "",
    },

    // Notícias / anúncios — title, image, date, excerpt e:
    //  - content: texto completo (abre num modal na própria página), e/ou
    //  - url: link externo (usado quando não houver content)
    news: [
        {
            title: "Novo aplicativo disponível para Android",
            image: "https://picsum.photos/seed/radio-news1/640/360",
            date: "2026-07-10",
            excerpt: "Baixe agora o app oficial e leve a rádio com você para qualquer lugar, com qualidade de som superior.",
            content: "O aplicativo oficial da rádio chegou à Play Store! Agora você pode ouvir a programação completa direto do celular, com qualidade de som superior e reconexão automática quando a rede oscilar.\n\nO app traz a capa da música tocando, o histórico das últimas músicas e acesso rápido às nossas redes sociais. Tudo isso de graça.\n\nBaixe agora na Play Store, procure por 'Minha Rádio' — e não esqueça de deixar sua avaliação, ela nos ajuda muito!",
        },
        {
            title: "Festival de verão: cobertura ao vivo",
            image: "https://picsum.photos/seed/radio-news2/640/360",
            date: "2026-07-08",
            excerpt: "Nossa equipe estará transmitindo direto do palco principal. Acompanhe entrevistas exclusivas com os artistas.",
            content: "No próximo fim de semana a nossa equipe estará no Festival de Verão com uma estrutura completa de transmissão ao vivo, direto do palco principal.\n\nAlém dos shows, você acompanha entrevistas exclusivas com os artistas no nosso estúdio móvel, bastidores e sorteios de brindes durante toda a cobertura.\n\nA transmissão começa no sábado às 16h, aqui na rádio e no nosso aplicativo. Não perca!",
        },
        {
            title: "Promoção: concorra a ingressos toda sexta",
            image: "https://picsum.photos/seed/radio-news3/640/360",
            date: "2026-07-05",
            excerpt: "Participe pelo WhatsApp durante o programa da tarde e concorra a pares de ingressos para os shows da cidade.",
            content: "Toda sexta-feira, durante o programa da tarde, sorteamos pares de ingressos para os principais shows e eventos da cidade.\n\nPara participar é simples: mande uma mensagem no nosso WhatsApp com a palavra INGRESSO e o seu nome completo durante o programa. O sorteio acontece ao vivo, às 17h.\n\nConsulte o regulamento completo no nosso estúdio. Boa sorte!",
        },
    ],

    // Vídeos do YouTube — id (o código do vídeo na URL) e title
    videos: [
        { id: "kXYiU_JCYtU", title: "Clipe em destaque" },
        { id: "hTWKbfoikeg", title: "Ao vivo no estúdio" },
        { id: "YQHsXMglC9A", title: "Entrevista exclusiva" },
    ],

    // Galeria de fotos (estúdio, eventos, equipe...) — image é a foto em
    // tamanho grande (abre no lightbox), thumb é opcional (versão leve para
    // a miniatura) e caption é a legenda. Deixe a lista vazia para ocultar
    // a seção.
    gallery: [
        { image: "https://picsum.photos/seed/radio-gal1/1200/800", caption: "Estúdio principal" },
        { image: "https://picsum.photos/seed/radio-gal2/1200/800", caption: "Mesa de transmissão" },
        { image: "https://picsum.photos/seed/radio-gal3/1200/800", caption: "Bastidores do programa da manhã" },
        { image: "https://picsum.photos/seed/radio-gal4/1200/800", caption: "Cobertura do festival" },
        { image: "https://picsum.photos/seed/radio-gal5/1200/800", caption: "Visita dos ouvintes" },
        { image: "https://picsum.photos/seed/radio-gal6/1200/800", caption: "Equipe no ar" },
    ],

    // Programação semanal — chaves: dom, seg, ter, qua, qui, sex, sab
    schedule: {
        seg: [
            { time: "06:00", name: "Manhã ao Vivo", host: "Equipe da manhã" },
            { time: "12:00", name: "Almoço Musical", host: "Sequência automática" },
            { time: "18:00", name: "Fim de Tarde", host: "Locutor da casa" },
            { time: "22:00", name: "Madrugada Sem Parar", host: "As melhores da noite" },
        ],
        ter: [
            { time: "06:00", name: "Manhã ao Vivo", host: "Equipe da manhã" },
            { time: "14:00", name: "Tarde Top", host: "Os mais pedidos" },
            { time: "20:00", name: "Clássicos da Noite", host: "Só relíquias" },
        ],
        qua: [
            { time: "06:00", name: "Manhã ao Vivo", host: "Equipe da manhã" },
            { time: "12:00", name: "Almoço Musical", host: "Sequência automática" },
            { time: "19:00", name: "Quarta do Louvor", host: "Participação ao vivo" },
        ],
        qui: [
            { time: "06:00", name: "Manhã ao Vivo", host: "Equipe da manhã" },
            { time: "16:00", name: "Pedidos dos Ouvintes", host: "Você escolhe a playlist" },
        ],
        sex: [
            { time: "06:00", name: "Manhã ao Vivo", host: "Equipe da manhã" },
            { time: "18:00", name: "Esquenta de Sexta", host: "Hits para o fim de semana" },
            { time: "22:00", name: "Balada Mix", host: "DJ convidado" },
        ],
        sab: [
            { time: "09:00", name: "Sábado Animado", host: "O melhor do fim de semana" },
            { time: "20:00", name: "Noite de Sábado", host: "Especial dançante" },
        ],
        dom: [
            { time: "08:00", name: "Domingo em Família", host: "Músicas para o descanso" },
            { time: "18:00", name: "Top 20 da Semana", host: "As mais tocadas" },
        ],
    },

    // Equipe / locutores — name, role, photo
    team: [
        { name: "Jailson Bezerra", role: "Locutor · Manhã ao Vivo", photo: "assets/jailson.png" },
        { name: "Ana Souza", role: "Locutora · Tarde Top", photo: "https://picsum.photos/seed/team-ana/400/400" },
        { name: "Carlos Lima", role: "DJ · Balada Mix", photo: "https://picsum.photos/seed/team-carlos/400/400" },
        { name: "Equipe de Jornalismo", role: "Notícias de hora em hora", photo: "https://picsum.photos/seed/team-news/400/400" },
    ],

    footer: {
        text: "Minha Rádio — Todos os direitos reservados",
    },
};
