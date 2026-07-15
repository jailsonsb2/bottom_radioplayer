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
