# 🎵 Reproductor de Radio en la Barra Inferior — El Audio No Se Detiene Mientras el Visitante Navega

[![Demo en vivo](https://img.shields.io/badge/▶_Demo_en_vivo-online-brightgreen)](https://jailsonsb2.github.io/bottom_radioplayer/)
[![Sin clave de API](https://img.shields.io/badge/clave_de_API-no_requerida-orange)](#)
[![Componente drop--in](https://img.shields.io/badge/componente-2_etiquetas_script-5A0FC8)](#)

[English](README.md) · [Português](README.pt.md) · **Español** · [Italiano](README.it.md)

**[▶ Abre la demo en vivo](https://jailsonsb2.github.io/bottom_radioplayer/)** — dale al play y navega entre las páginas: la música no se detiene.

### Descripción

Un **reproductor de radio HTML5** fijo en la barra inferior que funciona como **componente JavaScript drop-in**: dos etiquetas de script inyectan el reproductor entero (HTML, CSS y fuentes) en cualquier página de tu sitio. Con la **navegación seamless** activada (por defecto), los clics en enlaces internos se interceptan y solo se intercambia el contenido de la página — **el audio sigue sonando sin ninguna interrupción mientras el visitante navega por tu sitio**.

### Características principales

- **Componente embebible** — no hay HTML que copiar; el reproductor se inyecta solo.
- **Audio ininterrumpido entre páginas** — la navegación interna cambia el contenido sin recargar (SPA-lite), así que el stream nunca se corta.
- **Estado de reproducción persistente** — emisora, play/pausa y volumen sobreviven a las recargas completas; la reproducción se reanuda sola (o al primer toque, cuando el navegador bloquea el autoplay).
- **Reproducción** con play/pausa, volumen y cambio de emisora, más un fundido suave de volumen a la entrada y a la salida (sin el "pop" del audio).
- **Indicador de carga** mientras el stream llena el búfer y **reconexión automática** con backoff cuando la red se cae.
- **Visualizador de audio dinámico** que reacciona a la música en tiempo real (apagado en el móvil para ahorrar batería; pausado cuando la pestaña está oculta).
- **Barra de progreso de la pista** pegada al borde inferior del dock, en dos formas: una línea lisa o una ola líquida meciéndose sobre la cresta del relleno. La recorta la propia forma redondeada del dock, así que sigue la esquina en todos los estilos visuales, y solo aparece cuando la API de metadatos informa el tiempo de la canción.
- **Metadatos de lo que suena** vía la API twj.es — la carátula viene lista en el payload, con search.php + iTunes (solo música) como respaldo.
- **Lista de emisoras** con miniaturas e información.
- **Historial de canciones** con carátulas (hasta 10 pistas recientes).
- **Letras** vía lyrics.ovh con LRCLIB de respaldo — sin clave de API, con caché de las peticiones.
- **Color de acento dinámico**, extraído de la carátula que está al aire.
- **Modo clip** — cuando la API de metadatos manda un `youtubeId`, un mini-reproductor flotante muestra el videoclip de la canción al aire, en la misma posición; sobrevive al cambio de página.
- **TV en vivo** — con `tv_url` en una emisora, el botón "TV" abre el vídeo en directo en una ventana compacta y centrada (✕, clic fuera o Esc para cerrar).
- **Una fuente de audio a la vez** — darle play a la radio pausa cualquier vídeo que esté sonando (vídeos del sitio, modo clip) y cierra la TV en vivo; parar el vídeo le devuelve el sonido a la radio. La regla vive dentro de `play()`, así que todo punto de entrada (botón del dock, cambio de emisora, pantalla de bloqueo, reanudación automática, `RadioPlayer.play()`) la obedece.
- **Marquesina para títulos largos** — los nombres de canción y artista que no caben se deslizan en vez de cortarse, y solo mientras desbordan.
- **Compartir en redes** para Facebook, Twitter y WhatsApp.
- **Media Session** (controles de la pantalla de bloqueo / notificación) pasando por el mismo camino de play/pausa que el botón del dock, así que el fundido, el estado guardado y la regla del vídeo valen ahí también.
- **Dock pensado primero para el móvil** — en el teléfono el título se queda con el espacio (nada de una columna apretada de 24px): carátula · "en directo + emisora" · título · artista · un botón grande de play, controles extra en un panel con etiquetas, y margen de safe-area para iPhones. Un tirador encima del dock lo repliega fuera del camino — en escritorio también. Tocar la carátula abre la lista de emisoras.
- **Galería de fotos** con lightbox (flechas, teclado, swipe) en el sitio demo.
- **Tarjeta "Cómo escuchar"** con los sellos oficiales de las apps (Google Play / App Store) y la frase de Alexa.
- **Instalable (PWA)** — manifest, iconos, cáscara offline por service worker y un botón "instalar app".
- **Cinco lenguajes de diseño** — glassmorphism (por defecto), claymorphism, minimalismo, liquid glass y spatial UI, elegidos en el generador y aplicados al sitio *y* al dock a la vez.
- **Cuatro idiomas hablados** — portugués, inglés, español e italiano, cambiables desde la cabecera. La interfaz entera acompaña, incluido el dock; cambiar de idioma no detiene el audio.

### Capturas de la demo

![Captura de la demo](https://i.imgur.com/hqlZY3Z.png)

![Captura de la demo](https://i.imgur.com/Eo0p377.png)

### ¿Cómo pongo el reproductor en mi sitio? (Instalación)

1. **Descarga los archivos del reproductor:**
   - Descarga o clona este repositorio y aloja las carpetas `js/`, `css/` y `assets/` (más `config.js` y `custom.css`) en tu sitio. `css/ui-styles.css` viene dentro de `css/` y es lo que da vida a los estilos visuales alternativos.

2. **Configura tus emisoras:**
   - Abre el archivo `config.js`.
   - Edita la variable `window.streams.stations` y cambia las emisoras de ejemplo por las tuyas.
   - Para cada emisora rellena: nombre, hash, descripción, URLs de logo, carátula del álbum, imagen de fondo, URL del stream de audio, redes sociales, enlaces de las apps, etc.
   - **Importante:** usa URLs absolutas (o rutas válidas desde cualquier página) para las imágenes, ya que el reproductor puede embeberse a cualquier profundidad de tu sitio.

3. **Añade el componente a todas las páginas del sitio:**

   ```html
   <script src="config.js"></script>
   <script src="js/radioplayer.js"></script>
   ```

   Eso es todo — el reproductor se construye solo al pie de la página. Mira `index.html` y `pagina2.html` para una demo de dos páginas con la navegación ininterrumpida funcionando.

4. **(Opcional) Configura el contenido del sitio:**
   - Las secciones del sitio demo (diapositivas de portada, noticias con artículo completo, vídeos de YouTube, **galería de fotos**, programación semanal, equipo, **tarjeta "Cómo escuchar"**, redes sociales, pie) viven todas en `content.js` y las renderizan `site.js` + `site.css`.
   - Edita `content.js` a mano, **o usa el generador visual**: abre `gerador.html` localmente en el navegador — ya viene relleno con tu contenido actual, deja añadir/quitar elementos y genera un `content.js` nuevo para copiar o descargar. Sustituye el archivo en la raíz del sitio y listo.

> ⚠️ **No publiques `gerador.html` en tu sitio en producción.** Es una herramienta local de administración — cualquiera con la URL leería tu configuración entera y podría fabricar archivos de reemplazo. Déjalo en tu máquina (o bórralo del servidor tras publicar).

### Instalación en WordPress

Hay un plugin de WordPress dedicado, mantenido en su propio repositorio: **[jailsonsb2/bottom-radioplayer-wordpress](https://github.com/jailsonsb2/bottom-radioplayer-wordpress)**. Envuelve este componente en una página de ajustes de verdad en wp-admin (pestañas General / Emisoras / Apariencia, repetidor de emisoras con el selector de medios nativo, modo clip incluido) — sin editar ningún archivo. **No está publicado en wordpress.org**; el repositorio enlazado trae un `bottom-radioplayer.zip` listo para subir en su raíz y las instrucciones completas de instalación.

### Navegación seamless (el audio no se detiene)

Viene activada por defecto. Cuando el visitante hace clic en un enlace interno, el componente pide la página de destino, cambia el contenido del `<body>` (manteniendo vivo el reproductor), actualiza el título/historial y vuelve a ejecutar los scripts de la página nueva. Los enlaces externos, `target="_blank"`, los de `download` y las anclas se dejan en paz.

- Para **desactivarla**, usa `seamless: false` en `config.js` (`window.streams.seamless = false`). La navegación vuelve a recargar normalmente y el reproductor reanuda la reproducción en la página siguiente (al primer toque, si el navegador bloquea el autoplay).
- Para sacar un enlace concreto de la intercepción, ponle el atributo `data-no-seamless`.
- Los enlaces a `/wp-admin/` y `wp-login.php` se excluyen siempre de forma automática — el área de administración de WordPress no forma parte del layout del front-end.
- Las páginas deben compartir el mismo layout/CSS base; las hojas de estilo halladas en el `<head>` de la página de destino se adoptan automáticamente.

### Modo clip (videoclip de la canción actual)

Si tu API de metadatos devuelve un campo **`youtubeId`** (o `youtube_id`) en el payload, aparece solo un botón **"Clip"** en el reproductor (por detección — los sitios cuya API no manda el campo nunca ven el botón). Con el modo clip activado:

- el mini-reproductor flotante abre con el videoclip de la canción que está sonando (el audio de la radio se pausa, el del vídeo toma el relevo), **sincronizado con la posición de la radio** (el inicio viene del `elapsed` de la API) en vez de empezar de cero;
- cada cambio de canción solo cambia el embed por el clip nuevo;
- las canciones sin clip cierran el vídeo y vuelven a la radio automáticamente;
- el vídeo sigue sonando a través de la navegación (`data-seamless-keep`), y la preferencia queda guardada;
- **la radio y un vídeo nunca suenan a la vez.** Cualquier camino que encienda la radio — el botón del dock, cambiar de emisora, la pantalla de bloqueo, la reanudación automática tras una recarga, `RadioPlayer.play()` — primero pausa los embeds de YouTube y cierra la TV en vivo; pausar o terminar el vídeo le devuelve el audio a la radio. Pausar el clip *a mano* también apaga el modo clip, para que la siguiente canción no reabra el vídeo encima del audio que acabas de elegir.

El componente además expone cada pista al sitio: `window.RadioPlayer.currentTrack` y el evento DOM `radioplayer:track` (`detail: { title, artist, art, cover, youtubeId }`), más `radioplayer:ready` cuando el reproductor se monta.

### El reproductor en el móvil

La mayoría de los oyentes llega desde el teléfono, así que el dock está diseñado primero para esa pantalla (`custom.css`, `@media (max-width: 991px)`):

- **El título es dueño del ancho.** Anterior/siguiente cambian de *emisora*, así que en el móvil salen de la barra (vuelven en tableta, ≥768px) y la carátula se convierte en el atajo a la lista de emisoras — un distintivo de chevron lo señala. Con una sola emisora en `config.js` el reproductor recibe la clase `single-station` y esos botones desaparecen en cualquier tamaño.
- **Línea de contexto** — `● EN DIRECTO · Nombre de la emisora` encima de la canción, para que la emisora siga siendo identificable mientras suena una pista.
- **Controles extra con etiqueta** — el botón "…" abre un panel de 3 columnas (TV, Clip, Historial, Compartir, Letra, Emisoras). Los iconos mudos dentro de círculos no le decían a nadie qué hacían; el volumen se queda fuera (mandan los botones físicos, y iOS ignora `audio.volume`).
- **Tirador para replegar** (*en cualquier ancho*) — la pestaña encima del dock lo desliza fuera de pantalla, dejando la página entera legible; el audio sigue y el estado sobrevive a la navegación seamless. Cuánto tiene que recorrer sale de `--dock-bottom` en `#app-player .player`, así que un estilo visual que levante o aplane el dock solo tiene que reescribir esa variable.
- **Safe area** — la separación del dock usa `env(safe-area-inset-bottom)`, librando la barra de gestos del iPhone.
- El historial y las emisoras se abren como un panel a todo el ancho encima del dock, en vez de un panel estrecho pegado a la derecha.

### Galería de fotos y "Cómo escuchar"

Dos secciones del sitio demo movidas por contenido, ambas configuradas en `content.js` (o en `gerador.html`):

```js
gallery: [
    { image: "photos/studio.jpg", thumb: "photos/studio-small.jpg", caption: "Estudio principal" },
],
apps:   { android: "https://play.google.com/…", ios: "", alexa: "https://www.amazon.com/dp/…" },
listen: { title: "Cómo escuchar", text: "…", alexaPhrase: "Alexa, pon Mi Radio" },
```

- **Galería** — una rejilla adaptable en la sección `#galeria`; al hacer clic en una foto se abre un lightbox con flechas, teclado (←/→/Esc), swipe y contador. `thumb` es opcional (úsalo para servir una miniatura más ligera); con la lista vacía la sección entera se esconde.
- **Cómo escuchar** — una tarjeta en la sección "Sobre" con los sellos oficiales de las tiendas más la frase de Alexa (enlazada a tu skill cuando `apps.alexa` está relleno). Los mismos campos de `apps` alimentan los sellos de las tiendas en el pie y, cuando están vacíos, recurren a `window.streams.stations[0].apps` de `config.js`.

Otros dos campos opcionales viven bajo `about` en `content.js`:

```js
about: {
    city: "São Paulo",                                        // distintivo del tiempo + mapa del pie
    donation: { url: "https://ko-fi.com/…", label: "Apóyanos" },
}
```

- **Distintivo del tiempo y mapa** — `about.city` manda tanto en el distintivo de temperatura de la cabecera como en la tarjeta de mapa de la sección "Sobre". Déjalo vacío y desaparecen los dos. El mapa va debajo del texto de historia, en la misma columna, para que la sección no deje un hueco al lado de las tarjetas laterales.
- **Botón de donación** — `about.donation` pone un botón destacado en la cabecera. Una `url` vacía lo oculta.

### Orden de las secciones (y secciones vacías)

Las secciones de la portada se apilan en el orden que liste `content.order` — pon arriba el contenido más fuerte de tu emisora. El mismo orden se aplica al menú de la cabecera, en todas las páginas:

```js
order: ["galeria", "noticias", "videos", "programacao", "equipe", "contato"],
```

- Los nombres válidos son exactamente esos seis. Las diapositivas de portada van siempre primero y el pie siempre último, así que no se listan.
- El campo es **opcional**: quítalo (o lista solo un par de nombres) y las secciones que falten mantienen el orden por defecto al final — un `content.js` antiguo sigue renderizándolo todo.
- **Las secciones sin contenido se esconden solas**, título y enlace del menú incluidos. Una emisora sin vídeos no necesita tocar `order` — un `videos: []` vacío basta para que la sección y su entrada de menú desaparezcan.
- `gerador.html` tiene un bloque **"Ordem das seções"** con botones ↑/↓ que escribe esa lista por ti.

### PWA (app instalable)

El sitio demo ya sale instalable: `manifest.json`, iconos en `assets/pwa/`, el service worker `sw.js` y `pwa.js` (que lo registra y muestra el botón **Instalar app** en la cabecera y dentro de la tarjeta "Cómo escuchar" — en iOS el botón explica en su lugar el camino *Compartir › Añadir a pantalla de inicio*, ya que Safari no tiene aviso de instalación).

- Requiere **HTTPS** (o localhost). GitHub Pages, Netlify y cualquier hosting con TLS funcionan a la primera.
- Reglas de caché en `sw.js`: todo lo editable — páginas, CSS, JS, JSON — es **network-first**, así que un visitante en línea siempre recibe lo que acabas de publicar y la caché solo responde cuando la red falla (sin conexión, o tu servidor caído); imágenes, iconos y fuentes usan **stale-while-revalidate**; el stream de audio, las APIs de metadatos, YouTube, los mapas y el tiempo son de otro origen y **nunca se tocan**.
- Si una página parece congelada en una versión vieja, comprueba que el servidor esté realmente en pie: con él caído, el service worker sirve legítimamente la copia offline. Durante el desarrollo deja marcado DevTools › Application › Service Workers › *Bypass for network*, o recarga forzado (Ctrl+Shift+R), que se salta el worker entero.
- Tras publicar una versión nueva, sube el `const VERSION` de la cabecera de `sw.js`: la caché vieja se descarta y quien tenga el sitio abierto recibe un aviso de "nueva versión disponible".
- Cambia los `assets/pwa/icon-*.png` y el nombre/colores de `manifest.json` por los de tu emisora. Para soltar la función del todo, borra la línea `<script src="pwa.js">` de las páginas.

### Personalización avanzada

- **Imágenes:** cambia las imágenes de la carpeta `assets` por las tuyas.
- **Letras:** el botón "Letra" muestra la letra de la canción actual (lyrics.ovh con LRCLIB de respaldo). Para apagar la función, usa `lyrics: false` en `config.js` (`window.streams.lyrics = false`) — el botón y el modal desaparecen y no se hace ninguna petición de letras.
- **Efectos del dock (bargraph y barra de progreso):** dos adornos, ambos definidos en `config.js` y ambos encendidos por defecto.

  | campo | valores |
  |---|---|
  | `visualizer` | `true` (por defecto) / `false` — `false` no solo esconde las barras: el elemento ni llega al DOM, así que el `AudioContext` nunca se abre. |
  | `progress` | `"wave"` (por defecto) / `"simple"` / `false`. `true` se sigue aceptando como alias de `"wave"`, así que los archivos de config antiguos siguen funcionando. |

  La barra de progreso solo aparece cuando la API de metadatos informa `now_playing.elapsed` y `now_playing.duration` — en un stream en directo puro se queda invisible, elijas lo que elijas. Entre un sondeo y otro (10 s de separación) avanza con un reloj local anclado al último `elapsed` conocido; sin eso daría un salto cada diez segundos. `"wave"` pone dos capas de senoide SVG sobre la cresta del relleno, con longitudes y velocidades distintas — es el desfase entre ellas lo que se lee como líquido. `"simple"` deja solo la línea y no monta ningún SVG ni animación.

  **Con el bargraph encendido, `"simple"` es la mejor pareja:** la ola y las barras se disputan la misma franja de 16 px al pie del dock. Guarda `"wave"` para docks con `visualizer: false`.

  La barra la recorta un marco que hereda el propio `border-radius` del dock, así que sigue la esquina en todos los estilos visuales — incluida la cápsula de 999 px de `liquid`, donde meter la barra hacia dentro por el valor del radio la habría dejado en nada.

  En el generador esto es la sección **"Efeitos do player"**, que escribe `theme: { visualizer, progress }` en `content.js`. Eso es solo respaldo: **`config.js` siempre gana**, porque un reproductor embebido en el sitio de otra persona no tiene `content.js` ninguno.
- **Estilo visual (5 lenguajes de diseño):** el conjunto entero — sitio *y* dock del reproductor — cambia de lenguaje visual con un solo campo: `theme: { style: "clay" }` en `content.js`, o el selector de arriba de `gerador.html`, que muestra una miniatura viva de cada opción y repinta la página del generador conforme haces clic.

  | `style` | Se ve como |
  |---|---|
  | `glass` (por defecto) | Cristal esmerilado: desenfoque, bordes translúcidos, dock en isla flotante. El aspecto original — omite el campo y nada cambia. |
  | `clay` | Claymorphism: superficies opacas y mullidas, esquinas muy redondas, sin bordes, botones que se hunden al pulsarlos. |
  | `minimal` | Plano: filetes de 1px, sin sombra ni desenfoque, esquinas rectas, y el dock vuelve a ser una barra de lado a lado. |
  | `liquid` | Liquid Glass: desenfoque más espeso, brillo especular por los bordes, dock en cápsula y un reflejo que lo atraviesa mientras suena. |
  | `spatial` | Spatial UI: cristal neutro, sombras ambientales amplias, radios mayores y un dock que flota lejos del borde inferior. |

  Todo vive en `css/ui-styles.css` como una capa de tokens `--ui-*` cuyos valores por defecto *son* los del cristal actual, aplicada solo cuando hay un atributo `data-ui` en el `<html>` — así que un sitio que nunca define `style` (o nunca carga el archivo) se renderiza exactamente como antes. Cada estilo tiene además su propia paleta de tema claro; el dock conserva siempre una superficie oscura, ya que flota sobre la página entera y lleva texto blanco. Para afinar uno, edita su bloque de tokens en `css/ui-styles.css` — la vista previa del generador lee los mismos tokens y acompaña.
- **Modo desarrollador (probar los 5 estilos en el sitio de verdad):** añade `?dev=1` a la URL de cualquier página y aparece un botón flotante 🎨 con los cinco lenguajes visuales; elegir uno repinta el sitio *y* el dock al instante. Existe porque comparar estilos, de otro modo, significa reeditar `content.js` y recargar para cada uno. La elección se guarda en `localStorage`, así que sobrevive a la navegación seamless y a las recargas completas — el script de pre-arranque del `<head>` de cada página lo lee antes del primer pintado, si no el estilo elegido parpadearía de vuelta al configurado en cada página. Apágalo desde el panel ("Sair do modo dev") o con `?dev=0`; ambos también sueltan el estilo elegido, para que la máquina no se quede atascada en un aspecto que no es el real del sitio. Vive en `site.js` e inyecta su propio CSS **solo cuando está encendido**, así que el visitante corriente no descarga nada de más — y, al ser por navegador, nadie más ve el botón. El panel está estilizado a propósito con colores fijos en vez de tokens del sitio, para no cambiar de cara junto con el estilo que estás juzgando.
- **Color de acento del sitio:** un campo lo resuelve — `theme: { accent: "#4dd7e0", accentLight: "" }` en `content.js`, o el selector de color de `gerador.html` (vista previa en vivo). De ese único color `site.js` deriva el degradado de los botones (`--site-accent-2`), el resplandor del fondo (`--site-glow-1`), el color del texto usado sobre el acento (`--site-accent-ink`, elegido por luminancia WCAG para que las etiquetas sigan legibles) y el acento inicial del reproductor (`--accent`, hasta que la carátula imponga el suyo). Deja `accentLight` vacío y el tema claro oscurece el color solo lo que el contraste exija.
- **Velocidad del desplazamiento del menú:** hacer clic en un elemento del menú se desliza hasta la sección en vez de saltar, y `theme: { scrollDuration: 1100 }` en `content.js` fija cuánto puede durar el viaje más largo, en milisegundos (por defecto `1100`). La duración real acompaña a la distancia recorrida — una sección cercana llega en medio segundo, el otro extremo de la página gasta el presupuesto entero — así que súbelo para un deslizamiento más lento y deliberado, y bájalo para algo más seco. Esto existe porque el `scroll-behavior: smooth` del CSS por sí solo no te da control alguno del tiempo: lo elige el navegador (Chrome gasta unos 300 ms para *cualquier* distancia), lo que en una página larga se lee como un corte seco. `site.js` anima el viaje por su cuenta, acelerando y frenando, y se detiene al instante si el visitante hace scroll a mano a mitad de camino. Quien pide movimiento reducido en su sistema salta siempre directo a la sección, sea cual sea el valor.
- **Idiomas (pt / en / es / it):** la interfaz entera cambia de idioma desde un selector en la cabecera — títulos de sección, menú, pestañas de los días, botones, etiquetas de accesibilidad, los avisos de la PWA y los controles del propio reproductor (Letra, Historial, Emisoras, Compartir). Todo vive en `js/i18n.js`: un diccionario por idioma, más atributos `data-i18n` en el HTML estático. **Solo se traduce el marco** — las noticias, los programas, los nombres del equipo y las diapositivas que escribes en `content.js` salen exactamente como los escribiste, porque son tu contenido, no el marco. El visitante recibe el idioma de su navegador cuando es uno de los cuatro, si no el `theme: { language: "pt" }` por defecto de `content.js`; su elección se recuerda en `localStorage` y manda a partir de ahí. Cambiar de idioma vuelve a renderizar la página por la navegación seamless del reproductor, así que **la música no se detiene**. Las fechas siguen al idioma también (`10 de julho de 2026` → `July 10, 2026`). Para añadir un quinto idioma, copia un bloque de diccionario en `js/i18n.js`, traduce los valores y añade el código a `LANGS`; cualquier clave que se te escape cae al portugués en vez de mostrar la clave cruda. Quita `js/i18n.js` de las páginas y el sitio es byte a byte el mismo solo-en-portugués de antes — cada llamada `t()` lleva el texto original como respaldo.
- **Zoom al pasar el ratón:** `theme: { hoverZoom: false }` en `content.js` apaga la parte de *crecer* del hover — las tarjetas que se hinchan un poco en `liquid` y `spatial`, la foto de la galería y la miniatura de vídeo que hacen zoom dentro de su marco (esas dos ocurren en todos los estilos), los botones de acción y los botones del dock en `spatial`. Todo lo demás que hace el hover se queda: cada estilo conserva su propio levantamiento, el borde sigue encendiéndose y la sombra sigue abriéndose, así que la tarjeta sigue respondiendo al puntero. Funciona poniendo `data-hover-zoom="off"` en el `<html>`; sin el campo no se emite nada y el CSS es byte a byte el que siempre fue. Quien pide movimiento reducido en su sistema no obtiene crecimiento de todos modos.
- **Colores (reproductor):** personaliza los colores del reproductor editando el archivo `css/custom.css`.
- **Comportamiento:** adapta el reproductor editando `js/radioplayer.js` (el componente). `js/main.js` es la versión antigua, no-componente, conservada como referencia.
- **API JavaScript:** el componente expone `window.RadioPlayer` con `play()`, `pause()`, `toggle()`, el elemento `audio` y el nodo DOM `root`.

### Proyectos relacionados

Más reproductores de radio gratuitos del mismo autor:

| Proyecto | Estilo |
|---|---|
| [**RadioPlayer**](https://github.com/jailsonsb2/RadioPlayer) | Reproductor a página completa para cualquier stream (API de now playing gratuita, modo clip de YouTube) |
| [**Radioplayer_api**](https://github.com/jailsonsb2/Radioplayer_api) | Reproductor multiemisora con **3 diseños intercambiables** |
| [**RadioPlayer-ZenoRadio**](https://github.com/jailsonsb2/RadioPlayer-ZenoRadio) | Reproductor a página completa para streams de **Zeno.FM** (metadatos por SSE) |
| [**metadados**](https://github.com/jailsonsb2/metadados) | La **API de now playing** gratuita (metadatos ICY + iTunes + clips de YouTube) |
| [**bottom-radioplayer-wordpress**](https://github.com/jailsonsb2/bottom-radioplayer-wordpress) | **Plugin de WordPress** que envuelve este proyecto — página de ajustes, sin editar archivos |

### Soporte y contribuciones

- Si tienes dudas o problemas, abre una issue en el repositorio de GitHub.
- ¡Las contribuciones son bienvenidas! Manda pull requests con mejoras, correcciones o funciones nuevas.
