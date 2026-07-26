# 🎵 Lettore Radio nella Barra in Basso — L'Audio Non Si Ferma Mentre il Visitatore Naviga

[![Demo dal vivo](https://img.shields.io/badge/▶_Demo_dal_vivo-online-brightgreen)](https://jailsonsb2.github.io/bottom_radioplayer/)
[![Nessuna chiave API](https://img.shields.io/badge/chiave_API-non_richiesta-orange)](#)
[![Componente drop--in](https://img.shields.io/badge/componente-2_tag_script-5A0FC8)](#)

[English](README.md) · [Português](README.pt.md) · [Español](README.es.md) · **Italiano**

**[▶ Apri la demo dal vivo](https://jailsonsb2.github.io/bottom_radioplayer/)** — premi play e naviga tra le pagine: la musica non si ferma.

### Descrizione

Un **lettore radio HTML5** fisso nella barra in basso che funziona da **componente JavaScript drop-in**: due tag script iniettano l'intero lettore (HTML, CSS e font) in qualunque pagina del tuo sito. Con la **navigazione seamless** attiva (impostazione predefinita), i clic sui link interni vengono intercettati e viene sostituito solo il contenuto della pagina — **l'audio continua a suonare senza alcuna interruzione mentre il visitatore naviga il sito**.

### Caratteristiche principali

- **Componente incorporabile** — nessun HTML da copiare; il lettore si inietta da solo.
- **Audio ininterrotto tra le pagine** — la navigazione interna sostituisce il contenuto senza ricaricare (SPA-lite), quindi lo stream non si interrompe mai.
- **Stato di riproduzione persistente** — emittente, play/pausa e volume sopravvivono ai ricaricamenti completi; la riproduzione riparte da sola (o al primo tocco, quando il browser blocca l'autoplay).
- **Riproduzione** con play/pausa, volume e cambio di emittente, più una dissolvenza morbida del volume in entrata e in uscita (niente "plop" dell'audio).
- **Indicatore di caricamento** mentre lo stream riempie il buffer e **riconnessione automatica** con backoff quando la rete cade.
- **Visualizzatore audio dinamico** che reagisce alla musica in tempo reale (spento su mobile per risparmiare batteria; in pausa quando la scheda è nascosta).
- **Barra di avanzamento del brano** a filo del bordo inferiore del dock, in due forme: una linea semplice o un'onda liquida che ondeggia sulla cresta del riempimento. È ritagliata dalla forma arrotondata del dock stesso, quindi segue l'angolo in ogni stile visivo, e compare solo quando l'API dei metadati comunica il tempo del brano.
- **Metadati di ciò che sta suonando** tramite l'API twj.es — la copertina arriva già pronta nel payload, con search.php + iTunes (solo musica) come riserva.
- **Elenco delle emittenti** con miniature e informazioni.
- **Cronologia dei brani** con copertine (fino a 10 tracce recenti).
- **Testi** tramite lyrics.ovh con LRCLIB come riserva — senza chiave API, con cache delle richieste.
- **Colore d'accento dinamico**, estratto dalla copertina in onda.
- **Modalità clip** — quando l'API dei metadati manda uno `youtubeId`, un mini-lettore fluttuante mostra il videoclip del brano in onda, nella stessa posizione; sopravvive al cambio di pagina.
- **TV dal vivo** — con `tv_url` in un'emittente, il pulsante "TV" apre il video in diretta in una finestra compatta e centrata (✕, clic fuori o Esc per chiudere).
- **Una sola sorgente audio alla volta** — avviare la radio mette in pausa qualsiasi video in riproduzione (video del sito, modalità clip) e chiude la TV dal vivo; fermare il video restituisce l'audio alla radio. La regola vive dentro `play()`, quindi ogni punto d'ingresso (pulsante del dock, cambio di emittente, schermata di blocco, ripresa automatica, `RadioPlayer.play()`) la rispetta.
- **Scorrimento per i titoli lunghi** — i nomi di brano e artista che non entrano scorrono invece di essere tagliati, e solo finché traboccano.
- **Condivisione social** per Facebook, Twitter e WhatsApp.
- **Media Session** (comandi della schermata di blocco / notifica) instradata sullo stesso percorso play/pausa del pulsante del dock, quindi la dissolvenza, lo stato salvato e la regola del video valgono anche lì.
- **Dock pensato prima per il telefono** — sul cellulare il titolo si prende lo spazio (niente colonna schiacciata da 24px): copertina · "in onda + emittente" · titolo · artista · un grande pulsante play, comandi extra in un pannello con etichette, e margine safe-area per gli iPhone. Una maniglia sopra il dock lo ritira dalla vista — anche su desktop. Toccare la copertina apre l'elenco delle emittenti.
- **Galleria fotografica** con lightbox (frecce, tastiera, swipe) nel sito demo.
- **Scheda "Come ascoltare"** con i badge ufficiali delle app (Google Play / App Store) e la frase per Alexa.
- **Installabile (PWA)** — manifest, icone, guscio offline tramite service worker e un pulsante "installa app".
- **Cinque linguaggi visivi** — glassmorphism (predefinito), claymorphism, minimalismo, liquid glass e spatial UI, scelti nel generatore e applicati al sito *e* al dock in un colpo solo.
- **Quattro lingue parlate** — portoghese, inglese, spagnolo e italiano, commutabili dall'intestazione. L'intera interfaccia segue, dock compreso; cambiare lingua non ferma l'audio.

### Schermate della demo

![Schermata della demo](https://i.imgur.com/hqlZY3Z.png)

![Schermata della demo](https://i.imgur.com/Eo0p377.png)

### Come metto il lettore nel mio sito? (Installazione)

1. **Scarica i file del lettore:**
   - Scarica o clona questo repository e ospita le cartelle `js/`, `css/` e `assets/` (più `config.js` e `custom.css`) sul tuo sito. `css/ui-styles.css` sta dentro `css/` ed è ciò che dà vita agli stili visivi alternativi.

2. **Configura le tue emittenti:**
   - Apri il file `config.js`.
   - Modifica la variabile `window.streams.stations` e sostituisci le emittenti di esempio con le tue.
   - Per ogni emittente compila: nome, hash, descrizione, URL di logo, copertina dell'album, immagine di sfondo, URL dello stream audio, social, link delle app ecc.
   - **Importante:** usa URL assolute (o percorsi validi da qualsiasi pagina) per le immagini, dato che il lettore può essere incorporato a qualunque profondità del sito.

3. **Aggiungi il componente a ogni pagina del sito:**

   ```html
   <script src="config.js"></script>
   <script src="js/radioplayer.js"></script>
   ```

   Tutto qui — il lettore si costruisce da solo in fondo alla pagina. Guarda `index.html` e `pagina2.html` per una demo di due pagine con la navigazione ininterrotta in funzione.

4. **(Facoltativo) Configura i contenuti del sito:**
   - Le sezioni del sito demo (slide di apertura, notizie con articolo completo, video di YouTube, **galleria fotografica**, palinsesto settimanale, squadra, **scheda "Come ascoltare"**, social, piè di pagina) vivono tutte in `content.js` e vengono renderizzate da `site.js` + `site.css`.
   - Modifica `content.js` a mano, **oppure usa il generatore visuale**: apri `gerador.html` in locale nel browser — arriva già compilato con i tuoi contenuti attuali, permette di aggiungere/togliere voci e genera un nuovo `content.js` da copiare o scaricare. Sostituisci il file nella radice del sito e hai finito.

> ⚠️ **Non pubblicare `gerador.html` sul sito in produzione.** È uno strumento locale di amministrazione — chiunque abbia l'URL potrebbe leggere l'intera configurazione e confezionare file sostitutivi. Tienilo sulla tua macchina (o cancellalo dal server dopo la pubblicazione).

### Installazione su WordPress

Esiste un plugin WordPress dedicato, mantenuto in un repository proprio: **[jailsonsb2/bottom-radioplayer-wordpress](https://github.com/jailsonsb2/bottom-radioplayer-wordpress)**. Avvolge questo componente in una vera pagina di impostazioni in wp-admin (schede Generale / Emittenti / Aspetto, ripetitore di emittenti con il selettore media nativo, modalità clip inclusa) — senza modificare alcun file. **Non è pubblicato su wordpress.org**; il repository collegato porta nella sua radice un `bottom-radioplayer.zip` pronto da caricare e le istruzioni complete di installazione.

### Navigazione seamless (l'audio non si ferma)

Attiva per impostazione predefinita. Quando il visitatore clicca un link interno, il componente scarica la pagina di destinazione, sostituisce il contenuto del `<body>` (tenendo vivo il lettore), aggiorna titolo e cronologia e riesegue gli script della nuova pagina. Link esterni, `target="_blank"`, link di `download` e àncore vengono lasciati stare.

- Per **disattivarla**, usa `seamless: false` in `config.js` (`window.streams.seamless = false`). La navigazione torna a ricaricare normalmente e il lettore riprende la riproduzione nella pagina successiva (al primo tocco, se il browser blocca l'autoplay).
- Per togliere un link specifico dall'intercettazione, aggiungici l'attributo `data-no-seamless`.
- I link a `/wp-admin/` e `wp-login.php` sono sempre esclusi automaticamente — l'area di amministrazione di WordPress non fa parte del layout del front-end.
- Le pagine dovrebbero condividere lo stesso layout/CSS di base; i fogli di stile trovati nell'`<head>` della pagina di destinazione vengono adottati automaticamente.

### Modalità clip (videoclip del brano in onda)

Se la tua API dei metadati restituisce un campo **`youtubeId`** (o `youtube_id`) nel payload, nel lettore compare da solo un pulsante **"Clip"** (per rilevamento — i siti la cui API non manda il campo non vedono mai il pulsante). Con la modalità clip attiva:

- il mini-lettore fluttuante si apre con il videoclip del brano in riproduzione (l'audio della radio va in pausa, quello del video prende il posto), **sincronizzato con la posizione della radio** (l'inizio viene dall'`elapsed` dell'API) invece di partire da zero;
- ogni cambio di brano si limita a sostituire l'embed con il nuovo clip;
- i brani senza clip chiudono il video e tornano alla radio automaticamente;
- il video continua a suonare attraverso la navigazione (`data-seamless-keep`), e la preferenza resta memorizzata;
- **la radio e un video non suonano mai insieme.** Qualunque strada accenda la radio — il pulsante del dock, il cambio di emittente, la schermata di blocco, la ripresa automatica dopo un ricaricamento, `RadioPlayer.play()` — mette prima in pausa gli embed di YouTube e chiude la TV dal vivo; mettere in pausa o finire il video restituisce l'audio alla radio. Mettere in pausa il clip *a mano* spegne anche la modalità clip, così il brano successivo non riapre il video sopra l'audio che hai appena scelto.

Il componente espone inoltre ogni traccia al sito: `window.RadioPlayer.currentTrack` e l'evento DOM `radioplayer:track` (`detail: { title, artist, art, cover, youtubeId }`), più `radioplayer:ready` quando il lettore si monta.

### Il lettore sul telefono

La maggior parte degli ascoltatori arriva dal telefono, quindi il dock è disegnato prima per quello schermo (`custom.css`, `@media (max-width: 991px)`):

- **Il titolo è padrone della larghezza.** Precedente/successivo cambiano *emittente*, quindi sul telefono escono dalla barra (tornano su tablet, ≥768px) e la copertina diventa la scorciatoia all'elenco delle emittenti — un distintivo a chevron lo segnala. Con una sola emittente in `config.js` il lettore riceve la classe `single-station` e quei pulsanti spariscono a ogni dimensione.
- **Riga di contesto** — `● IN ONDA · Nome dell'emittente` sopra il brano, così l'emittente resta riconoscibile mentre suona una traccia.
- **Comandi extra con etichetta** — il pulsante "…" apre un pannello a 3 colonne (TV, Clip, Cronologia, Condividi, Testo, Emittenti). Le icone mute dentro i cerchi non dicevano a nessuno cosa facessero; il volume resta fuori (comandano i tasti fisici, e iOS ignora `audio.volume`).
- **Maniglia per ritirarlo** (*a qualsiasi larghezza*) — la linguetta sopra il dock lo fa scivolare fuori schermo, lasciando la pagina interamente leggibile; l'audio continua e lo stato sopravvive alla navigazione seamless. Quanta strada deve fare viene da `--dock-bottom` su `#app-player .player`, quindi uno stile visivo che solleva o appiattisce il dock deve solo riscrivere quella variabile.
- **Safe area** — la distanza del dock usa `env(safe-area-inset-bottom)`, liberando la barra dei gesti dell'iPhone.
- Cronologia ed emittenti si aprono come un pannello a tutta larghezza sopra il dock, invece di un pannello stretto ancorato a destra.

### Galleria fotografica e "Come ascoltare"

Due sezioni del sito demo guidate dai contenuti, entrambe configurate in `content.js` (o in `gerador.html`):

```js
gallery: [
    { image: "photos/studio.jpg", thumb: "photos/studio-small.jpg", caption: "Studio principale" },
],
apps:   { android: "https://play.google.com/…", ios: "", alexa: "https://www.amazon.com/dp/…" },
listen: { title: "Come ascoltare", text: "…", alexaPhrase: "Alexa, metti La Mia Radio" },
```

- **Galleria** — una griglia adattiva nella sezione `#galeria`; cliccando una foto si apre un lightbox con frecce, tastiera (←/→/Esc), swipe e contatore. `thumb` è facoltativo (usalo per servire una miniatura più leggera); con l'elenco vuoto l'intera sezione si nasconde.
- **Come ascoltare** — una scheda nella sezione "Chi siamo" con i badge ufficiali degli store più la frase per Alexa (collegata alla tua skill quando `apps.alexa` è compilato). Gli stessi campi di `apps` alimentano i badge degli store nel piè di pagina e, quando sono vuoti, ripiegano su `window.streams.stations[0].apps` da `config.js`.

Altri due campi facoltativi vivono sotto `about` in `content.js`:

```js
about: {
    city: "São Paulo",                                        // distintivo meteo + mappa nel piè di pagina
    donation: { url: "https://ko-fi.com/…", label: "Sostienici" },
}
```

- **Distintivo meteo e mappa** — `about.city` comanda sia il piccolo distintivo della temperatura nell'intestazione sia la scheda mappa nella sezione "Chi siamo". Lascialo vuoto e spariscono entrambi. La mappa sta sotto il testo della storia, nella stessa colonna, così la sezione non lascia un buco accanto alle schede laterali.
- **Pulsante di donazione** — `about.donation` mette un pulsante in evidenza nell'intestazione. Una `url` vuota lo nasconde.

### Ordine delle sezioni (e sezioni vuote)

Le sezioni della home sono impilate nell'ordine elencato da `content.order` — metti in cima il contenuto più forte della tua radio. Lo stesso ordine viene applicato al menu dell'intestazione, in ogni pagina:

```js
order: ["galeria", "noticias", "videos", "programacao", "equipe", "contato"],
```

- I nomi validi sono esattamente quei sei. Le slide di apertura vengono sempre per prime e il piè di pagina sempre per ultimo, quindi non compaiono nell'elenco.
- Il campo è **facoltativo**: toglilo (o elenca solo un paio di nomi) e le sezioni mancanti mantengono l'ordine predefinito in coda — un `content.js` vecchio continua a renderizzare tutto.
- **Le sezioni senza contenuto si nascondono da sole**, titolo e voce di menu compresi. Una radio senza video non deve toccare `order` — basta un `videos: []` vuoto perché la sezione e la sua voce di menu spariscano.
- `gerador.html` ha un blocco **"Ordem das seções"** con pulsanti ↑/↓ che scrive quell'elenco al posto tuo.

### PWA (app installabile)

Il sito demo esce già installabile: `manifest.json`, icone in `assets/pwa/`, il service worker `sw.js` e `pwa.js` (che lo registra e mostra il pulsante **Installa app** nell'intestazione e dentro la scheda "Come ascoltare" — su iOS il pulsante spiega invece il percorso *Condividi › Aggiungi a schermata Home*, dato che Safari non ha un avviso di installazione).

- Richiede **HTTPS** (o localhost). GitHub Pages, Netlify e qualsiasi hosting con TLS funzionano al primo colpo.
- Regole di cache in `sw.js`: tutto ciò che è modificabile — pagine, CSS, JS, JSON — è **network-first**, così un visitatore online riceve sempre ciò che hai appena pubblicato e la cache risponde solo quando la rete cade (offline, o il tuo server giù); immagini, icone e font usano **stale-while-revalidate**; lo stream audio, le API dei metadati, YouTube, le mappe e il meteo sono di altra origine e **non vengono mai toccati**.
- Se una pagina sembra congelata su una versione vecchia, controlla che il server sia davvero in piedi: con quello giù, il service worker serve legittimamente la copia offline. Durante lo sviluppo tieni spuntato DevTools › Application › Service Workers › *Bypass for network*, oppure ricarica forzato (Ctrl+Shift+R), che salta del tutto il worker.
- Dopo aver pubblicato una nuova versione, alza il `const VERSION` in cima a `sw.js`: la vecchia cache viene scartata e chi ha il sito aperto riceve un avviso di "nuova versione disponibile".
- Sostituisci gli `assets/pwa/icon-*.png` e il nome/colori di `manifest.json` con quelli della tua radio. Per abbandonare del tutto la funzione, cancella la riga `<script src="pwa.js">` dalle pagine.

### Personalizzazione avanzata

- **Immagini:** sostituisci le immagini nella cartella `assets` con le tue.
- **Testi:** il pulsante "Testo" mostra il testo del brano in onda (lyrics.ovh con LRCLIB di riserva). Per spegnere la funzione, usa `lyrics: false` in `config.js` (`window.streams.lyrics = false`) — il pulsante e la finestra spariscono e non viene fatta alcuna richiesta di testi.
- **Effetti del dock (bargraph e barra di avanzamento):** due ornamenti, entrambi impostati in `config.js` ed entrambi accesi per impostazione predefinita.

  | campo | valori |
  |---|---|
  | `visualizer` | `true` (predefinito) / `false` — `false` non si limita a nascondere le barre: l'elemento non arriva nemmeno al DOM, quindi l'`AudioContext` non viene mai aperto. |
  | `progress` | `"wave"` (predefinito) / `"simple"` / `false`. `true` è ancora accettato come alias di `"wave"`, così i vecchi file di configurazione continuano a funzionare. |

  La barra di avanzamento compare solo quando l'API dei metadati comunica `now_playing.elapsed` e `now_playing.duration` — su uno stream puramente dal vivo resta invisibile, qualunque cosa tu scelga. Tra un sondaggio e l'altro (10 s di distanza) avanza con un orologio locale ancorato all'ultimo `elapsed` noto; senza quello farebbe uno scatto ogni dieci secondi. `"wave"` mette due strati di sinusoide SVG sulla cresta del riempimento, con lunghezze e velocità diverse — è lo sfasamento tra i due che si legge come liquido. `"simple"` lascia solo la linea e non costruisce alcun SVG né animazione.

  **Con il bargraph acceso, `"simple"` è l'abbinamento migliore:** l'onda e le barre si contendono la stessa fascia di 16 px alla base del dock. Tieni `"wave"` per i dock con `visualizer: false`.

  La barra è ritagliata da una cornice che eredita il `border-radius` del dock stesso, quindi segue l'angolo in ogni stile visivo — compresa la capsula da 999 px di `liquid`, dove rientrare la barra del valore del raggio l'avrebbe azzerata.

  Nel generatore questa è la sezione **"Efeitos do player"**, che scrive `theme: { visualizer, progress }` in `content.js`. Quella è solo una riserva: **`config.js` vince sempre**, perché un lettore incorporato nel sito di qualcun altro non ha alcun `content.js`.
- **Stile visivo (5 linguaggi di design):** l'insieme intero — sito *e* dock del lettore — cambia linguaggio visivo con un solo campo: `theme: { style: "clay" }` in `content.js`, oppure il selettore in cima a `gerador.html`, che mostra una miniatura viva di ogni opzione e ridipinge la pagina del generatore mentre clicchi.

  | `style` | Ha l'aria di |
  |---|---|
  | `glass` (predefinito) | Vetro smerigliato: sfocatura, bordi traslucidi, dock a isola fluttuante. L'aspetto originale — ometti il campo e non cambia nulla. |
  | `clay` | Claymorphism: superfici opache e morbide, angoli molto tondi, niente bordi, pulsanti che affondano alla pressione. |
  | `minimal` | Piatto: filetti da 1px, niente ombra né sfocatura, angoli retti, e il dock torna a essere una barra da un bordo all'altro. |
  | `liquid` | Liquid Glass: sfocatura più densa, luce speculare lungo i bordi, dock a capsula e un riflesso che lo attraversa mentre suona. |
  | `spatial` | Spatial UI: vetro neutro, ombre ambientali ampie, raggi maggiori e un dock che fluttua lontano dal bordo inferiore. |

  Tutto vive in `css/ui-styles.css` come uno strato di token `--ui-*` i cui valori predefiniti *sono* quelli del vetro attuale, applicato solo quando c'è un attributo `data-ui` sull'`<html>` — così un sito che non imposta mai `style` (o non carica mai il file) viene reso esattamente come prima. Ogni stile ha anche la propria tavolozza per il tema chiaro; il dock conserva sempre una superficie scura, dato che fluttua sopra l'intera pagina e porta testo bianco. Per ritoccarne uno, modifica il suo blocco di token in `css/ui-styles.css` — l'anteprima del generatore legge gli stessi token e segue.
- **Modalità sviluppatore (provare i 5 stili sul sito vero):** aggiungi `?dev=1` all'URL di qualsiasi pagina e compare un pulsante fluttuante 🎨 con i cinque linguaggi visivi; sceglierne uno ridipinge il sito *e* il dock all'istante. Esiste perché confrontare gli stili, altrimenti, significa rimettere mano a `content.js` e ricaricare per ciascuno. La scelta resta in `localStorage`, quindi sopravvive alla navigazione seamless e ai ricaricamenti completi — lo script di pre-avvio nell'`<head>` di ogni pagina la legge prima del primo disegno, altrimenti lo stile scelto tornerebbe a lampeggiare su quello configurato a ogni pagina. Spegnila dal pannello ("Sair do modo dev") o con `?dev=0`; entrambi liberano anche lo stile scelto, così la macchina non resta bloccata su un aspetto che non è quello vero del sito. Vive in `site.js` e inietta il proprio CSS **solo quando è accesa**, quindi il visitatore comune non scarica nulla in più — ed essendo per browser, nessun altro vede mai il pulsante. Il pannello è disegnato di proposito con colori fissi invece che con i token del sito, per non cambiare faccia insieme allo stile che stai giudicando.
- **Colore d'accento del sito:** basta un campo — `theme: { accent: "#4dd7e0", accentLight: "" }` in `content.js`, oppure il selettore di colore di `gerador.html` (anteprima dal vivo). Da quel solo colore `site.js` ricava il gradiente dei pulsanti (`--site-accent-2`), il bagliore dello sfondo (`--site-glow-1`), il colore del testo usato sopra l'accento (`--site-accent-ink`, scelto per luminanza WCAG perché le etichette restino leggibili) e l'accento iniziale del lettore (`--accent`, finché la copertina non impone il suo). Lascia `accentLight` vuoto e il tema chiaro scurisce il colore solo quanto il contrasto richiede.
- **Velocità di scorrimento del menu:** cliccare una voce di menu scivola fino alla sezione invece di saltare, e `theme: { scrollDuration: 1100 }` in `content.js` stabilisce quanto può durare il viaggio più lungo, in millisecondi (predefinito `1100`). La durata reale segue la distanza percorsa — una sezione vicina arriva in mezzo secondo, l'altro capo della pagina consuma l'intero budget — quindi alzala per uno scorrimento più lento e ragionato, abbassala per qualcosa di più asciutto. Questo esiste perché lo `scroll-behavior: smooth` del CSS da solo non ti dà alcun controllo sul tempo: lo sceglie il browser (Chrome spende circa 300 ms per *qualsiasi* distanza), il che su una pagina lunga si legge come uno stacco netto. `site.js` anima il viaggio per conto proprio, accelerando e frenando, e si ferma all'istante se il visitatore scorre a mano a metà strada. Chi chiede movimento ridotto nel proprio sistema salta sempre dritto alla sezione, qualunque sia il valore.
- **Lingue (pt / en / es / it):** l'intera interfaccia cambia lingua da un selettore nell'intestazione — titoli di sezione, menu, schede dei giorni, pulsanti, etichette di accessibilità, gli avvisi della PWA e i comandi del lettore stesso (Testo, Cronologia, Emittenti, Condividi). Tutto vive in `js/i18n.js`: un dizionario per lingua, più attributi `data-i18n` sull'HTML statico. **Viene tradotta solo la cornice** — le notizie, i programmi, i nomi della squadra e le slide che scrivi in `content.js` escono esattamente come li hai scritti, perché sono i tuoi contenuti, non il quadro. Il visitatore riceve la lingua del suo browser quando è una delle quattro, altrimenti il `theme: { language: "pt" }` predefinito di `content.js`; la sua scelta resta in `localStorage` e comanda da lì in poi. Cambiare lingua ridisegna la pagina attraverso la navigazione seamless del lettore, quindi **la musica non si ferma**. Anche le date seguono la lingua (`10 de julho de 2026` → `July 10, 2026`). Per aggiungere una quinta lingua, copia un blocco di dizionario in `js/i18n.js`, traduci i valori e aggiungi il codice a `LANGS`; qualsiasi chiave che ti sfugga ripiega sul portoghese invece di mostrare la chiave grezza. Togli `js/i18n.js` dalle pagine e il sito è byte per byte quello di prima, solo in portoghese — ogni chiamata `t()` porta con sé il testo originale come riserva.
- **Zoom al passaggio del mouse:** `theme: { hoverZoom: false }` in `content.js` spegne la parte di *crescita* dell'hover — le schede che si gonfiano un po' in `liquid` e `spatial`, la foto della galleria e la miniatura del video che zoomano dentro la loro cornice (quelle due avvengono in ogni stile), i pulsanti d'azione e i pulsanti del dock in `spatial`. Tutto il resto che fa l'hover resta: ogni stile conserva il proprio sollevamento, il bordo continua ad accendersi e l'ombra continua ad aprirsi, quindi la scheda continua a rispondere al puntatore. Funziona mettendo `data-hover-zoom="off"` sull'`<html>`; senza il campo non viene emesso nulla e il CSS è byte per byte quello di sempre. Chi chiede movimento ridotto nel proprio sistema non ottiene comunque alcuna crescita.
- **Colori (lettore):** personalizza i colori del lettore modificando il file `css/custom.css`.
- **Comportamento:** adatta il lettore modificando `js/radioplayer.js` (il componente). `js/main.js` è la vecchia versione non-componente, conservata come riferimento.
- **API JavaScript:** il componente espone `window.RadioPlayer` con `play()`, `pause()`, `toggle()`, l'elemento `audio` e il nodo DOM `root`.

### Progetti collegati

Altri lettori radio gratuiti dello stesso autore:

| Progetto | Stile |
|---|---|
| [**RadioPlayer**](https://github.com/jailsonsb2/RadioPlayer) | Lettore a pagina intera per qualsiasi stream (API di now playing gratuita, modalità clip di YouTube) |
| [**Radioplayer_api**](https://github.com/jailsonsb2/Radioplayer_api) | Lettore multi-emittente con **3 layout intercambiabili** |
| [**RadioPlayer-ZenoRadio**](https://github.com/jailsonsb2/RadioPlayer-ZenoRadio) | Lettore a pagina intera per gli stream **Zeno.FM** (metadati via SSE) |
| [**metadados**](https://github.com/jailsonsb2/metadados) | L'**API di now playing** gratuita (metadati ICY + iTunes + clip di YouTube) |
| [**bottom-radioplayer-wordpress**](https://github.com/jailsonsb2/bottom-radioplayer-wordpress) | **Plugin WordPress** che avvolge questo progetto — pagina di impostazioni, senza modificare file |

### Supporto e contributi

- Se hai domande o problemi, apri una issue nel repository GitHub.
- I contributi sono benvenuti! Manda pure pull request con miglioramenti, correzioni o nuove funzioni.
