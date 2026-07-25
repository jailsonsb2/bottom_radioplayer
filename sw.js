/* ============================================================
   Service worker do site (PWA).
   ------------------------------------------------------------
   Regras de ouro deste arquivo:

   1. Só mexe em requisições GET da PRÓPRIA origem. O stream de
      áudio, as APIs de now playing/letras, o YouTube, o mapa e o
      clima são de outra origem — passam direto pela rede, sem
      cache (cachear stream de rádio não faz sentido e quebraria
      o áudio ao vivo).
   2. Código e conteúdo (páginas, css, js, json) usam REDE
      PRIMEIRO: online, o visitante sempre vê a versão publicada
      agora; o cache entra só quando a rede falha (offline). Sem
      isso, editar o custom.css e não ver nada mudar na primeira
      visita é a regra — e não a exceção.
   3. Imagens, ícones e fontes (que trocam de nome quando mudam)
      respondem do cache e revalidam em segundo plano
      (stale-while-revalidate) — é daí que vem a rapidez.

   Ao publicar uma versão nova do site, troque o VERSION abaixo:
   isso limpa o cache antigo e faz o aviso de "nova versão"
   aparecer para quem já tem o site instalado.
   ============================================================ */

const VERSION = "v3";
const CACHE = "radiosite-" + VERSION;

// Casca do site: o mínimo para a página abrir offline
const SHELL = [
    "./",
    "./index.html",
    "./pagina2.html",
    "./site.css",
    "./site.js",
    "./content.js",
    "./config.js",
    "./js/radioplayer.js",
    "./css/main.css",
    "./custom.css",
    "./css/ui-styles.css",
    "./manifest.json",
    "./assets/pwa/icon-192.png",
    "./assets/pwa/icon-512.png",
    "./assets/app/android.svg",
    "./assets/app/ios.svg",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE).then((cache) =>
            // addAll falha inteiro se UM arquivo faltar (ex.: site sem
            // pagina2.html) — daí cada item ir individualmente
            Promise.all(SHELL.map((url) => cache.add(url).catch(() => null)))
        )
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

// A página pede a troca imediata quando o visitante clica em "Atualizar"
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

// Tudo que é editável (páginas, estilos, scripts, json) vai pela rede
// primeiro; imagens e fontes ficam no cache rápido
const CACHE_FIRST = /\.(png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|mp3|ogg)$/i;

function isNetworkFirst(request, url) {
    return request.mode === "navigate" || !CACHE_FIRST.test(url.pathname);
}

self.addEventListener("fetch", (event) => {
    const request = event.request;
    if (request.method !== "GET") return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return; // stream, APIs, YouTube...

    if (isNetworkFirst(request, url)) {
        // rede primeiro (inclui o fetch da navegação seamless do player);
        // só cai no cache se a rede falhar de verdade (offline / servidor fora)
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE).then((cache) => cache.put(request, copy));
                    return response;
                })
                .catch(() => caches.match(request).then((cached) => cached || caches.match("./index.html")))
        );
        return;
    }

    // estáticos: cache primeiro, revalidando em segundo plano
    event.respondWith(
        caches.match(request).then((cached) => {
            const network = fetch(request)
                .then((response) => {
                    if (response && response.ok) {
                        const copy = response.clone();
                        caches.open(CACHE).then((cache) => cache.put(request, copy));
                    }
                    return response;
                })
                .catch(() => cached);
            return cached || network;
        })
    );
});
