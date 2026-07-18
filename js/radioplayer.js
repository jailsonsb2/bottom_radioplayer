/* ============================================================
   RadioPlayer — componente embutível de barra inferior
   ------------------------------------------------------------
   Uso: inclua config.js (window.streams) e este arquivo em
   QUALQUER página do site:

     <script src="config.js"></script>
     <script src="js/radioplayer.js"></script>

   O componente injeta sozinho o HTML, o CSS e as fontes de que
   precisa. Com `seamless` ativo (padrão), a navegação entre
   páginas do MESMO site é interceptada e o conteúdo é trocado
   sem recarregar a página — o áudio nunca é interrompido.
   Links com target, download ou data-no-seamless são ignorados.
   ============================================================ */

(function () {
  "use strict";

  // Guarda de montagem: se o script for incluído duas vezes (ou re-executado
  // numa troca de página), não monta um segundo player
  if (window.__RadioPlayerMounted) return;
  window.__RadioPlayerMounted = true;

  // --- [BASE DOS ASSETS] ----------------------------------------------
  // Resolve css/assets em relação à URL DESTE script (js/radioplayer.js),
  // para o player funcionar embutido em páginas de qualquer profundidade.
  const SCRIPT_SRC = (document.currentScript && document.currentScript.src) || "js/radioplayer.js";
  const BASE = SCRIPT_SRC.replace(/js\/[^/]*(\?.*)?$/, "");

  const CONFIG = window.streams || {};
  const SEAMLESS = CONFIG.seamless !== false;
  const LYRICS_ENABLED = CONFIG.lyrics !== false;

  // --- [CONFIGURAÇÕES] -----------------------------------------------

  // Endpoint de consulta única (cache compartilhado de 5s no Redis,
  // responde em milissegundos e já entrega albumArt pronto)
  const API_URL = "https://api.twj.es/?url=";
  const TIME_TO_REFRESH = CONFIG.timeRefresh || 10000;

  // --- [TEMPLATE DO PLAYER] -------------------------------------------

  const TEMPLATE = `
    <div class="np__global_wrapper">
        <div id="jp_container_rcast" class="np__global_player">
            <div class="app-player" id="app-player">
                <div class="player song-now flex column">
                    <div class="player-wrapper">
                        <div class="player-cover flex items-center justify-center g-2 items-center">
                            <div class="player-left flex items-center">
                                <div class="player-artwork player-artwork-style relative">
                                    <img alt="artwork" height="600" src="{{BASE}}assets/cover.png" width="600" />
                                </div>
                                <div class="player-cover-title uppercase fw-700 flex column">
                                    <div class="player-song-name">
                                        <span class="color-title fw-700 song-name song-title station-name">Song</span>
                                    </div>
                                    <span class="color-title fs-8 song-artist station-description truncate">Artist</span>
                                </div>
                            </div>
                            <div class="player-controller">
                                <button class="player-button player-button-backward-step">
                                    <svg class="i i-backward-step" viewBox="0 0 24 24">
                                        <path d="M6 5v14M18 4v16L8 12Z"></path>
                                    </svg>
                                </button>
                                <button aria-label="Play/Pause" class="player-button player-button-play flex-none">
                                    <svg class="i i-play" viewBox="0 0 24 24">
                                        <path d="m7 3 14 9-14 9z"></path>
                                    </svg>
                                </button>
                                <button class="player-button player-button-forward-step">
                                    <svg class="i i-forward-step" viewBox="0 0 24 24">
                                        <path d="M18 5v14M6 4v16l10-8Z"></path>
                                    </svg>
                                </button>
                                <button class="player-button player-button-more" data-outside="player-more" aria-label="Mais controles">
                                    <svg class="i i-dots" viewBox="0 0 24 24">
                                        <circle cx="5" cy="12" r="1"></circle>
                                        <circle cx="12" cy="12" r="1"></circle>
                                        <circle cx="19" cy="12" r="1"></circle>
                                    </svg>
                                </button>
                            </div>

                            <div class="player-right flex items-center" id="player-more">
                                <div class="online-tv"></div>
                                <button class="player-button player-button-history" data-outside="offcanvas-history">
                                    <svg class="i i-music" viewBox="0 0 24 24">
                                        <path d="M22 16V2L9 5v13"></path>
                                        <circle cx="5" cy="18" r="4"></circle>
                                        <circle cx="18" cy="16" r="4"></circle>
                                    </svg>
                                    History
                                </button>
                                <div class="player-button player-button-volume">
                                    <button class="player-button player-button-volume-toggle" data-outside="player-volume">
                                        <svg class="i i-volume-high" viewBox="0 0 24 24">
                                            <path d="M6 9H2v6h4l5 4V5Zm9 7a5 5 0 0 0 0-8m3 12a10 10 0 0 0 0-16"></path>
                                        </svg>
                                        Volume
                                    </button>
                                    <div class="dropdown" id="player-volume">
                                        <div class="player-range-wrapper">
                                            <input aria-label="Volume" class="player-volume" max="100" min="0" name="player" type="range" value="100" />
                                            <div class="player-range-fill"></div>
                                            <div class="player-range-thumb"></div>
                                        </div>
                                    </div>
                                </div>
                                <button class="player-button player-button-share" data-outside="modal-share">
                                    <svg class="i i-share" viewBox="0 0 24 24">
                                        <circle cx="18" cy="5" r="3"></circle>
                                        <circle cx="6" cy="12" r="3"></circle>
                                        <circle cx="18" cy="19" r="3"></circle>
                                        <path d="m8.5 13.5 7 4m0-11-7 4"></path>
                                    </svg>
                                    Share
                                </button>
                                <button class="player-button player-button-lyrics" data-outside="modal-lyrics">
                                    <svg class="i i-list-music" viewBox="0 0 24 24">
                                        <path d="M16 8h6V3h-6v15M2 3h9M2 8h9m-9 5h3"></path>
                                        <circle cx="12" cy="18" r="4"></circle>
                                    </svg>
                                    Lyrics
                                </button>
                                <button class="player-button-alt player-button-stations" data-outside="offcanvas-stations">
                                    <svg class="i i-radio" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="2"></circle>
                                        <path d="M5 4.9a10 10 0 0 0 0 14.2M7.8 7.7a6 6 0 0 0 0 8.6m8.4 0a6 6 0 0 0 0-8.6M19 19.1a10 10 0 0 0 0-14.2"></path>
                                    </svg>
                                    Estações
                                </button>

                                <div class="player-station player-artwork-style relative">
                                    <img alt="artwork" height="600" src="{{BASE}}assets/cover.png" width="600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="visualizer" data-bars="120" data-max-height="100"></div>
                </div>

                <aside class="offcanvas-player scrollbar" id="offcanvas-stations">
                    <div class="offcanvas-content">
                        <div class="stations flex g-1" id="stations"></div>
                    </div>
                </aside>

                <aside class="offcanvas-player scrollbar" id="offcanvas-history">
                    <div class="offcanvas-content">
                        <div class="history flex g-0.5 fs-7" id="history"></div>
                    </div>
                </aside>

                <div class="modal" id="modal-lyrics">
                    <div class="modal-content">
                        <div class="modal-title color-title flex items-center justify-between">
                            <h2 class="modal-title-text m:fs-3 fs-5 fw-500">Letra</h2>
                            <button data-close aria-label="close">
                                <svg class="i i-xmark" viewBox="0 0 24 24">
                                    <path d="M18 6 6 18M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div class="modal-body scrollbar" id="lyrics"></div>
                    </div>
                </div>

                <div class="modal-overlay"></div>

                <div class="player-modal" id="modal-share">
                  <button data-close="" class="player-modal-x">
                    <svg class="i i-xmark" viewBox="0 0 24 24">
                      <path d="M18 6 6 18M6 6l12 12"></path>
                    </svg>
                  </button>
                  <h2>Compartilhe nas redes sociais</h2>
                  <img src="{{BASE}}assets/cover.png" alt="portada modal" class="player-modal-image" height="200px" width="200px" />
                  <div class="player-title song-name fw-500">Song</div>
                  <span class="player-text song-artist">Artist</span>
                  <div class="modal-social player-social socials">
                    <a class="player-social-item social-facebook" target="_blank" data-network="facebook" data-radio-name="" data-radio-logo="" data-radio-url="">
                      <svg class="i i-facebook" viewBox="0 0 24 24"><path d="M17 14h-3v8h-4v-8H7v-4h3V7a5 5 0 0 1 5-5h3v4h-3q-1 0-1 1v3h4Z"></path></svg>
                    </a>
                    <a class="player-social-item social-twitter" target="_blank" data-network="twitter" data-radio-name="" data-radio-logo="" data-radio-url="">
                      <svg class="i i-x" viewBox="0 0 24 24"><path d="m3 21 7.5-7.5m3-3L21 3M8 3H3l13 18h5Z"></path></svg>
                    </a>
                    <a class="player-social-item social-whatsapp" target="_blank" data-network="whatsapp" data-radio-name="" data-radio-logo="" data-radio-url="">
                      <svg class="i i-whatsapp" viewBox="0 0 24 24">
                        <circle cx="9" cy="9" r="1"></circle>
                        <circle cx="15" cy="15" r="1"></circle>
                        <path d="M8 9a7 7 0 0 0 7 7m-9 5.2A11 11 0 1 0 2.8 18L2 22Z"></path>
                      </svg>
                    </a>
                  </div>
                </div>

                <div class="modal-video" id="modal-tv">
                    <button data-close aria-label="close" class="btn">
                        <svg class="i i-xmark" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"></path></svg>
                    </button>
                    <div class="modal-body-video"></div>
                </div>

                <div class="modal-overlay"></div>
            </div>
        </div>
    </div>`;

  // --- [INJEÇÃO DE ASSETS E MONTAGEM] ----------------------------------

  let root; // elemento raiz do player (.msp_radio) — sobrevive às trocas de página

  function injectStylesheet(href) {
      const abs = new URL(href, BASE || location.href).href;
      const exists = [...document.querySelectorAll('link[rel="stylesheet"]')].some((l) => l.href === abs);
      if (exists) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = abs;
      document.head.appendChild(link);
  }

  function injectAssets() {
      injectStylesheet("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;700&display=swap");
      injectStylesheet("https://fonts.cdnfonts.com/css/akira-expanded");
      injectStylesheet(BASE + "css/main.css");
      injectStylesheet(BASE + "custom.css");

      // meta theme-color (o accent dinâmico escreve nela; cria se a página não tiver)
      if (!document.querySelector("meta[name=theme-color]")) {
          const meta = document.createElement("meta");
          meta.name = "theme-color";
          meta.content = "dark light";
          document.head.appendChild(meta);
      }
  }

  function loadColorThief() {
      return new Promise((resolve) => {
          if (typeof window.ColorThief !== "undefined") return resolve();
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js";
          s.onload = () => resolve();
          s.onerror = () => resolve(); // sem accent dinâmico, mas o player funciona
          document.head.appendChild(s);
      });
  }

  function mountDom() {
      root = document.createElement("div");
      root.className = "msp_radio";
      root.id = "radioplayer-root";
      root.innerHTML = TEMPLATE.replace(/{{BASE}}/g, BASE);
      // Com lyrics desativado na config, remove o botão e o modal de letras
      if (!LYRICS_ENABLED) {
          const lyricsButton = root.querySelector(".player-button-lyrics");
          const lyricsModal = root.querySelector("#modal-lyrics");
          if (lyricsButton) lyricsButton.remove();
          if (lyricsModal) lyricsModal.remove();
      }
      document.body.appendChild(root);
  }

  // --- [LÓGICA DO PLAYER] ----------------------------------------------

  function startPlayer() {
      const ACTIVE_CLASS = "is-active";
      const cache = {};

      // Elementos do DOM — sempre buscados dentro do root injetado
      const $ = (sel) => root.querySelector(sel);
      const playButton = $(".player-button-play");
      const visualizerContainer = $(".visualizer");
      const songNow = $(".song-now");
      const stationsList = $("#stations");
      const stationName = $(".station-name");
      const stationDescription = $(".station-description");
      const playerArtwork = $(".player-artwork img:first-child");
      const playerCoverImg = $(".player-cover-image");
      // As redes sociais saíram do dock (agora vivem no site — footer);
      // o seletor restrito evita casar com .modal-social do compartilhar
      const playerSocial = $(".player-left .player-social");
      const historyElement = $("#history");
      const lyricsContent = $("#lyrics");
      const playerTv = $(".online-tv");
      const playerTvModal = $("#modal-tv");
      const pixel = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P//PxcACQYDCF0ysWYAAAAASUVORK5CYII=";
      const historyTemplate = `<div class="history-item flex items-center g-1">
                              <div class="history-image flex-none">
                                  <img src="{{art}}" width="80" height="80">
                              </div>
                              <div class="history-meta flex column">
                                  <span class="color-title fw-500 truncate-line">{{song}}</span>
                                  <span class="color-text">{{artist}}</span>
                              </div>
                              <a href="{{stream_url}}" class="history-spotify" target="_blank" rel="noopener">
                                  <svg class="i i-spotify" viewBox="0 0 24 24">
                                      <circle cx="12" cy="12" r="11"></circle>
                                      <path d="M6 8q7-2 12 1M7 12q5.5-1.5 10 1m-9 3q4.5-1.5 8 1"></path>
                                  </svg>
                              </a>
                              </div>`;

      // Variáveis de controle
      let currentStation;
      let activeButton;
      let currentSongPlaying;
      let lastAlbumArt = "";
      let lastYoutubeId = "";
      let lastLyricsKey = "";
      let timeoutId;

      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      let hasVisualizer = false;

      // --- [FUNÇÕES AUXILIARES] ---------------------------------------

      function createElementFromHTML(htmlString) {
          const div = document.createElement("div");
          div.innerHTML = htmlString.trim();
          return div.firstChild;
      }

      function sanitizeText(text) {
          return text.replace(/^\d+\.\)\s/, "").replace(/<br>$/, "");
      }

      function changeImageSize(url, size) {
          return url.replace(/100x100/, size);
      }

      function createTempImage(src) {
          return new Promise((resolve, reject) => {
              const img = document.createElement("img");
              img.crossOrigin = "Anonymous";
              img.src = `https://images.weserv.nl/?url=${src}`;
              img.onload = () => resolve(img);
              img.onerror = reject;
          });
      }

      // --- [REPRODUÇÃO DE ÁUDIO] --------------------------------------

      // Reconexão automática (rede instável). Começa true: antes da primeira
      // reprodução real não há o que reconectar.
      let isIntentionalPause = true;
      let reconnectAttempts = 0;
      let reconnectTimeout = null;
      let fadeInterval = null;

      function fadeOut(callback) {
          if (fadeInterval) clearInterval(fadeInterval);
          let currentVol = audio.volume;
          const step = currentVol / 15;

          fadeInterval = setInterval(() => {
              currentVol -= step;
              if (currentVol <= 0.05) {
                  audio.volume = 0;
                  clearInterval(fadeInterval);
                  fadeInterval = null;
                  if (callback) callback();
              } else {
                  audio.volume = currentVol;
              }
          }, 30);
      }

      function fadeIn() {
          if (fadeInterval) clearInterval(fadeInterval);
          const targetVol = parseInt(localStorage.getItem("volume") || "100", 10) / 100;
          audio.volume = 0;
          const step = targetVol / 15;

          fadeInterval = setInterval(() => {
              const newVol = audio.volume + step;
              if (newVol >= targetVol) {
                  audio.volume = targetVol;
                  clearInterval(fadeInterval);
                  fadeInterval = null;
              } else {
                  audio.volume = newVol;
              }
          }, 30);
      }

      // A rádio e um vídeo do YouTube nunca tocam juntos: dar play na rádio
      // pausa qualquer embed em reprodução (vídeos do site, modo clipe);
      // o caminho inverso é tratado pelo watcher de mensagens do site
      function pauseYouTubeEmbeds() {
          document.querySelectorAll('iframe[src*="youtube"]').forEach((frame) => {
              try {
                  frame.contentWindow.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: [] }), "*");
              } catch (e) {}
          });
      }

      function handlePlayPause() {
          if (audio.paused) {
              pauseYouTubeEmbeds();
              isIntentionalPause = false;
              localStorage.setItem("radioplayer:playing", "1");
              fadeIn();
              play(audio);
          } else {
              isIntentionalPause = true;
              localStorage.setItem("radioplayer:playing", "0");
              if (reconnectTimeout) clearTimeout(reconnectTimeout);
              fadeOut(() => pause(audio));
          }
      }

      function play(audio, newSource = null) {
          if (newSource) {
              audio.src = newSource; // atribuir src já dispara o load
          } else if (audio.paused) {
              // Stream AO VIVO: sem o load() o navegador retoma do buffer,
              // do ponto em que foi pausado — o ouvinte fica defasado da
              // transmissão. O load() descarta o buffer e reconecta no
              // ponto ao vivo (o spinner cobre o instante de reconexão).
              audio.load();
          }

          audio.play().catch((e) => console.log("Aguardando interação...", e));

          if (!hasVisualizer) {
              visualizer(audio, visualizerContainer);
              hasVisualizer = true;
          }
      }

      function pause(audio) {
          audio.pause();
          playButton.innerHTML = icons.play;
          playButton.classList.remove("is-active");
          document.body.classList.remove("is-playing");
      }

      // Enquanto o áudio estiver em buffer, mostra o spinner girando
      audio.addEventListener("waiting", () => {
          playButton.innerHTML = icons.spinner;
      });

      // Áudio fluindo de verdade: troca para pause, reseta a reconexão e arma
      // o watchdog (a partir daqui uma queda deve reconectar sozinha)
      audio.addEventListener("playing", () => {
          isIntentionalPause = false;
          reconnectAttempts = 0;
          if (reconnectTimeout) clearTimeout(reconnectTimeout);

          playButton.innerHTML = icons.pause;
          playButton.classList.add("is-active");
          document.body.classList.add("is-playing");
      });

      function handleConnectionDrop() {
          if (isIntentionalPause) return;

          if (reconnectTimeout) clearTimeout(reconnectTimeout);

          if (reconnectAttempts < 5) {
              reconnectAttempts++;
              playButton.innerHTML = icons.spinner;
              const delay = reconnectAttempts * 2000;

              reconnectTimeout = setTimeout(() => {
                  audio.load();
                  const playPromise = audio.play();
                  if (playPromise !== undefined) {
                      playPromise.catch((e) => console.error("Falha ao reconectar:", e));
                  }
              }, delay);
          } else {
              console.error("Muitas falhas seguidas. Parando reconexão automática.");
              pause(audio);
              isIntentionalPause = true;
              reconnectAttempts = 0;
          }
      }

      audio.addEventListener("error", handleConnectionDrop);
      audio.addEventListener("stalled", handleConnectionDrop);

      // --- [VISUALIZADOR] ----------------------------------------------

      const visualizer = (audio, container) => {
          if (!audio || !container) {
              return;
          }
          const options = {
              fftSize: container.dataset.fftSize || 2048,
              numBars: container.dataset.bars || 40,
              maxHeight: container.dataset.maxHeight || 255,
          };
          const ctx = new AudioContext();
          const audioSource = ctx.createMediaElementSource(audio);
          const analyzer = ctx.createAnalyser();
          audioSource.connect(analyzer);
          audioSource.connect(ctx.destination);

          // O AudioContext nasce suspenso quando criado sem gesto do usuário
          // (ex.: auto-retomada após navegar) — sem resume() o áudio ficaria
          // roteado para um contexto mudo.
          if (ctx.state === "suspended") {
              ctx.resume().catch(() => {});
              document.addEventListener("pointerdown", () => ctx.resume().catch(() => {}), { once: true });
          }

          const frequencyData = new Uint8Array(analyzer.frequencyBinCount);
          const canvas = initCanvas(container);
          const canvasCtx = canvas.getContext("2d");

          let animationId = null;
          let isRunning = false;

          const renderBars = () => {
              resizeCanvas(canvas, container);
              analyzer.getByteFrequencyData(frequencyData);
              if (options.fftSize) {
                  analyzer.fftSize = options.fftSize;
              }
              canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
              for (let i = 0; i < options.numBars; i++) {
                  const index = Math.floor((i + 10) * (i < options.numBars / 2 ? 2 : 1));
                  const fd = frequencyData[index];
                  // Escala para a altura real do canvas (0-255 vira 0-100%):
                  // com px brutos as barras viviam estouradas na barra baixa
                  // do dock, parecendo um bargraph sempre cheio
                  const barHeight = Math.max(2, ((fd || 0) / 255) * canvas.height);
                  const barWidth = canvas.width / options.numBars;
                  const x = i * barWidth;
                  const y = canvas.height - barHeight;
                  canvasCtx.fillStyle = "white";
                  canvasCtx.fillRect(x, y, barWidth + 1, barHeight);
              }
              animationId = requestAnimationFrame(renderBars);
          };

          // Em telas pequenas o bargraph fica desligado para economizar
          // bateria/CPU do celular.
          const mobileQuery = window.matchMedia("(max-width: 767px)");

          function start() {
              if (isRunning) return;
              isRunning = true;
              container.style.display = "";
              renderBars();
          }

          function stop() {
              isRunning = false;
              if (animationId) {
                  cancelAnimationFrame(animationId);
                  animationId = null;
              }
              container.style.display = "none";
          }

          function syncWithViewport() {
              if (mobileQuery.matches) {
                  stop();
              } else {
                  start();
              }
          }

          syncWithViewport();
          if (mobileQuery.addEventListener) {
              mobileQuery.addEventListener("change", syncWithViewport);
          } else {
              mobileQuery.addListener(syncWithViewport);
          }

          // Pausa o desenho quando a aba está oculta (economia de CPU)
          document.addEventListener("visibilitychange", () => {
              if (document.hidden) {
                  if (animationId) cancelAnimationFrame(animationId);
              } else if (isRunning) {
                  renderBars();
              }
          });
      };

      function initCanvas(container) {
          const canvas = document.createElement("canvas");
          canvas.setAttribute("id", "visualizerCanvas");
          canvas.setAttribute("class", "visualizer-item");
          container.appendChild(canvas);
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;
          return canvas;
      }

      function resizeCanvas(canvas, container) {
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;
      }

      function outsideClick(button) {
          if (!button) return;
          const target = root.querySelector("#" + button.dataset.outside);
          if (!target) return;
          button.addEventListener("click", () => {
              button.classList.toggle(ACTIVE_CLASS);
              target.classList.toggle(ACTIVE_CLASS);
          });
          const clickOutside = (event) => {
              if (!target.contains(event.target) && !button.contains(event.target)) {
                  button.classList.remove(ACTIVE_CLASS);
                  target.classList.remove(ACTIVE_CLASS);
              }
          };
          document.addEventListener("click", clickOutside);
          const close = target.querySelector("[data-close]");
          if (close) {
              close.onclick = function () {
                  button.classList.remove(ACTIVE_CLASS);
                  target.classList.remove(ACTIVE_CLASS);
              };
          }
      }

      root.querySelectorAll("[data-outside]").forEach((button) => {
          outsideClick(button);
      });

      // Painel "mais" (mobile): acionar qualquer recurso a partir dele
      // fecha o painel — o offcanvas/modal aberto assume a tela
      const moreButton = root.querySelector(".player-button-more");
      const moreControls = root.querySelector("#player-more");
      if (moreButton && moreControls) {
          moreControls.addEventListener("click", (event) => {
              if (event.target.closest("button, a")) {
                  moreButton.classList.remove(ACTIVE_CLASS);
                  moreControls.classList.remove(ACTIVE_CLASS);
              }
          });
      }

      // Ícones — Meteor Icons: https://meteoricons.com/
      const icons = {
          play: '<svg class="i i-play" viewBox="0 0 24 24"><path d="m7 3 14 9-14 9z"></path></svg>',
          pause: '<svg class="i i-pause" viewBox="0 0 24 24"><path d="M5 4h4v16H5Zm10 0h4v16h-4Z"></path></svg>',
          spinner: '<svg class="i i-spinner" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10h-2a8 8 0 10-8 8v2z"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></path></svg>',
          facebook: '<svg class="i i-facebook" viewBox="0 0 24 24"><path d="M17 14h-3v8h-4v-8H7v-4h3V7a5 5 0 0 1 5-5h3v4h-3q-1 0-1 1v3h4Z"></path></svg>',
          twitter: '<svg class="i i-x" viewBox="0 0 24 24"><path d="m3 21 7.5-7.5m3-3L21 3M8 3H3l13 18h5Z"></path></svg>',
          instagram: '<svg class="i i-instagram" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><rect width="20" height="20" x="2" y="2" rx="5"></rect><path d="M17.5 6.5h0"></path></svg>',
          youtube: '<svg class="i i-youtube" viewBox="0 0 24 24"><path d="M1.5 17q-1-5.5 0-10Q1.9 4.8 4 4.5q8-1 16 0 2.1.3 2.5 2.5 1 4.5 0 10-.4 2.2-2.5 2.5-8 1-16 0-2.1-.3-2.5-2.5Zm8-8.5v7l6-3.5Z"></path></svg>',
          tiktok: '<svg class="i i-tiktok" viewBox="0 0 24 24"><path d="M22 6v5q-4 0-6-2v7a7 7 0 1 1-5-6.7m0 6.7a2 2 0 1 0-2 2 2 2 0 0 0 2-2V1h5q2 5 6 5"></path></svg>',
          whatsapp: '<svg class="i i-whatsapp" viewBox="0 0 24 24"><circle cx="9" cy="9" r="1"></circle><circle cx="15" cy="15" r="1"></circle><path d="M8 9a7 7 0 0 0 7 7m-9 5.2A11 11 0 1 0 2.8 18L2 22Z"></path></svg>',
          telegram: '<svg class="i i-telegram" viewBox="0 0 24 24"><path d="M12.5 16 9 19.5 7 13l-5.5-2 21-8-4 18-7.5-7 4-3"></path></svg>',
          tv: '<svg class="i i-tv" viewBox="0 0 24 24"><rect width="22" height="15" x="1" y="3" rx="3"></rect><path d="M7 21h10"></path></svg>',
          ios: '<svg class="i i-apple" viewBox="0 0 24 24"><path d="M12 3q2 0 2-2-2 0-2 2M8 6C0 6 3 22 8 22q2 0 3-.5t2 0q1 .5 3 .5 3 0 4.5-6a1 1 0 0 1-.5-7.5Q19 6 16 6q-1 0-2.5.5t-3 0Q9 6 8 6"></path></svg>',
          android: '<svg class="i i-google-play" viewBox="0 0 24 24"><path d="M6.8 2.2a2.5 2.5 0 0 0-3.8 2v15.6a2.5 2.5 0 0 0 3.8 2L21 13.7a2 2 0 0 0 0-3.4ZM3.2 3.5l12.8 13m-12.8 4L16 7.5"></path></svg>',
      };

      // --- [OBTENÇÃO DE DADOS DA API] ----------------------------------

      // Busca na API própria (search.php) — mesma fonte de capas do albumArt
      // do now-playing. Retorna null quando não encontra.
      const getDataFromSearch = async (artist, title, defaultArt, defaultCover) => {
          const text = artist === title ? `${title}` : `${artist} - ${title}`;
          const cacheKey = ("search:" + text).toLowerCase();
          if (cache[cacheKey]) {
              return cache[cacheKey];
          }

          try {
              const response = await fetch(`https://api.twj.es/search.php?query=${encodeURIComponent(text)}`);
              if (!response.ok) return null;
              const data = await response.json();

              if (data.results && data.results.artwork) {
                  const results = {
                      title,
                      artist,
                      thumbnail: data.results.artwork,
                      art: data.results.artwork,
                      cover: data.results.artwork,
                      stream_url: data.results.stream_url || "#not-found",
                  };
                  cache[cacheKey] = results;
                  return results;
              }
              return null;
          } catch (error) {
              return null;
          }
      };

      const getDataFromITunes = async (artist, title, defaultArt, defaultCover) => {
          let text;
          if (artist === title) {
              text = `${title}`;
          } else {
              text = `${artist} ${title}`;
          }
          const cacheKey = text.toLowerCase();
          if (cache[cacheKey]) {
              return cache[cacheKey];
          }

          // media=music/entity=song: sem esse filtro, podcasts com nomes
          // parecidos entravam no match e a capa vinha errada
          const response = await fetch(`https://itunes.apple.com/search?limit=1&media=music&entity=song&term=${encodeURIComponent(text)}`);
          if (response.status === 403) {
              return { title, artist, art: defaultArt, cover: defaultCover, stream_url: "#not-found" };
          }
          const data = response.ok ? await response.json() : {};
          if (!data.results || data.results.length === 0) {
              return { title, artist, art: defaultArt, cover: defaultCover, stream_url: "#not-found" };
          }
          const itunes = data.results[0];
          const results = {
              title: title,
              artist: artist,
              thumbnail: itunes.artworkUrl100 || defaultArt,
              art: itunes.artworkUrl100 ? changeImageSize(itunes.artworkUrl100, "600x600") : defaultArt,
              cover: itunes.artworkUrl100 ? changeImageSize(itunes.artworkUrl100, "1500x1500") : defaultCover,
              stream_url: "#not-found",
          };
          cache[cacheKey] = results;
          return results;
      };

      async function getDataFrom({ artist, title, art, cover }) {
          // search.php primeiro (cobre iTunes + Spotify), iTunes como fallback
          const fromSearch = await getDataFromSearch(artist, title, art, cover);
          if (fromSearch) return fromSearch;
          return getDataFromITunes(artist, title, art, cover);
      }

      // Letras: lyrics.ovh com fallback LRCLIB, cacheando a própria Promise
      const lyricsCache = {};

      const getLyrics = (artist, name) => {
          const cacheKey = `${artist} - ${name}`.toLowerCase();
          if (lyricsCache[cacheKey]) {
              return lyricsCache[cacheKey];
          }

          const fetchLyrics = async () => {
              try {
                  const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(name)}`);
                  const data = await response.json();
                  if (data && data.lyrics) return data.lyrics;
              } catch (error) {}

              try {
                  const response = await fetch(`https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(name)}`);
                  if (response.ok) {
                      const data = await response.json();
                      const lyrics = data.plainLyrics || data.syncedLyrics;
                      if (lyrics) return lyrics;
                  }
              } catch (error) {}

              try {
                  const response = await fetch(`https://lrclib.net/api/search?track_name=${encodeURIComponent(name)}&artist_name=${encodeURIComponent(artist)}`);
                  if (response.ok) {
                      const results = await response.json();
                      const hit = Array.isArray(results) && results.find((r) => r.plainLyrics || r.syncedLyrics);
                      if (hit) return hit.plainLyrics || hit.syncedLyrics;
                  }
              } catch (error) {}

              return "Letra não disponível";
          };

          const promise = fetchLyrics();
          lyricsCache[cacheKey] = promise;
          return promise;
      };

      function normalizeTitle(api) {
          let title;
          let artist;

          if (api.last_played) {
              title = api.last_played.song;
              artist = api.last_played.artist;
          } else if (api.song && api.artist) {
              title = api.song;
              artist = api.artist;
          } else if (api.songtitle && api.songtitle.includes(" - ")) {
              // Convenção ICY: "Artista - Título"
              artist = api.songtitle.split(" - ")[0];
              title = api.songtitle.substring(api.songtitle.indexOf(" - ") + 3);
          } else if (api.now_playing && api.now_playing.song) {
              title = api.now_playing.song.title;
              artist = api.now_playing.song.artist;
          } else if (api.artist && api.title) {
              title = api.title;
              artist = api.artist;
          } else if (api.currenttrack_title) {
              title = api.currenttrack_title;
              artist = api.currenttrack_artist;
          } else if (api.title && api.djprofile && api.djusername) {
              title = api.title.split(" - ")[1];
              artist = api.title.split(" - ")[0];
          } else {
              title = api.currentSong;
              artist = api.currentArtist;
          }

          return { title, artist };
      }

      function normalizeHistory(api) {
          const historyData = api.song_history || api.history || api.songHistory || [];

          if (!Array.isArray(historyData)) {
              return [];
          }

          const history = historyData.slice(0, 10);

          const historyNormalized = history.map((item) => {
              let artist = "";
              let song = "";

              if (item.song && typeof item.song === "object" && item.song.title) {
                  artist = item.song.artist || "";
                  song = item.song.title;
              } else if (item.song && typeof item.song === "string") {
                  artist = item.artist || "";
                  song = item.song;
              } else if (item.title) {
                  artist = item.artist || "";
                  song = item.title;
              }

              if (!song) return null;

              return {
                  artist: sanitizeText(artist),
                  song: sanitizeText(song),
              };
          });

          return historyNormalized.filter((item) => item !== null);
      }

      // --- [MANIPULAÇÃO DA INTERFACE] ----------------------------------

      // A cor dominante crua da capa pode ser quase preta (controles e itens
      // somem no escuro) ou clara/lavada demais (não marca nada). Clampa em
      // HSL para uma faixa sempre visível; capa sem cor nenhuma (P&B/cinza)
      // devolve null e o player fica com o accent padrão do CSS.
      function vividAccent(rgb) {
          const r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255;
          const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
          let l = (max + min) / 2;
          let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
          let h;
          if (d === 0) h = 0;
          else if (max === r) h = 60 * (((g - b) / d) % 6);
          else if (max === g) h = 60 * ((b - r) / d + 2);
          else h = 60 * ((r - g) / d + 4);
          if (h < 0) h += 360;
          if (s < 0.1) return null;
          s = Math.max(s, 0.45);
          l = Math.min(Math.max(l, 0.42), 0.68);
          return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
      }

      function setAccentColor(image, colorThief) {
          const dom = root.querySelector(".app-player");
          const metaThemeColor = document.querySelector("meta[name=theme-color]");
          const apply = () => {
              const accent = vividAccent(colorThief.getColor(image));
              if (accent) {
                  dom.style.setProperty("--accent", accent);
              } else {
                  dom.style.removeProperty("--accent");
              }
              if (metaThemeColor) {
                  metaThemeColor.setAttribute("content", accent || "dark light");
              }
          };
          if (image.complete) {
              apply();
          } else {
              image.addEventListener("load", apply);
          }
      }

      function createOpenTvButton(url) {
          const $button = document.createElement("button");
          $button.classList.add("player-button", "player-button-tv");
          $button.innerHTML = icons.tv + "Tv";
          $button.addEventListener("click", () => {
              $button.blur();
              const modalBody = playerTvModal.querySelector(".modal-body-video");
              const closeButton = playerTvModal.querySelector("[data-close]");
              if ($button.classList.contains("is-active")) {
                  playerTvModal.classList.remove("is-active");
                  $button.classList.remove("is-active");
                  modalBody.innerHTML = "";
                  return;
              }
              $button.classList.add("is-active");
              playerTvModal.classList.add("is-active");

              const wasPlaying = !audio.paused;
              // Pausa INTENCIONAL: sem esta flag o watchdog de reconexão
              // trataria a pausa como queda e religaria a rádio sobre a TV
              isIntentionalPause = true;
              if (reconnectTimeout) clearTimeout(reconnectTimeout);
              fadeOut(() => pause(audio));

              const $iframe = document.createElement("iframe");
              $iframe.src = url;
              // Sem o allow="autoplay" o navegador bloqueia o play automático
              // dentro de iframes de outra origem, mesmo com ?autoplay=1 na URL
              $iframe.allow = "autoplay; fullscreen; encrypted-media; picture-in-picture";
              $iframe.allowFullscreen = true;
              modalBody.appendChild($iframe);
              closeButton.addEventListener("click", () => {
                  $button.classList.remove("is-active");
                  playerTvModal.classList.remove("is-active");
                  modalBody.innerHTML = "";
                  // Retoma a rádio (no ponto ao vivo) se estava tocando antes
                  if (wasPlaying) {
                      isIntentionalPause = false;
                      fadeIn();
                      play(audio, currentStation.stream_url);
                  }
              }, { once: true });
          });
          playerTv.appendChild($button);
      }

      function createSocialItem(url, icon) {
          const $a = document.createElement("a");
          $a.classList.add("player-social-item");
          $a.href = url;
          $a.target = "_blank";
          $a.innerHTML = icons[icon];
          return $a;
      }

      function createStreamItem(station, index, currentStation, audio, callback) {
          const $button = document.createElement("button");
          $button.classList.add("station");
          $button.innerHTML = `<img class="station-img" src="${station.album}" alt="station" height="160" width="160">`;
          $button.dataset.index = index;
          $button.dataset.hash = station.hash;

          if (currentStation.stream_url === station.stream_url) {
              $button.classList.add("is-active");
              activeButton = $button;
          }

          $button.addEventListener("click", () => {
              if ($button.classList.contains("is-active")) return;

              root.querySelectorAll(".station").forEach((button) => {
                  button.classList.remove("is-active");
              });

              $button.classList.add("is-active");
              activeButton = $button;

              // Persiste a estação: quem navega pelo site (ou volta amanhã)
              // reencontra a mesma rádio tocando
              localStorage.setItem("radioplayer:station", station.hash);
              localStorage.setItem("radioplayer:playing", "1");

              setAssetsInPage(station);
              isIntentionalPause = false;
              play(audio, station.stream_url);

              if (historyElement) {
                  historyElement.innerHTML = "";
              }

              if (typeof callback === "function") {
                  callback(station);
              }
          });

          return $button;
      }

      function createStations(stations, currentStation, audio, callback) {
          if (!stationsList) return;
          stationsList.innerHTML = "";
          stations.forEach((station, index) => {
              const $fragment = document.createDocumentFragment();
              const $button = createStreamItem(station, index, currentStation, audio, callback);
              $fragment.appendChild($button);
              stationsList.appendChild($fragment);
          });
      }

      function shareOnSocialMedia(event) {
          event.preventDefault();
          const link = event.target.closest("a");
          const network = link.dataset.network;
          const radioName = link.dataset.radioName;
          const radioUrl = link.dataset.radioUrl;

          let shareUrl;

          switch (network) {
              case "facebook":
                  shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(radioUrl)}`;
                  break;
              case "twitter":
                  shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Estou ouvindo ${radioName}! ${radioUrl}`)}&hashtags=radio,musica`;
                  break;
              case "whatsapp":
                  shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Estou ouvindo ${radioName}! Confira: ${radioUrl}`)}`;
                  break;
              default:
                  shareUrl = radioUrl;
          }

          window.open(shareUrl, "_blank");
      }

      root.querySelectorAll(".modal-social a").forEach((button) => {
          button.addEventListener("click", shareOnSocialMedia);
      });

      function setAssetsInPage(station) {
          playerArtwork && (playerArtwork.src = station.album);
          playerCoverImg && (playerCoverImg.src = station.cover || station.album);
          stationName.textContent = station.name;
          stationDescription.textContent = station.description;
          playerTv && (playerTv.innerHTML = "");

          const modalImage = root.querySelector(".player-modal-image");
          if (modalImage) {
              modalImage.src = station.album;
          }

          const stationLogo = root.querySelector(".player-station img");
          if (stationLogo) {
              stationLogo.src = station.album;
          }

          root.querySelectorAll(".modal-social a").forEach((link) => {
              link.dataset.radioName = station.name;
              link.dataset.radioLogo = station.logo;
              link.dataset.radioUrl = window.location.href;
          });

          if (station.tv_url && playerTv) {
              createOpenTvButton(station.tv_url);
          }
          if (playerSocial) {
              playerSocial.innerHTML = "";
          }
          if (station.social && playerSocial) {
              Object.keys(station.social).forEach((key) => {
                  playerSocial.appendChild(createSocialItem(station.social[key], key));
              });
          }
      }

      function mediaSession(data) {
          const { title, artist, album, art } = data;
          if ("mediaSession" in navigator) {
              navigator.mediaSession.metadata = new MediaMetadata({
                  title,
                  artist,
                  album,
                  artwork: [
                      {
                          src: art,
                          sizes: "512x512",
                          type: "image/png",
                      },
                  ],
              });
              navigator.mediaSession.setActionHandler("play", () => {
                  play(audio);
              });
              navigator.mediaSession.setActionHandler("pause", () => {
                  pause(audio);
              });
          }
      }

      function currentSong(data) {
          const content = songNow;
          content.querySelector(".song-name").textContent = data.title;
          content.querySelector(".song-artist").textContent = data.artist;

          const modalSongName = root.querySelector("#modal-share .song-name");
          const modalSongArtist = root.querySelector("#modal-share .song-artist");

          if (modalSongName && modalSongArtist) {
              modalSongName.textContent = data.title;
              modalSongArtist.textContent = data.artist;
          }

          const artwork = content.querySelector(".player-artwork");
          if (artwork) {
              const $img = document.createElement("img");
              $img.src = data.art;
              $img.width = 600;
              $img.height = 600;

              $img.addEventListener("load", () => {
                  artwork.appendChild($img);

                  if (typeof ColorThief !== "undefined") {
                      const colorThief = new ColorThief();
                      createTempImage($img.src).then((img) => {
                          setAccentColor(img, colorThief);
                      }).catch(() => {});
                  }

                  setTimeout(() => {
                      artwork.querySelectorAll("img").forEach((img) => {
                          img.style.transform = `translateX(${-img.width}px)`;

                          img.addEventListener("transitionend", () => {
                              artwork.querySelectorAll("img:not(:last-child)").forEach((img) => {
                                  img.remove();
                              });
                              img.style.transition = "none";
                              img.style.transform = "none";
                              setTimeout(() => {
                                  img.removeAttribute("style");
                              }, 1000);
                          });
                      });
                  }, 100);
              });
          }
          if (playerCoverImg) {
              const tempImg = new Image();
              tempImg.src = data.cover || data.art;
              tempImg.addEventListener("load", () => {
                  playerCoverImg.style.opacity = 0;

                  playerCoverImg.addEventListener("transitionend", () => {
                      playerCoverImg.src = data.cover || data.art;
                      playerCoverImg.style.opacity = 1;
                  });
              });
          }
      }

      function setHistory(data, current, server) {
          if (!historyElement) return;
          historyElement.innerHTML = historyTemplate.replace("{{art}}", pixel).replace("{{song}}", "Carregando histórico...").replace("{{artist}}", "Artista").replace("{{stream_url}}", "#not-found");
          if (!data) return;

          data = data.slice(0, 10);
          const promises = data.map(async (item) => {
              const { artist, song } = item;
              const { album, cover } = current;
              const dataFrom = await getDataFrom({
                  artist,
                  title: song,
                  art: album,
                  cover,
                  server,
              });
              return historyTemplate
                  .replace("{{art}}", dataFrom.thumbnail || dataFrom.art)
                  .replace("{{song}}", dataFrom.title)
                  .replace("{{artist}}", dataFrom.artist)
                  .replace("{{stream_url}}", dataFrom.stream_url);
          });
          Promise.all(promises)
              .then((itemsHTML) => {
                  const $fragment = document.createDocumentFragment();
                  itemsHTML.forEach((itemHTML) => {
                      $fragment.appendChild(createElementFromHTML(itemHTML));
                  });
                  historyElement.innerHTML = "";
                  historyElement.appendChild($fragment);
              })
              .catch((error) => {
                  console.error("Error:", error);
              });
      }

      function setLyrics(artist, title) {
          if (!LYRICS_ENABLED || !lyricsContent) return;
          getLyrics(artist, title)
              .then((lyrics) => {
                  const $p = document.createElement("p");
                  $p.innerHTML = lyrics.replace(/\n/g, "<br>");
                  lyricsContent.innerHTML = "";
                  lyricsContent.appendChild($p);
              })
              .catch((error) => {
                  console.error("Error:", error);
              });
      }

      // --- [INICIALIZAÇÃO] ---------------------------------------------

      const json = CONFIG;
      const stations = json.stations || [];
      if (!stations.length) {
          console.error("RadioPlayer: nenhuma estação configurada em window.streams.stations");
          return;
      }

      // Restaura a estação persistida (se ainda existir na config)
      const savedHash = localStorage.getItem("radioplayer:station");
      currentStation = stations.find((s) => s.hash === savedHash) || stations[0];

      setAssetsInPage(currentStation);
      audio.src = currentStation.stream_url;

      if (playButton !== null) {
          playButton.addEventListener("click", handlePlayPause);
      }

      // --- [CONTROLE DE VOLUME] ----------------------------------------

      const range = root.querySelector(".player-volume");
      const rangeFill = root.querySelector(".player-range-fill");
      const rangeWrapper = root.querySelector(".player-range-wrapper");
      const rangeThumb = root.querySelector(".player-range-thumb");
      let currentVolume = parseInt(localStorage.getItem("volume") || "100", 10) || 100;

      function setRangeHeight(percent) {
          rangeFill.style.height = `${percent}%`;
      }

      function setThumbPosition(percent) {
          const compensatedHeight = rangeWrapper.offsetHeight - rangeThumb.offsetHeight;
          const thumbPosition = (percent / 100) * compensatedHeight;
          rangeThumb.style.bottom = `${thumbPosition}px`;
      }

      function updateVolume(value) {
          range.value = value;
          setRangeHeight(value);
          setThumbPosition(value);
          localStorage.setItem("volume", value);
          audio.volume = value / 100;
      }

      if (range !== null) {
          updateVolume(currentVolume);

          range.addEventListener("input", (event) => {
              updateVolume(parseInt(event.target.value, 10));
          });

          rangeWrapper.addEventListener("mousedown", (event) => {
              if (event.target === rangeThumb) {
                  return;
              }
              const rangeRect = range.getBoundingClientRect();
              const clickY = event.clientY - rangeRect.top;
              let percent = (clickY / range.offsetHeight) * 100;
              percent = 100 - percent;
              percent = Math.max(0, Math.min(100, percent));
              const value = Math.round((range.max - range.min) * (percent / 100)) + parseInt(range.min);
              updateVolume(value);
          });

          rangeThumb.addEventListener("mousedown", () => {
              document.addEventListener("mousemove", handleThumbDrag);
          });

          window.addEventListener("resize", () => {
              const currentPercent = range.value;
              setRangeHeight(currentPercent);
              setThumbPosition(currentPercent);
          });
      }

      function handleThumbDrag(event) {
          const rangeRect = rangeWrapper.getBoundingClientRect();
          const clickY = event.clientY - rangeRect.top;
          let percent = (clickY / rangeWrapper.offsetHeight) * 100;
          percent = 100 - percent;
          percent = Math.max(0, Math.min(100, percent));
          const value = Math.round((range.max - range.min) * (percent / 100)) + parseInt(range.min);
          updateVolume(value);
      }

      document.addEventListener("mouseup", () => {
          document.removeEventListener("mousemove", handleThumbDrag);
      });

      // --- [POLLING DE METADATA] ----------------------------------------

      function initStream(currentStation) {
          if (timeoutId) clearTimeout(timeoutId);

          if (currentStation && currentStation.stream_url !== audio.src) {
              audio.src = currentStation.stream_url;
          }

          const server = currentStation.server || "itunes";
          const jsonUri = currentStation.api || API_URL + encodeURIComponent(currentStation.stream_url);

          fetch(jsonUri)
              .then((response) => response.json())
              .then(async (res) => {
                  const current = normalizeTitle(res);
                  const title = current.title;

                  // O songtitle cru é estável entre as respostas da API —
                  // comparar também capa e clipe evita perder enriquecimentos
                  // que chegam atrasados (a API resolve albumArt/youtubeId de
                  // forma assíncrona e eles aparecem em polls seguintes)
                  const songKey = res.songtitle || title;
                  const artKey = res.albumArt || "";
                  const ytKey = res.youtubeId || res.youtube_id || "";
                  if (currentSongPlaying === songKey && lastAlbumArt === artKey && lastYoutubeId === ytKey) {
                      return;
                  }
                  currentSongPlaying = songKey;
                  lastAlbumArt = artKey;
                  lastYoutubeId = ytKey;

                  const artist = current.artist;
                  const art = currentStation.album;
                  const cover = currentStation.cover;
                  const historyData = normalizeHistory(res);

                  if (title && artist) {
                      let dataFrom;
                      if (res.albumArt) {
                          // A API já entrega a capa pronta no payload
                          dataFrom = {
                              title: res.song || title,
                              artist: res.artist || artist,
                              album: res.album || "",
                              thumbnail: res.albumArt,
                              art: res.albumArt,
                              cover: res.albumArt.replace("600x600", "1500x1500"),
                              stream_url: res.streamUrl || "#not-found",
                          };
                          cache[`${dataFrom.artist} - ${dataFrom.title}`.toLowerCase()] = dataFrom;
                      } else {
                          dataFrom = await getDataFrom({ artist, title, art, cover, server });
                      }

                      currentSong(dataFrom);
                      mediaSession(dataFrom);

                      // Expõe a faixa atual para o site (ex.: modo clipe).
                      // youtubeId vem da API quando ela souber o clipe da música.
                      const trackDetail = {
                          title: dataFrom.title,
                          artist: dataFrom.artist,
                          art: dataFrom.art,
                          cover: dataFrom.cover,
                          youtubeId: res.youtubeId || res.youtube_id || null,
                          // posição da música (para o modo clipe abrir o vídeo
                          // sincronizado com a rádio, não do zero)
                          elapsed: (res.now_playing && typeof res.now_playing.elapsed === "number") ? res.now_playing.elapsed : 0,
                          duration: (res.now_playing && res.now_playing.duration) || 0,
                          receivedAt: Date.now(),
                      };
                      if (window.RadioPlayer) window.RadioPlayer.currentTrack = trackDetail;
                      document.dispatchEvent(new CustomEvent("radioplayer:track", { detail: trackDetail }));

                      const lyricsKey = `${dataFrom.artist} - ${dataFrom.title}`.toLowerCase();
                      if (lyricsKey !== lastLyricsKey) {
                          lastLyricsKey = lyricsKey;
                          setLyrics(dataFrom.artist, dataFrom.title);
                      }

                      setHistory(historyData, currentStation, server);
                  } else {
                      console.log("Título ou artista inválidos. Pulando busca de dados adicionais.");
                  }
              })
              .catch((error) => console.error("Erro ao buscar dados da API:", error));

          timeoutId = setTimeout(() => {
              initStream(currentStation);
          }, TIME_TO_REFRESH);
      }

      initStream(currentStation);

      createStations(stations, currentStation, audio, (station) => {
          currentStation = station;
          initStream(station);
      });

      const nextStationButton = root.querySelector(".player-button-forward-step");
      const prevStationButton = root.querySelector(".player-button-backward-step");

      if (nextStationButton) {
          nextStationButton.addEventListener("click", () => {
              const active = stationsList.querySelector(".is-active");
              const next = active.nextElementSibling || stationsList.firstElementChild;
              if (next) {
                  next.click();
              }
          });
      }

      if (prevStationButton) {
          prevStationButton.addEventListener("click", () => {
              const active = stationsList.querySelector(".is-active");
              const prev = active.previousElementSibling || stationsList.lastElementChild;
              if (prev) {
                  prev.click();
              }
          });
      }

      // --- [RETOMADA AUTOMÁTICA] ----------------------------------------
      // Se o usuário estava ouvindo (nesta ou em outra página do site),
      // retoma a reprodução. Se o navegador bloquear o autoplay, retoma no
      // primeiro toque/clique em qualquer lugar da página.
      if (localStorage.getItem("radioplayer:playing") === "1") {
          isIntentionalPause = false;
          fadeIn();
          play(audio);

          document.addEventListener("pointerdown", () => {
              if (audio.paused && localStorage.getItem("radioplayer:playing") === "1") {
                  isIntentionalPause = false;
                  fadeIn();
                  play(audio);
              }
          }, { once: true });
      }

      // API pública mínima
      window.RadioPlayer = {
          root,
          audio,
          currentTrack: null,
          play: () => { isIntentionalPause = false; play(audio); },
          pause: () => { isIntentionalPause = true; pause(audio); },
          toggle: handlePlayPause,
      };

      document.dispatchEvent(new CustomEvent("radioplayer:ready"));
  }

  // --- [NAVEGAÇÃO SEM INTERROMPER O ÁUDIO (SPA-lite)] -------------------
  // Intercepta cliques em links internos, baixa a página de destino e troca
  // o conteúdo do <body> mantendo o player (e o áudio) intactos.
  // Limitação: as páginas devem compartilhar o mesmo layout base; folhas de
  // estilo novas do <head> da página de destino são adotadas automaticamente.

  function setupSeamlessNavigation() {
      if (!SEAMLESS || !window.history || !window.DOMParser) return;

      const OWN_SCRIPTS = /radioplayer(\.min)?\.js|config\.js|color-thief/i;
      const WP_ADMIN = /\/wp-admin(\/|$)|\/wp-login\.php$/i;

      async function loadPage(url, pushHistory) {
          let html;
          try {
              const response = await fetch(url, { headers: { "X-Requested-With": "RadioPlayer" } });
              if (!response.ok) throw new Error("HTTP " + response.status);
              html = await response.text();
          } catch (error) {
              // Qualquer falha: navegação normal (o áudio recomeça via retomada)
              window.location.href = url;
              return;
          }

          const newDoc = new DOMParser().parseFromString(html, "text/html");

          if (pushHistory) {
              history.pushState({ radioplayer: true }, "", url);
          }

          document.title = newDoc.title || document.title;

          // Adota folhas de estilo novas do head da página de destino
          const currentHrefs = new Set([...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.href));
          newDoc.querySelectorAll('link[rel="stylesheet"]').forEach((l) => {
              const abs = new URL(l.getAttribute("href"), url).href;
              if (!currentHrefs.has(abs)) {
                  const nl = document.createElement("link");
                  nl.rel = "stylesheet";
                  nl.href = abs;
                  document.head.appendChild(nl);
              }
          });

          // Remove o conteúdo atual (tudo, menos o player e elementos
          // marcados com data-seamless-keep — ex.: o mini-player de vídeo,
          // que continua tocando entre as páginas)
          [...document.body.children].forEach((el) => {
              if (el !== root && !el.hasAttribute("data-seamless-keep")) el.remove();
          });

          // Importa o conteúdo novo (ignorando um eventual player embutido nele)
          const fragment = document.createDocumentFragment();
          [...newDoc.body.children].forEach((el) => {
              if (el.classList && el.classList.contains("msp_radio")) return;
              fragment.appendChild(document.importNode(el, true));
          });
          document.body.insertBefore(fragment, root);

          // Reexecuta os scripts da página nova (menos os do próprio player,
          // que já está rodando — remontá-lo mataria o áudio)
          const pendingScripts = [];
          document.body.querySelectorAll("script").forEach((oldScript) => {
              if (oldScript.closest("#radioplayer-root")) return;
              const src = oldScript.src || "";
              if (OWN_SCRIPTS.test(src)) {
                  oldScript.remove();
                  return;
              }
              const fresh = document.createElement("script");
              [...oldScript.attributes].forEach((attr) => fresh.setAttribute(attr.name, attr.value));
              fresh.textContent = oldScript.textContent;
              if (oldScript.src) {
                  pendingScripts.push(new Promise((resolve) => {
                      fresh.onload = fresh.onerror = resolve;
                  }));
              }
              oldScript.replaceWith(fresh);
          });

          // Respeita a âncora do link (ex.: index.html#videos). O scroll só
          // acontece depois que os scripts da página nova carregam — eles
          // renderizam as seções e mudam a altura da página; rolar antes
          // deixava a âncora no lugar errado.
          const hash = new URL(url, location.href).hash;
          if (hash) {
              Promise.all(pendingScripts).then(() => {
                  setTimeout(() => {
                      const anchorTarget = document.querySelector(hash);
                      if (anchorTarget) anchorTarget.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 50);
              });
          } else {
              window.scrollTo(0, 0);
          }
      }

      document.addEventListener("click", (event) => {
          if (event.defaultPrevented || event.button !== 0) return;
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

          const link = event.target.closest("a[href]");
          if (!link) return;
          if (link.closest("#radioplayer-root")) return; // links do próprio player
          if (link.target && link.target !== "_self") return;
          if (link.hasAttribute("download") || link.hasAttribute("data-no-seamless")) return;

          const url = new URL(link.href, location.href);
          if (url.origin !== location.origin) return; // só links internos
          if (WP_ADMIN.test(url.pathname)) return; // wp-admin / wp-login.php: fora do layout do site
          if (url.pathname === location.pathname && url.search === location.search && url.hash) return; // âncora na mesma página

          event.preventDefault();
          loadPage(url.href, true);
      });

      window.addEventListener("popstate", () => {
          loadPage(location.href, false);
      });
  }

  // --- [BOOT] -----------------------------------------------------------

  function boot() {
      injectAssets();
      mountDom();
      setupSeamlessNavigation();
      loadColorThief().then(() => {
          document.body.classList.remove("preload");
          startPlayer();
      });
  }

  if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot);
  } else {
      boot();
  }
})();
