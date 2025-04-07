(function () {
  "use strict";

  // --- [CONFIGURAÇÕES] -----------------------------------------------

  const API_KEY_LYRICS = "1637b78dc3b129e6843ed674489a92d0";
  const API_URL = "https://free.radioapi.lat/met?url=";
  const TIME_TO_REFRESH = window?.streams?.timeRefresh || 10000;

  // --- [CONSTANTES E VARIÁVEIS] --------------------------------------

  const buttons = document.querySelectorAll("[data-outside]");
  const ACTIVE_CLASS = "is-active";
  const cache = {};

  // Elementos do DOM
  const playButton = document.querySelector(".player-button-play");
  const visualizerContainer = document.querySelector(".visualizer");
  const songNow = document.querySelector(".song-now");
  const stationsList = document.getElementById("stations");
  const stationName = document.querySelector(".station-name");
  const stationDescription = document.querySelector(".station-description");
  const playerArtwork = document.querySelector(".player-artwork img:first-child");
  const playerCoverImg = document.querySelector(".player-cover-image");
  const playerSocial = document.querySelector(".player-social");
  const historyElement = document.getElementById("history"); // Nome mais descritivo
  const lyricsContent = document.getElementById("lyrics");
  const playerTv = document.querySelector(".online-tv");
  const playerTvModal = document.getElementById("modal-tv");
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
  let timeoutId;

  const audio = new Audio();
  audio.crossOrigin = "anonymous";
  let hasVisualizer = false;

  // --- [FUNÇÕES AUXILIARES] -----------------------------------------

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


  // --- [FUNÇÕES DE REPRODUÇÃO DE ÁUDIO] ----------------------------

  function handlePlayPause() {
      console.log('Botão Play/Pause clicado!');
      if (audio.paused) {
          play(audio);
      } else {
          pause(audio);
      }
  }

  function play(audio, newSource = null) {
      if (newSource) {
          audio.src = newSource;
      }

      // Adiciona evento 'canplay' para garantir que o áudio pode ser reproduzido
      audio.addEventListener("canplay", () => {
          audio.play();
          playButton.innerHTML = icons.pause;
          playButton.classList.add("is-active");
          document.body.classList.add("is-playing");
      });

      if (!hasVisualizer) {
          visualizer(audio, visualizerContainer);
          hasVisualizer = true;
      }

      audio.load();
  }

  function pause(audio) {
      audio.pause();
      playButton.innerHTML = icons.play;
      playButton.classList.remove("is-active");
      document.body.classList.remove("is-playing");
  }

  // --- [VISUALIZADOR] ------------------------------------------------

  // Função visualizer agora no escopo global
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
      const frequencyData = new Uint8Array(analyzer.frequencyBinCount);
      const canvas = initCanvas(container);
      const canvasCtx = canvas.getContext("2d");

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
              const barHeight = Math.max(4, fd || 0) + options.maxHeight / 255;
              const barWidth = canvas.width / options.numBars;
              const x = i * barWidth;
              const y = canvas.height - barHeight;
              canvasCtx.fillStyle = "white";
              canvasCtx.fillRect(x, y, barWidth + 1, barHeight);
          }
          requestAnimationFrame(renderBars);
      };
      renderBars();

      // Listener del cambio de espacio en la ventana
      window.addEventListener("resize", () => {
          resizeCanvas(canvas, container);
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

  // Adiciona a função outsideClick aqui
  function outsideClick(button) {
      if (!button) return;
      const target = document.getElementById(button.dataset.outside);
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

  // Chama a função outsideClick para cada botão com o atributo data-outside
  buttons.forEach((button) => {
      outsideClick(button);
  });

  // Ícones para os botões de reprodução - Meteor Icons: https://meteoricons.com/
  const icons = {
      play: '<svg class="i i-play" viewBox="0 0 24 24"><path d="m7 3 14 9-14 9z"></path></svg>',
      pause: '<svg class="i i-pause" viewBox="0 0 24 24"><path d="M5 4h4v16H5Zm10 0h4v16h-4Z"></path></svg>',
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

  // --- [FUNÇÕES DE OBTENÇÃO DE DADOS DA API] ----------------------

  const getDataFromStreamAfrica = async (artist, title, defaultArt, defaultCover) => {
      let text;
      if (artist === null || artist === title) {
          text = `${title} - ${title}`;
      } else {
          text = `${artist} - ${title}`;
      }
      const cacheKey = text.toLowerCase();
      if (cache[cacheKey]) {
          return cache[cacheKey];
      }
      const API_URL = `https://api-v2.streamafrica.net/musicsearch?query=${encodeURIComponent(text)}&service=spotify`;
      const response = await fetch(API_URL);

      if (title === "Radioplayer Demo" || response.status === 403) {
          const results = {
              title,
              artist,
              art: defaultArt,
              cover: defaultCover,
              stream_url: "#not-found",
          };
          cache[cacheKey] = results;
          return results;
      }

      const data = response.ok ? await response.json() : {};

      // Modificação para acessar o objeto "results" da resposta da API
      const stream = data.results || {};

      if (Object.keys(stream).length === 0) {
          const results = {
              title,
              artist,
              art: defaultArt,
              cover: defaultCover,
              stream_url: "#not-found",
          };
          cache[cacheKey] = results;
          return results;
      }

      const results = {
          title: stream.title || title, // Utilizando os dados da nova resposta da API
          artist: stream.artist || artist,
          thumbnail: stream.artwork?.small || defaultArt, // Acessando a URL da imagem pequena
          art: stream.artwork?.medium || defaultArt, // Acessando a URL da imagem média
          cover: stream.artwork?.large || defaultCover, // Acessando a URL da imagem grande
          stream_url: stream.stream || "#not-found", // Ajustado para o novo nome da propriedade "stream"
      };
      cache[cacheKey] = results;
      return results;
  };

  const getDataFromITunes = async (artist, title, defaultArt, defaultCover) => {
      let text;
      if (artist === title) {
          text = `${title}`;
      } else {
          text = `${artist} - ${title}`;
      }
      const cacheKey = text.toLowerCase();
      if (cache[cacheKey]) {
          return cache[cacheKey];
      }

      const response = await fetch(`https://itunes.apple.com/search?limit=1&term=${encodeURIComponent(text)}`);
      if (response.status === 403) {
          const results = {
              title,
              artist,
              art: defaultArt,
              cover: defaultCover,
              stream_url: "#not-found",
          };
          return results;
      }
      const data = response.ok ? await response.json() : {};
      if (!data.results || data.results.length === 0) {
          const results = {
              title,
              artist,
              art: defaultArt,
              cover: defaultCover,
              stream_url: "#not-found",
          };
          return results;
      }
      const itunes = data.results[0];
      const results = {
          //title: itunes.trackName || title,
          //artist: itunes.artistName || artist,
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

  async function getDataFrom({ artist, title, art, cover, server }) {
      let dataFrom = {};
      if (server.toLowerCase() === "spotify") {
          dataFrom = await getDataFromStreamAfrica(artist, title, art, cover);
      } else {
          dataFrom = await getDataFromITunes(artist, title, art, cover);
      }
      return dataFrom;
  }

  // Obtener letras de canciones
  const getLyrics = async (artist, name) => {
      try {
          const response = await fetch(`https://api.vagalume.com.br/search.php?apikey=${API_KEY_LYRICS}&art=${encodeURIComponent(artist)}&mus=${encodeURIComponent(name)}`);
          const data = await response.json();
          if (data.type === "exact" || data.type === "aprox") {
              const lyrics = data.mus[0].text;
              return lyrics;
          } else {
              return "Not found lyrics";
          }
      } catch (error) {
          console.error("Error fetching lyrics:", error);
          return "Not found lyrics";
      }
  };

  function normalizeTitle(api) {
      console.log(api);
      let title;
      let artist;

      // Lógica robusta para lidar com diferentes formatos de resposta da API
      if (api.last_played) {
          title = api.last_played.song;
          artist = api.last_played.artist;
      } else if (api.song && api.artist) {
          title = api.song;
          artist = api.artist;
      } else if (api.songtitle && api.songtitle.includes(" - ")) {
          title = api.songtitle.split(" - ")[0];
          artist = api.songtitle.split(" - ")[1];
      } else if (api.now_playing) {
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
          // Caso padrão: use as propriedades currentSong e currentArtist
          title = api.currentSong;
          artist = api.currentArtist;
      }

      return { title, artist };
  }

  function normalizeHistory(api) {
      let artist;
      let song;
      let history = api.song_history || api.history || api.songHistory || [];
      history = history.slice(0, 4);

      const historyNormalized = history.map((item) => {
          if (api.song_history) {
              artist = item.song.artist;
              song = item.song.title;
          } else if (api.history) {
              artist = sanitizeText(item.artist || "");
              song = sanitizeText(item.song || "");
          } else if (api.songHistory) {
              // Corrigido: Acessando as propriedades dentro do objeto 'song'
              artist = item.song.artist;
              song = item.song.title;
          }
          return {
              artist,
              song,
          };
      });

      return historyNormalized;
  }

  // --- [FUNÇÕES DE MANIPULAÇÃO DA INTERFACE] ------------------------

  function setAccentColor(image, colorThief) {
      const dom = document.querySelector(".app-player");
      const metaThemeColor = document.querySelector("meta[name=theme-color]");
      if (image.complete) {
          dom.setAttribute("style", `--accent: rgb(${colorThief.getColor(image)})`);
          metaThemeColor.setAttribute("content", `rgb(${colorThief.getColor(image)})`);
      } else {
          image.addEventListener("load", function () {
              dom.setAttribute("style", `--accent: rgb(${colorThief.getColor(image)})`);
              metaThemeColor.setAttribute("content", `rgb(${colorThief.getColor(image)})`);
          });
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
          pause(audio);
          const $iframe = document.createElement("iframe");
          $iframe.src = url;
          $iframe.allowFullscreen = true;
          modalBody.appendChild($iframe);
          closeButton.addEventListener("click", () => {
              $button.classList.remove("is-active");
              playerTvModal.classList.remove("is-active");
              modalBody.innerHTML = "";
          });
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

          // Remover a classe "is-active" de TODOS os botões de estação
          const allStationButtons = document.querySelectorAll(".station");
          allStationButtons.forEach((button) => {
              button.classList.remove("is-active");
          });

          // Adicionar a classe "active" ao botão atualmente pressionado
          $button.classList.add("is-active");
          activeButton = $button; // Atualizar o botão ativo

          setAssetsInPage(station);
          play(audio, station.stream_url);

          if (historyElement) {
              historyElement.innerHTML = "";
          }

          // Chamar a função de retorno (callback) se fornecida
          if (typeof callback === "function") {
              callback(station);
          }
      });

      return $button;
  }

  function createStations(stations, currentStation, audio, callback) {
      // add audio
      if (!stationsList) return;
      stationsList.innerHTML = "";
      stations.forEach(async (station, index) => {
          const $fragment = document.createDocumentFragment();
          const $button = createStreamItem(station, index, currentStation, audio, callback); // add audio
          $fragment.appendChild($button);
          stationsList.appendChild($fragment);
      });
  }

  // Função para gerar os links de compartilhamento
  function shareOnSocialMedia(event) {
    const link = event.target.closest('a'); // Obtém o link clicado
    const network = link.dataset.network;
    const radioName = link.dataset.radioName;
    const radioLogo = link.dataset.radioLogo;
    const radioUrl = link.dataset.radioUrl;

    let shareUrl;

    switch (network) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${radioUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=Estou ouvindo ${radioName}! ${radioUrl} &hashtags=radio,musica`; // Adicione hashtags relevantes
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=Estou ouvindo ${radioName}! Confira: ${radioUrl}`;
        break;
      default:
        shareUrl = radioUrl; 
    }

    window.open(shareUrl, '_blank'); 
  }

  // Adiciona o evento de clique aos botões de compartilhamento
  const socialButtons = document.querySelectorAll('.modal-social a');
  socialButtons.forEach(button => {
    button.addEventListener('click', shareOnSocialMedia);
  });

  function setAssetsInPage(station) {
      playerArtwork && (playerArtwork.src = station.album);
      playerCoverImg && (playerCoverImg.src = station.cover || station.album);
      stationName.textContent = station.name;
      stationDescription.textContent = station.description;
      playerTv && (playerTv.innerHTML = "");

      // Atualiza a imagem da capa do álbum no modal de compartilhamento
      const modalImage = document.querySelector(".player-modal-image");
      if (modalImage) {
          modalImage.src = station.album;
      }

      // Atualiza a imagem do logo da estação no player principal
      const stationLogo = document.querySelector(".player-station img");
      if (stationLogo) {
          stationLogo.src = station.album;
      }

      const socialLinks = document.querySelectorAll('.modal-social a');
      socialLinks.forEach(link => {
        link.dataset.radioName = station.name;
        link.dataset.radioLogo = station.logo;
        link.dataset.radioUrl = window.location.href; // Define a URL atual da página
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
              play();
          });
          navigator.mediaSession.setActionHandler("pause", () => {
              pause();
          });
      }
  }

  function currentSong(data) {
      const content = songNow;
      content.querySelector(".song-name").textContent = data.title;
      content.querySelector(".song-artist").textContent = data.artist;
      
      const modalSongName = document.querySelector('#modal-share .song-name'); 
      const modalSongArtist = document.querySelector('#modal-share .song-artist');
    
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

          // Cuando la imagen se haya cargado, insertarla en artwork
          $img.addEventListener("load", () => {
              artwork.appendChild($img);

              // eslint-disable-next-line no-undef
              const colorThief = new ColorThief();

              // Ejecutar cada vez que cambie la imagen
              // Crear una imagen temporal para evitar errores de CORS
              createTempImage($img.src).then((img) => {
                  setAccentColor(img, colorThief);
              });

              // Animar la imagen para desplazarla hacia la izquierda con transform
              setTimeout(() => {
                  artwork.querySelectorAll("img").forEach((img) => {
                      // Establecer la transición
                      img.style.transform = `translateX(${-img.width}px)`;

                      // Esperar a que la animación termine
                      img.addEventListener("transitionend", () => {
                          // Eliminar todas las imágenes excepto la última
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

              // Esperar a que la animación termine
              playerCoverImg.addEventListener("transitionend", () => {
                  playerCoverImg.src = data.cover || data.art;
                  playerCoverImg.style.opacity = 1;
              });
          });
      }
  }

  function setHistory(data, current, server) {
      if (!historyElement) return;
      historyElement.innerHTML = historyTemplate.replace("{{art}}", pixel).replace("{{song}}", "Cargando historial...").replace("{{artist}}", "Artista").replace("{{stream_url}}", "#not-found");
      if (!data) return;

      // max 10 items
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
      if (!lyricsContent) return;
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

  // --- [INICIALIZAÇÃO DA APLICAÇÃO] -------------------------------

  function initApp() {
      console.log('Função initApp chamada!');
      const json = window.streams || {};
      const stations = json.stations;
      currentStation = stations[0];

      // Define os assets iniciais da página
      setAssetsInPage(currentStation);

      // Define a URL da primeira estação no áudio
      audio.src = currentStation.stream_url;

      // Configura o evento de clique para o botão play/pause
      if (playButton !== null) {
          playButton.addEventListener("click", handlePlayPause);
      }

      // --- [CONTROLE DE VOLUME] --------------------------------------

      const range = document.querySelector(".player-volume");
      const rangeFill = document.querySelector(".player-range-fill");
      const rangeWrapper = document.querySelector(".player-range-wrapper");
      const rangeThumb = document.querySelector(".player-range-thumb");
      let currentVolume = parseInt(localStorage.getItem("volume") || "100", 10) || 100;

      // Altura do preenchimento
      function setRangeHeight(percent) {
        rangeFill.style.height = `${percent}%`;
      }

      // Posição vertical do thumb
      function setThumbPosition(percent) {
        const compensatedHeight = rangeWrapper.offsetHeight - rangeThumb.offsetHeight;
        const thumbPosition = (percent / 100) * compensatedHeight;
        rangeThumb.style.bottom = `${thumbPosition}px`; // Ajusta a posição a partir da base
      }

      // Atualiza o volume
      function updateVolume(value) {
        range.value = value;
        setRangeHeight(value);
        setThumbPosition(value);
        localStorage.setItem("volume", value);
        audio.volume = value / 100;
      }

      // Valor inicial
      if (range !== null) {
        updateVolume(currentVolume);

        // Escuta a alteração do controle
        range.addEventListener("input", (event) => {
          updateVolume(parseInt(event.target.value, 10));
        });

        // Escuta o clique no controle (barra de volume)
        rangeWrapper.addEventListener("mousedown", (event) => {
          if (event.target === rangeThumb) {
            return; // Ignora o clique se ocorreu no thumb
          }
          const rangeRect = range.getBoundingClientRect();
          const clickY = event.clientY - rangeRect.top; // Posição vertical do mouse
          let percent = (clickY / range.offsetHeight) * 100; // Calcula a porcentagem vertical
          percent = 100 - percent; // Inverte a porcentagem para a orientação vertical
          percent = Math.max(0, Math.min(100, percent));
          const value = Math.round((range.max - range.min) * (percent / 100)) + parseInt(range.min);
          updateVolume(value);
        });

        // Escuta o movimento do mouse no thumb
        rangeThumb.addEventListener("mousedown", () => {
          document.addEventListener("mousemove", handleThumbDrag);
        });

        // Atualiza a posição do thumb ao redimensionar a janela
        window.addEventListener('resize', () => {
          const currentPercent = range.value;
          setRangeHeight(currentPercent);
          setThumbPosition(currentPercent);
        });
      }

      // Move o thumb verticalmente e atualiza o volume
      function handleThumbDrag(event) {
        const rangeRect = rangeWrapper.getBoundingClientRect(); // Use rangeWrapper em vez de range
        const clickY = event.clientY - rangeRect.top;
        let percent = (clickY / rangeWrapper.offsetHeight) * 100; // Use rangeWrapper.offsetHeight
        percent = 100 - percent; // Inverte a porcentagem
        percent = Math.max(0, Math.min(100, percent));
        const value = Math.round((range.max - range.min) * (percent / 100)) + parseInt(range.min);
        updateVolume(value);
      }

      // Para de escutar o movimento do mouse
      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", handleThumbDrag);
      });

      // --- [FIM DO CONTROLE DE VOLUME] -----------------------------

      // Inicia o stream da rádio
      function initStream(currentStation) {
          // Cancela o timeout anterior, se houver
          if (timeoutId) clearTimeout(timeoutId);

          // Atualiza a estação atual se a URL for diferente
          if (currentStation && currentStation.stream_url !== audio.src) {
              audio.src = currentStation.stream_url;
          }

          const server = currentStation.server || "itunes";
          const jsonUri = currentStation.api || API_URL + currentStation.stream_url;

          // Busca informações da API
          fetch(jsonUri)
              .then((response) => response.json())
              .then(async (res) => {
                  // Extrai título e artista da resposta da API
                  const current = normalizeTitle(res);

                  // Só atualiza se a música for diferente
                  const title = current.title;
                  if (currentSongPlaying !== title) {
                      currentSongPlaying = title;
                      let artist = current.artist;
                      const art = currentStation.album;
                      const cover = currentStation.cover;
                      const historyData = normalizeHistory(res); // Obtém dados do histórico

                      // Verifica se título e artista são válidos antes de buscar dados adicionais
                      if (title && artist) {
                          const dataFrom = await getDataFrom({ artist, title, art, cover, server });

                          // Atualiza a interface do usuário
                          currentSong(dataFrom);
                          mediaSession(dataFrom);
                          setLyrics(dataFrom.artist, dataFrom.title);
                          setHistory(historyData, currentStation, server); // Define o histórico
                      } else {
                          console.log("Título ou artista inválidos. Pulando busca de dados adicionais.");
                      }
                  }
              })
              .catch((error) => console.error("Erro ao buscar dados da API:", error));

          // Define o timeout para a próxima atualização
          timeoutId = setTimeout(() => {
              initStream(currentStation);
          }, TIME_TO_REFRESH);
      }

      // Inicia o stream da primeira estação
      initStream(currentStation);

      // Cria a lista de estações
      createStations(stations, currentStation, audio, (station) => {
          currentStation = station; // Atualiza a estação atual ao trocar
          initStream(station); // Reinicia o stream com a nova estação
      });

      // Controles de próxima/anterior estação
      const nextStationButton = document.querySelector(".player-button-forward-step");
      const prevStationButton = document.querySelector(".player-button-backward-step");

      if (nextStationButton) {
          nextStationButton.addEventListener("click", () => {
              const next = stationsList.querySelector(".is-active").nextElementSibling;
              if (next) {
                  next.click();
              }
          });
      }

      if (prevStationButton) {
          prevStationButton.addEventListener("click", () => {
              const prev = stationsList.querySelector(".is-active").previousElementSibling;
              if (prev) {
                  prev.click();
              }
          });
      }
  }

  // --- [INICIALIZA A APLICAÇÃO QUANDO O DOM ESTIVER PRONTO] ---
  document.addEventListener("DOMContentLoaded", () => {
      document.body.classList.remove("preload");
      initApp();
  });
})();
