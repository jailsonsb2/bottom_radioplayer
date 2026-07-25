# 🎵 Bottom-Bar Radio Player — The Audio Never Stops While Visitors Browse

[![Live Demo](https://img.shields.io/badge/▶_Live_Demo-online-brightgreen)](https://jailsonsb2.github.io/bottom_radioplayer/)
[![No API Key](https://img.shields.io/badge/API_key-not_required-orange)](#)
[![Drop--in Component](https://img.shields.io/badge/component-2_script_tags-5A0FC8)](#)

**[▶ Try the live demo](https://jailsonsb2.github.io/bottom_radioplayer/)** — click play, then navigate between the pages: the music never stops.

### Description

A bottom-bar **HTML5 radio player** that works as a **drop-in JavaScript component**: two script tags inject the whole player (HTML, CSS and fonts) into any page of your site. With **seamless navigation** enabled (default), clicks on internal links are intercepted and only the page content is swapped — **the audio keeps playing without any interruption while visitors browse your site**.

> 🇧🇷 **Player de rádio fixo no rodapé que NÃO PARA quando o visitante navega pelo site.** Duas linhas de código em cada página e pronto: música tocando agora com capa, histórico, letra, clipe do YouTube sincronizado e um site demo completo (notícias, vídeos, programação, equipe) configurável sem tocar em código.

### Key Features:

- **Embeddable component** — no HTML to copy; the player injects itself.
- **Uninterrupted audio across pages** — internal navigation swaps content without reloading (SPA-lite), so the stream never stops.
- **Playback state persistence** — station, playing state and volume survive full page loads; playback auto-resumes (or resumes on the first tap when the browser blocks autoplay).
- **Audio playback** with play/pause, volume and station switching, plus smooth volume fade in/out (no audio "pop").
- **Loading spinner** while the stream buffers and **automatic reconnection** with backoff when the network drops.
- **Dynamic audio visualizer** that reacts to the music in real time (off on mobile to save battery; paused when the tab is hidden).
- **Now playing metadata** via the twj.es API — cover art comes straight from the API payload, with search.php + iTunes (music-only) as fallbacks.
- **Station list** with thumbnails and information.
- **Song history** with covers (up to 10 recently played tracks).
- **Lyrics** via lyrics.ovh with LRCLIB fallback — no API key required, with request caching.
- **Dynamic accent color** extracted from the current cover art.
- **Clip mode** — when the metadata API sends a `youtubeId`, a floating mini-player shows the music video of the song on air, seeked to the same position; it survives page navigation.
- **Live TV** — with `tv_url` in a station, a "TV" button opens the live video in a compact centered window (✕, click-outside or Esc to close).
- **One audio source at a time** — starting the radio pauses any playing video (site videos, clip mode) and closes the live TV; stopping the video brings the radio back. Enforced inside `play()`, so every entry point (dock button, station switch, lock screen, auto-resume, `RadioPlayer.play()`) obeys it.
- **Marquee for long titles** — song and artist names that don't fit slide instead of being cut off, and only while they overflow.
- **Integrated social sharing** for Facebook, Twitter, and WhatsApp.
- **Media Session integration** (lock screen / notification controls) routed through the same play/pause path as the dock button, so fade, persisted state and the video rule apply there too.
- **Mobile-first dock** — on phones the song title gets the space (no cramped 24px column): cover · "on air + station" · title · artist · one big play button, extra controls in a labeled sheet, a handle to collapse the dock out of the way, and safe-area padding for iPhones. Tapping the cover opens the station list.
- **Photo gallery** with lightbox (arrows, keyboard, swipe) on the demo site.
- **"How to listen" card** with the official app badges (Google Play / App Store) and the Alexa phrase.
- **Installable (PWA)** — manifest, icons, offline shell via service worker and an "install app" button.
- **Five design languages** — glassmorphism (default), claymorphism, minimalism, liquid glass and spatial UI, picked in the generator and applied to the site *and* the dock at once.

### Demo Screenshots

![Demo Screenshot](https://i.imgur.com/hqlZY3Z.png)

![Demo Screenshot](https://i.imgur.com/Eo0p377.png)

### How do I add the player to my website? (Installation)

1. **Download the player files:**
   - Download or clone this repository and host the `js/`, `css/` and `assets/` folders (plus `config.js` and `custom.css`) on your site. `css/ui-styles.css` ships inside `css/` and is what powers the alternative visual styles.

2. **Configure your radio stations:**
   - Open the `config.js` file.
   - Edit the `window.streams.stations` variable and replace the example stations with your own.
   - For each station, fill in: name, hash, description, URLs for logo, album art, background cover, audio stream URL, social links, app links, etc.
   - **Important:** use absolute URLs (or paths valid from every page) for the images, since the player can be embedded at any depth of your site.

3. **Add the component to every page of your site:**

   ```html
   <script src="config.js"></script>
   <script src="js/radioplayer.js"></script>
   ```

   That's it — the player builds itself at the bottom of the page. See `index.html` and `pagina2.html` for a working two-page demo of the uninterrupted navigation.

4. **(Optional) Configure the site content:**
   - The demo site sections (hero slides, news with full articles, YouTube videos, **photo gallery**, weekly schedule, team, **"how to listen" card**, social links, footer) all live in `content.js` and are rendered by `site.js` + `site.css`.
   - Edit `content.js` by hand, **or use the visual generator**: open `gerador.html` locally in your browser — it pre-fills the forms with your current content, lets you add/remove items, and generates a new `content.js` to copy or download. Replace the file at the root of the site and you're done.

> ⚠️ **Do not publish `gerador.html` to your production site.** It is a local admin tool — anyone with the URL could read your whole configuration and craft replacement files. Keep it on your machine (or delete it from the server after deploying).

### Installing on WordPress

There's a dedicated WordPress plugin, maintained in its own repository: **[jailsonsb2/bottom-radioplayer-wordpress](https://github.com/jailsonsb2/bottom-radioplayer-wordpress)**. It wraps this component with a proper wp-admin settings page (General / Stations / Appearance tabs, stations repeater with the native media picker, Clip Mode built in) — no file editing needed. It is **not published on wordpress.org**; the linked repo ships a ready-to-upload `bottom-radioplayer.zip` at its root and has the full install instructions.

### Seamless Navigation (audio never stops)

Enabled by default. When a visitor clicks an internal link, the component fetches the target page, swaps the `<body>` content (keeping the player alive), updates the title/history and re-runs the new page's scripts. External links, `target="_blank"`, `download` links and anchors are left alone.

- To **disable** it, set `seamless: false` in `config.js` (`window.streams.seamless = false`). Navigation then reloads normally and the player auto-resumes playback on the next page (on the first tap if the browser blocks autoplay).
- To exclude a specific link from interception, add the `data-no-seamless` attribute to it.
- Links to `/wp-admin/` and `wp-login.php` are always excluded automatically — WordPress's admin area isn't part of the site's front-end layout.
- Pages should share the same base layout/CSS; stylesheets found in the target page's `<head>` are adopted automatically.

### Clip Mode (music video of the current song)

If your now-playing metadata API returns a **`youtubeId`** field (or `youtube_id`) in the payload, a **"Clipe"** button automatically appears in the player (feature-detected — sites whose API doesn't send the field never see the button). With clip mode on:

- the floating mini-player opens with the music video of the song that is playing (radio audio pauses, video audio takes over), **synchronized with the radio position** (start = elapsed from the API) instead of starting from zero;
- every song change just swaps the embed to the new clip;
- songs without a clip close the video and fall back to the radio automatically;
- the video keeps playing across page navigation (`data-seamless-keep`), and the preference is remembered;
- **the radio and a video never play at the same time.** Any path that starts the radio — the dock button, switching station, the lock screen, auto-resume after a reload, `RadioPlayer.play()` — first pauses the YouTube embeds and closes the live TV; pausing or finishing the video hands the audio back to the radio. Pausing the clip *by hand* also turns clip mode off, so the next song doesn't reopen the video over the audio you just chose.

The component also exposes each track to the site: `window.RadioPlayer.currentTrack` and the `radioplayer:track` DOM event (`detail: { title, artist, art, cover, youtubeId }`), plus `radioplayer:ready` when the player mounts.

### The player on phones

Most listeners arrive on a phone, so the dock is laid out for that screen first (`custom.css`, `@media (max-width: 991px)`):

- **The title owns the width.** Previous/next switch *stations*, so on phones they leave the bar (they come back on tablets, ≥768px) and the cover becomes the shortcut to the station list — a chevron badge marks it. With a single station in `config.js` the player gets a `single-station` class and those buttons disappear at every size.
- **Context line** — `● AO VIVO · Station name` above the song, so the station is still identifiable while a track plays.
- **Extra controls with labels** — the "…" button opens a 3-column sheet (TV, Clip, History, Share, Lyrics, Stations). Silent icons in circles told nobody what they did; volume is left out (hardware buttons own it, and iOS ignores `audio.volume`).
- **Collapse handle** — the tab on top of the dock slides it off-screen so the page is fully readable; the audio keeps playing and the state survives seamless navigation.
- **Safe area** — the dock offset uses `env(safe-area-inset-bottom)`, clearing the iPhone home bar.
- History and stations open as a full-width sheet above the dock instead of a narrow right-anchored panel.

### Photo Gallery and "How to listen"

Two content-driven sections of the demo site, both configured in `content.js` (or in `gerador.html`):

```js
gallery: [
    { image: "photos/studio.jpg", thumb: "photos/studio-small.jpg", caption: "Main studio" },
],
apps:   { android: "https://play.google.com/…", ios: "", alexa: "https://www.amazon.com/dp/…" },
listen: { title: "How to listen", text: "…", alexaPhrase: "Alexa, play My Radio" },
```

- **Gallery** — a responsive grid in the `#galeria` section; clicking a photo opens a lightbox with arrows, keyboard (←/→/Esc), swipe and a counter. `thumb` is optional (use it to serve a lighter thumbnail); with an empty list the whole section hides itself.
- **How to listen** — a card in the "About" section with the official store badges plus the Alexa phrase (linked to your skill when `apps.alexa` is filled). The same `apps` entries feed the store badges in the footer, and fall back to `window.streams.stations[0].apps` from `config.js` when empty.

Two more optional fields live under `about` in `content.js`:

```js
about: {
    city: "São Paulo",                                        // weather chip + footer map
    donation: { url: "https://ko-fi.com/…", label: "Support us" },
}
```

- **Weather chip and map** — `about.city` drives both the little temperature chip in the header and the map card in the "About" section. Leave it empty and both disappear. The map sits under the history text, in the same column, so the section doesn't leave a hole beside the side cards.
- **Donation button** — `about.donation` puts a highlighted button in the header. Empty `url` hides it.

### Section order (and empty sections)

The home page sections are stacked in whatever order `content.order` lists them — put your station's strongest content on top. The same order is applied to the header menu, on every page:

```js
order: ["galeria", "noticias", "videos", "programacao", "equipe", "contato"],
```

- Valid names are exactly those six. The hero slides are always first and the footer always last, so they aren't listed.
- The field is **optional**: drop it (or list only a couple of names) and the missing sections keep the default order at the end — an older `content.js` still renders everything.
- **Sections with no content hide themselves**, title and menu link included. A station with no videos doesn't need to touch `order` — an empty `videos: []` is enough to make the section and its menu entry disappear.
- `gerador.html` has an **"Ordem das seções"** block with ↑/↓ buttons that writes this list for you.

### PWA (installable app)

The demo site ships as an installable app: `manifest.json`, icons in `assets/pwa/`, the `sw.js` service worker and `pwa.js` (which registers it and shows the **Install app** button in the header and inside the "How to listen" card — on iOS the button explains the *Share › Add to Home Screen* path instead, since Safari has no install prompt).

- Requires **HTTPS** (or localhost). GitHub Pages, Netlify and any host with TLS work out of the box.
- Caching rules in `sw.js`: everything editable — pages, CSS, JS, JSON — is **network-first**, so an online visitor always gets what you just published and the cache only answers when the network fails (offline, or your server down); images, icons and fonts use **stale-while-revalidate**; the audio stream, metadata APIs, YouTube, maps and weather are cross-origin and **never touched**.
- If a page looks frozen in an old version, check the server is actually up: with it down, the service worker legitimately serves the offline copy. During development keep DevTools › Application › Service Workers › *Bypass for network* checked, or hard-reload (Ctrl+Shift+R), which skips the worker entirely.
- After deploying a new version, bump `const VERSION` at the top of `sw.js`: the old cache is dropped and anyone with the site open gets a "new version available" toast.
- Replace `assets/pwa/icon-*.png` and the name/colors in `manifest.json` with your radio's own. To drop the feature entirely, delete the `<script src="pwa.js">` line from the pages.

### Advanced Customization

- **Images:** Replace the images in the `assets` folder with your own.
- **Lyrics:** the "Lyrics" button shows the current song's lyrics (lyrics.ovh with LRCLIB fallback). To turn the feature off, set `lyrics: false` in `config.js` (`window.streams.lyrics = false`) — the button and modal disappear and no lyrics request is ever made.
- **Visual style (5 design languages):** the whole thing — site *and* player dock — can switch design language with one field: `theme: { style: "clay" }` in `content.js`, or the picker at the top of `gerador.html`, which shows a live miniature of each option and repaints the generator page as you click.

  | `style` | Looks like |
  |---|---|
  | `glass` (default) | Frosted glass: blur, translucent borders, floating island dock. The original look — omit the field and nothing changes. |
  | `clay` | Claymorphism: opaque puffy surfaces, very round corners, no borders, buttons that squish when pressed. |
  | `minimal` | Flat: 1px hairlines, no shadow or blur, square corners, and the dock goes back to being an edge-to-edge bar. |
  | `liquid` | Liquid Glass: thicker blur, specular highlight along the edges, capsule-shaped dock and a sheen that crosses it while playing. |
  | `spatial` | Spatial UI: neutral glass, wide ambient shadows, larger radii, and a dock that floats clear of the bottom edge. |

  Everything lives in `css/ui-styles.css` as a layer of `--ui-*` tokens whose defaults *are* the current glass values, applied only when a `data-ui` attribute is present on `<html>` — so a site that never sets `style` (or never loads the file) renders exactly as before. Each style also has its own light-theme palette; the dock always keeps a dark surface, since it floats over the whole page and carries white text. To tune one, edit its token block in `css/ui-styles.css` — the generator's preview reads the same tokens and follows along.
- **Site accent color:** one field does it — `theme: { accent: "#4dd7e0", accentLight: "" }` in `content.js`, or the color picker in `gerador.html` (live preview). From that single colour `site.js` derives the button gradient (`--site-accent-2`), the background glow (`--site-glow-1`), the text colour used on top of the accent (`--site-accent-ink`, picked by WCAG luminance so labels stay readable) and the player's starting accent (`--accent`, until the cover art sets its own). Leave `accentLight` empty and the light theme darkens the colour only as much as contrast requires.
- **Colors (player):** Customize the player's colors by editing the `css/custom.css` file.
- **Behavior:** Adapt the player by editing `js/radioplayer.js` (the component). `js/main.js` is the legacy non-component version, kept for reference.
- **JavaScript API:** the component exposes `window.RadioPlayer` with `play()`, `pause()`, `toggle()`, the `audio` element and the `root` DOM node.

### Related Projects

More free radio players from the same author:

| Project | Style |
|---|---|
| [**RadioPlayer**](https://github.com/jailsonsb2/RadioPlayer) | Full-page player for any stream (free now-playing API, YouTube clip mode) |
| [**Radioplayer_api**](https://github.com/jailsonsb2/Radioplayer_api) | Multi-station player with **3 switchable layouts** |
| [**RadioPlayer-ZenoRadio**](https://github.com/jailsonsb2/RadioPlayer-ZenoRadio) | Full-page player for **Zeno.FM** streams (SSE metadata) |
| [**metadados**](https://github.com/jailsonsb2/metadados) | The free **now playing API** (ICY metadata + iTunes + YouTube clips) |
| [**bottom-radioplayer-wordpress**](https://github.com/jailsonsb2/bottom-radioplayer-wordpress) | **WordPress plugin** wrapper for this project — settings page, no file editing |

### Support and Contributions

- If you have any questions or issues, please open an issue in the GitHub repository.
- Contributions are welcome! Feel free to submit pull requests with improvements, bug fixes, or new features.
