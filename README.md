## HTML5 Single / Multi Radio Player for Website Footers

### Description

A bottom-bar radio player that works as a **drop-in JavaScript component**: two script tags inject the whole player (HTML, CSS and fonts) into any page of your site. With **seamless navigation** enabled (default), clicks on internal links are intercepted and only the page content is swapped — **the audio keeps playing without any interruption while visitors browse your site**.

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
- **Integrated social sharing** for Facebook, Twitter, and WhatsApp.
- **Media Session integration** (lock screen / notification controls).

### Demo Screenshots

![Demo Screenshot](https://i.imgur.com/M15Qv0t.png)

### Installation and Configuration

1. **Download the player files:**
   - Download or clone this repository and host the `js/`, `css/` and `assets/` folders (plus `config.js` and `custom.css`) on your site.

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
   - The demo site sections (hero slides, news with full articles, YouTube videos, weekly schedule, team, social links, footer) all live in `content.js` and are rendered by `site.js` + `site.css`.
   - Edit `content.js` by hand, **or use the visual generator**: open `gerador.html` locally in your browser — it pre-fills the forms with your current content, lets you add/remove items, and generates a new `content.js` to copy or download. Replace the file at the root of the site and you're done.

> ⚠️ **Do not publish `gerador.html` to your production site.** It is a local admin tool — anyone with the URL could read your whole configuration and craft replacement files. Keep it on your machine (or delete it from the server after deploying).

### Seamless Navigation (audio never stops)

Enabled by default. When a visitor clicks an internal link, the component fetches the target page, swaps the `<body>` content (keeping the player alive), updates the title/history and re-runs the new page's scripts. External links, `target="_blank"`, `download` links and anchors are left alone.

- To **disable** it, set `seamless: false` in `config.js` (`window.streams.seamless = false`). Navigation then reloads normally and the player auto-resumes playback on the next page (on the first tap if the browser blocks autoplay).
- To exclude a specific link from interception, add the `data-no-seamless` attribute to it.
- Pages should share the same base layout/CSS; stylesheets found in the target page's `<head>` are adopted automatically.

### Clip Mode (music video of the current song)

If your now-playing metadata API returns a **`youtubeId`** field (or `youtube_id`) in the payload, a **"Clipe"** button automatically appears in the player (feature-detected — sites whose API doesn't send the field never see the button). With clip mode on:

- the floating mini-player opens with the music video of the song that is playing (radio audio pauses, video audio takes over);
- every song change just swaps the embed to the new clip;
- songs without a clip close the video and fall back to the radio automatically;
- the video keeps playing across page navigation (`data-seamless-keep`), and the preference is remembered.

The component also exposes each track to the site: `window.RadioPlayer.currentTrack` and the `radioplayer:track` DOM event (`detail: { title, artist, art, cover, youtubeId }`), plus `radioplayer:ready` when the player mounts.

### Advanced Customization

- **Images:** Replace the images in the `assets` folder with your own.
- **Colors:** Customize the player's colors by editing the `css/custom.css` file.
- **Behavior:** Adapt the player by editing `js/radioplayer.js` (the component). `js/main.js` is the legacy non-component version, kept for reference.
- **JavaScript API:** the component exposes `window.RadioPlayer` with `play()`, `pause()`, `toggle()`, the `audio` element and the `root` DOM node.

### Support and Contributions

- If you have any questions or issues, please open an issue in the GitHub repository.
- Contributions are welcome! Feel free to submit pull requests with improvements, bug fixes, or new features.
