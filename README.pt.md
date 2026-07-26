# 🎵 Player de Rádio no Rodapé — O Áudio Não Para Enquanto o Visitante Navega

[![Demo ao vivo](https://img.shields.io/badge/▶_Demo_ao_vivo-online-brightgreen)](https://jailsonsb2.github.io/bottom_radioplayer/)
[![Sem chave de API](https://img.shields.io/badge/chave_de_API-dispensada-orange)](#)
[![Componente drop--in](https://img.shields.io/badge/componente-2_tags_script-5A0FC8)](#)

[English](README.md) · **Português** · [Español](README.es.md) · [Italiano](README.it.md)

**[▶ Abra a demo ao vivo](https://jailsonsb2.github.io/bottom_radioplayer/)** — dê play e navegue entre as páginas: a música não para.

### Descrição

Um **player de rádio HTML5** fixo no rodapé que funciona como **componente JavaScript drop-in**: duas tags de script injetam o player inteiro (HTML, CSS e fontes) em qualquer página do seu site. Com a **navegação seamless** ligada (padrão), os cliques em links internos são interceptados e só o conteúdo da página é trocado — **o áudio segue tocando sem nenhuma interrupção enquanto o visitante navega pelo site**.

### Principais recursos

- **Componente embutível** — não há HTML para copiar; o player se injeta sozinho.
- **Áudio ininterrupto entre páginas** — a navegação interna troca o conteúdo sem recarregar (SPA-lite), então o stream nunca para.
- **Estado da reprodução persistido** — estação, play/pause e volume sobrevivem a recarregamentos completos; a reprodução volta sozinha (ou no primeiro toque, quando o navegador bloqueia o autoplay).
- **Reprodução** com play/pause, volume e troca de estação, mais fade suave de volume na entrada e na saída (sem o "poc" do áudio).
- **Indicador de carregamento** enquanto o stream enche o buffer e **reconexão automática** com backoff quando a rede cai.
- **Visualizador de áudio dinâmico** que reage à música em tempo real (desligado no celular para poupar bateria; pausado quando a aba está oculta).
- **Barra de progresso da faixa** rente à borda de baixo do dock, em dois desenhos: um traço reto ou uma onda líquida balançando na crista do preenchimento. Ela é recortada pela própria forma arredondada do dock, então acompanha o canto em todos os estilos visuais, e só aparece quando a API de metadados informa o tempo da música.
- **Metadados do que está tocando** via a API twj.es — a capa vem pronta no payload, com search.php + iTunes (só música) como reserva.
- **Lista de estações** com miniaturas e informações.
- **Histórico de músicas** com capas (até 10 faixas recentes).
- **Letras** via lyrics.ovh com LRCLIB de reserva — sem chave de API, com cache das requisições.
- **Cor de destaque dinâmica**, extraída da capa que está no ar.
- **Modo clipe** — quando a API de metadados manda um `youtubeId`, um mini-player flutuante mostra o videoclipe da música no ar, na mesma posição; ele sobrevive à troca de página.
- **TV ao vivo** — com `tv_url` numa estação, o botão "TV" abre o vídeo ao vivo numa janela compacta e centralizada (✕, clique fora ou Esc para fechar).
- **Uma fonte de áudio por vez** — dar play na rádio pausa qualquer vídeo tocando (vídeos do site, modo clipe) e fecha a TV ao vivo; parar o vídeo devolve o som à rádio. A regra mora dentro do `play()`, então todo caminho de entrada (botão do dock, troca de estação, tela de bloqueio, retomada automática, `RadioPlayer.play()`) obedece.
- **Letreiro para títulos longos** — nome da música e do artista que não cabem deslizam em vez de serem cortados, e só enquanto transbordam.
- **Compartilhamento social** para Facebook, Twitter e WhatsApp.
- **Media Session** (controles da tela de bloqueio / notificação) passando pelo mesmo caminho de play/pause do botão do dock, então o fade, o estado salvo e a regra do vídeo valem lá também.
- **Dock pensado primeiro no celular** — no telefone o título fica com o espaço (nada de coluna espremida de 24px): capa · "ao vivo + estação" · título · artista · um botão grande de play, controles extras numa gaveta com rótulos, e respiro de safe-area para iPhones. Uma alça no topo do dock o recolhe para fora do caminho — no desktop também. Tocar na capa abre a lista de estações.
- **Galeria de fotos** com lightbox (setas, teclado, swipe) no site demo.
- **Cartão "Como ouvir"** com os selos oficiais dos apps (Google Play / App Store) e a frase da Alexa.
- **Instalável (PWA)** — manifest, ícones, casca offline por service worker e um botão "instalar app".
- **Cinco linguagens visuais** — glassmorphism (padrão), claymorphism, minimalismo, liquid glass e spatial UI, escolhidas no gerador e aplicadas ao site *e* ao dock de uma vez.
- **Quatro idiomas falados** — português, inglês, espanhol e italiano, trocáveis pelo cabeçalho. A interface inteira acompanha, incluindo o dock; trocar de idioma não para o áudio.

### Capturas de tela da demo

![Captura da demo](https://i.imgur.com/hqlZY3Z.png)

![Captura da demo](https://i.imgur.com/Eo0p377.png)

### Como coloco o player no meu site? (Instalação)

1. **Baixe os arquivos do player:**
   - Baixe ou clone este repositório e hospede as pastas `js/`, `css/` e `assets/` (mais o `config.js` e o `custom.css`) no seu site. O `css/ui-styles.css` vem dentro de `css/` e é ele que dá vida aos estilos visuais alternativos.

2. **Configure suas estações:**
   - Abra o arquivo `config.js`.
   - Edite a variável `window.streams.stations` e troque as estações de exemplo pelas suas.
   - Para cada estação preencha: nome, hash, descrição, URLs de logo, capa do álbum, capa de fundo, URL do stream de áudio, redes sociais, links dos apps etc.
   - **Importante:** use URLs absolutas (ou caminhos válidos a partir de qualquer página) para as imagens, já que o player pode ser embutido em qualquer profundidade do seu site.

3. **Adicione o componente a todas as páginas do site:**

   ```html
   <script src="config.js"></script>
   <script src="js/radioplayer.js"></script>
   ```

   É só isso — o player se monta no rodapé da página. Veja `index.html` e `pagina2.html` para uma demo de duas páginas com a navegação ininterrupta funcionando.

4. **(Opcional) Configure o conteúdo do site:**
   - As seções do site demo (slides do topo, notícias com matéria completa, vídeos do YouTube, **galeria de fotos**, programação da semana, equipe, **cartão "Como ouvir"**, redes sociais, rodapé) moram todas no `content.js` e são renderizadas pelo `site.js` + `site.css`.
   - Edite o `content.js` na mão, **ou use o gerador visual**: abra o `gerador.html` localmente no navegador — ele já vem preenchido com o seu conteúdo atual, deixa adicionar/remover itens e gera um `content.js` novo para copiar ou baixar. Substitua o arquivo na raiz do site e pronto.

> ⚠️ **Não publique o `gerador.html` no site em produção.** Ele é uma ferramenta local de administração — qualquer pessoa com a URL leria sua configuração inteira e poderia forjar arquivos de substituição. Deixe-o na sua máquina (ou apague do servidor depois de publicar).

### Instalando no WordPress

Existe um plugin de WordPress dedicado, mantido em repositório próprio: **[jailsonsb2/bottom-radioplayer-wordpress](https://github.com/jailsonsb2/bottom-radioplayer-wordpress)**. Ele embrulha este componente numa página de configurações de verdade no wp-admin (abas Geral / Estações / Aparência, repetidor de estações com o seletor de mídia nativo, modo clipe embutido) — sem editar arquivo nenhum. Ele **não está publicado no wordpress.org**; o repositório linkado traz um `bottom-radioplayer.zip` pronto para enviar na raiz e as instruções completas de instalação.

### Navegação seamless (o áudio não para)

Vem ligada por padrão. Quando o visitante clica num link interno, o componente busca a página de destino, troca o conteúdo do `<body>` (mantendo o player vivo), atualiza o título/histórico e reexecuta os scripts da página nova. Links externos, `target="_blank"`, links de `download` e âncoras são deixados em paz.

- Para **desligar**, use `seamless: false` no `config.js` (`window.streams.seamless = false`). A navegação volta a recarregar normalmente e o player retoma a reprodução na página seguinte (no primeiro toque, se o navegador bloquear o autoplay).
- Para tirar um link específico da interceptação, ponha o atributo `data-no-seamless` nele.
- Links para `/wp-admin/` e `wp-login.php` são sempre excluídos automaticamente — a área administrativa do WordPress não faz parte do layout do front-end.
- As páginas devem compartilhar o mesmo layout/CSS base; as folhas de estilo encontradas no `<head>` da página de destino são adotadas automaticamente.

### Modo clipe (videoclipe da música atual)

Se a sua API de metadados devolver um campo **`youtubeId`** (ou `youtube_id`) no payload, um botão **"Clipe"** aparece sozinho no player (por detecção — sites cuja API não manda o campo nunca veem o botão). Com o modo clipe ligado:

- o mini-player flutuante abre com o videoclipe da música que está tocando (o áudio da rádio pausa, o do vídeo assume), **sincronizado com a posição da rádio** (o início vem do `elapsed` da API) em vez de começar do zero;
- cada troca de música só troca o embed pelo clipe novo;
- músicas sem clipe fecham o vídeo e voltam para a rádio automaticamente;
- o vídeo continua tocando através da navegação (`data-seamless-keep`), e a preferência fica guardada;
- **a rádio e um vídeo nunca tocam ao mesmo tempo.** Qualquer caminho que ligue a rádio — o botão do dock, trocar de estação, a tela de bloqueio, a retomada automática depois de um reload, o `RadioPlayer.play()` — primeiro pausa os embeds do YouTube e fecha a TV ao vivo; pausar ou terminar o vídeo devolve o áudio à rádio. Pausar o clipe *na mão* também desliga o modo clipe, para a próxima música não reabrir o vídeo por cima do áudio que você acabou de escolher.

O componente ainda expõe cada faixa ao site: `window.RadioPlayer.currentTrack` e o evento DOM `radioplayer:track` (`detail: { title, artist, art, cover, youtubeId }`), mais o `radioplayer:ready` quando o player monta.

### O player no celular

A maioria dos ouvintes chega pelo telefone, então o dock é desenhado para essa tela primeiro (`custom.css`, `@media (max-width: 991px)`):

- **O título é dono da largura.** Anterior/próxima trocam de *estação*, então no celular eles saem da barra (voltam no tablet, ≥768px) e a capa vira o atalho para a lista de estações — um selo de chevron marca isso. Com uma única estação no `config.js` o player ganha a classe `single-station` e esses botões somem em qualquer tamanho.
- **Linha de contexto** — `● AO VIVO · Nome da estação` acima da música, para a estação continuar identificável enquanto uma faixa toca.
- **Controles extras com rótulo** — o botão "…" abre uma gaveta de 3 colunas (TV, Clipe, Histórico, Compartilhar, Letra, Estações). Ícones mudos dentro de círculos não diziam a ninguém o que faziam; o volume fica de fora (os botões físicos mandam nele, e o iOS ignora `audio.volume`).
- **Alça de recolher** (*em qualquer largura*) — a aba no topo do dock o desliza para fora da tela, deixando a página inteira legível; o áudio continua e o estado sobrevive à navegação seamless. O quanto ele precisa andar vem do `--dock-bottom` em `#app-player .player`, então um estilo visual que levante ou achate o dock só precisa reescrever essa variável.
- **Safe area** — o afastamento do dock usa `env(safe-area-inset-bottom)`, livrando a barra de gestos do iPhone.
- Histórico e estações abrem como uma gaveta de largura total acima do dock, em vez de um painel estreito colado à direita.

### Galeria de fotos e "Como ouvir"

Duas seções do site demo movidas a conteúdo, ambas configuradas no `content.js` (ou no `gerador.html`):

```js
gallery: [
    { image: "photos/studio.jpg", thumb: "photos/studio-small.jpg", caption: "Estúdio principal" },
],
apps:   { android: "https://play.google.com/…", ios: "", alexa: "https://www.amazon.com/dp/…" },
listen: { title: "Como ouvir", text: "…", alexaPhrase: "Alexa, toque Minha Rádio" },
```

- **Galeria** — uma grade responsiva na seção `#galeria`; clicar numa foto abre um lightbox com setas, teclado (←/→/Esc), swipe e contador. O `thumb` é opcional (use para servir uma miniatura mais leve); com a lista vazia a seção inteira se esconde.
- **Como ouvir** — um cartão na seção "Sobre" com os selos oficiais das lojas mais a frase da Alexa (linkada à sua skill quando `apps.alexa` está preenchido). Os mesmos campos de `apps` alimentam os selos das lojas no rodapé e, quando vazios, caem para `window.streams.stations[0].apps` do `config.js`.

Mais dois campos opcionais moram sob `about` no `content.js`:

```js
about: {
    city: "São Paulo",                                        // selo do tempo + mapa no rodapé
    donation: { url: "https://ko-fi.com/…", label: "Apoiar" },
}
```

- **Selo do tempo e mapa** — o `about.city` comanda tanto o selinho de temperatura no cabeçalho quanto o cartão de mapa na seção "Sobre". Deixe vazio e os dois somem. O mapa fica embaixo do texto de história, na mesma coluna, para a seção não deixar um buraco ao lado dos cartões laterais.
- **Botão de doação** — o `about.donation` põe um botão em destaque no cabeçalho. `url` vazia o esconde.

### Ordem das seções (e seções vazias)

As seções da home são empilhadas na ordem que o `content.order` listar — ponha em cima o conteúdo mais forte da sua rádio. A mesma ordem é aplicada ao menu do cabeçalho, em todas as páginas:

```js
order: ["galeria", "noticias", "videos", "programacao", "equipe", "contato"],
```

- Os nomes válidos são exatamente esses seis. Os slides do topo vêm sempre primeiro e o rodapé sempre por último, então não entram na lista.
- O campo é **opcional**: tire-o (ou liste só alguns nomes) e as seções que faltarem mantêm a ordem padrão no fim — um `content.js` antigo continua renderizando tudo.
- **Seções sem conteúdo se escondem sozinhas**, título e link do menu incluídos. Uma rádio sem vídeos não precisa mexer no `order` — um `videos: []` vazio já faz a seção e a entrada do menu desaparecerem.
- O `gerador.html` tem um bloco **"Ordem das seções"** com botões ↑/↓ que escreve essa lista para você.

### PWA (app instalável)

O site demo já sai instalável: `manifest.json`, ícones em `assets/pwa/`, o service worker `sw.js` e o `pwa.js` (que o registra e mostra o botão **Instalar app** no cabeçalho e dentro do cartão "Como ouvir" — no iOS o botão explica o caminho *Compartilhar › Adicionar à Tela de Início*, já que o Safari não tem prompt de instalação).

- Exige **HTTPS** (ou localhost). GitHub Pages, Netlify e qualquer host com TLS funcionam de primeira.
- Regras de cache no `sw.js`: tudo que é editável — páginas, CSS, JS, JSON — é **network-first**, então o visitante online sempre recebe o que você acabou de publicar e o cache só responde quando a rede falha (offline, ou seu servidor fora do ar); imagens, ícones e fontes usam **stale-while-revalidate**; o stream de áudio, as APIs de metadados, o YouTube, os mapas e o tempo são de outra origem e **nunca são tocados**.
- Se uma página parecer congelada numa versão antiga, confira se o servidor está mesmo no ar: com ele fora, o service worker legitimamente serve a cópia offline. Durante o desenvolvimento deixe marcado DevTools › Application › Service Workers › *Bypass for network*, ou recarregue forçado (Ctrl+Shift+R), o que pula o worker inteiro.
- Depois de publicar uma versão nova, incremente o `const VERSION` no topo do `sw.js`: o cache velho é descartado e quem estiver com o site aberto recebe um aviso de "nova versão disponível".
- Troque os `assets/pwa/icon-*.png` e o nome/cores do `manifest.json` pelos da sua rádio. Para largar o recurso de vez, apague a linha `<script src="pwa.js">` das páginas.

### Personalização avançada

- **Imagens:** troque as imagens da pasta `assets` pelas suas.
- **Letras:** o botão "Letra" mostra a letra da música atual (lyrics.ovh com LRCLIB de reserva). Para desligar o recurso, use `lyrics: false` no `config.js` (`window.streams.lyrics = false`) — o botão e o modal somem e nenhuma requisição de letra é feita.
- **Efeitos do dock (bargraph e barra de progresso):** dois enfeites, ambos definidos no `config.js` e ambos ligados por padrão.

  | campo | valores |
  |---|---|
  | `visualizer` | `true` (padrão) / `false` — `false` não só esconde as barras: o elemento nem chega ao DOM, então o `AudioContext` nunca é aberto. |
  | `progress` | `"wave"` (padrão) / `"simple"` / `false`. `true` ainda é aceito como apelido de `"wave"`, então arquivos de config antigos seguem funcionando. |

  A barra de progresso só aparece quando a API de metadados informa `now_playing.elapsed` e `now_playing.duration` — em stream ao vivo puro ela fica invisível, escolha o que escolher. Entre um poll e outro (10 s de intervalo) ela avança por um relógio local ancorado no último `elapsed` conhecido; sem isso ela pularia de dez em dez segundos. O `"wave"` põe duas camadas de senoide SVG na crista do preenchimento, com comprimentos e velocidades diferentes — é o descompasso entre elas que lê como líquido. O `"simple"` deixa só o traço e não monta SVG nem animação nenhuma.

  **Com o bargraph ligado, `"simple"` é a melhor dupla:** a onda e as barras disputam a mesma faixa de 16 px na base do dock. Guarde o `"wave"` para docks com `visualizer: false`.

  A barra é recortada por uma moldura que herda o próprio `border-radius` do dock, então ela acompanha o canto em todos os estilos visuais — inclusive a cápsula de 999 px do `liquid`, onde recuar a barra pelo valor do raio a teria zerado.

  No gerador isso é a seção **"Efeitos do player"**, que escreve `theme: { visualizer, progress }` no `content.js`. Aquilo é só reserva: **o `config.js` sempre ganha**, porque um player embutido no site de outra pessoa não tem `content.js` nenhum.
- **Estilo visual (5 linguagens de design):** o conjunto todo — site *e* dock do player — troca de linguagem visual com um campo só: `theme: { style: "clay" }` no `content.js`, ou o seletor no topo do `gerador.html`, que mostra uma miniatura viva de cada opção e repinta a página do gerador conforme você clica.

  | `style` | Cara de |
  |---|---|
  | `glass` (padrão) | Vidro fosco: desfoque, bordas translúcidas, dock em ilha flutuante. O visual original — omita o campo e nada muda. |
  | `clay` | Claymorphism: superfícies opacas e fofas, cantos bem redondos, sem bordas, botões que afundam ao serem apertados. |
  | `minimal` | Plano: fios de 1px, sem sombra nem desfoque, cantos retos, e o dock volta a ser uma barra de ponta a ponta. |
  | `liquid` | Liquid Glass: desfoque mais espesso, brilho especular pelas bordas, dock em cápsula e um reflexo que o atravessa enquanto toca. |
  | `spatial` | Spatial UI: vidro neutro, sombras ambientes amplas, raios maiores e um dock que flutua longe da borda de baixo. |

  Tudo mora no `css/ui-styles.css` como uma camada de tokens `--ui-*` cujos padrões *são* os valores de vidro de hoje, aplicada só quando existe um atributo `data-ui` no `<html>` — então um site que nunca define `style` (ou nunca carrega o arquivo) renderiza exatamente como antes. Cada estilo também tem sua própria paleta de tema claro; o dock mantém sempre uma superfície escura, já que ele flutua sobre a página inteira e carrega texto branco. Para ajustar um deles, edite o bloco de tokens dele no `css/ui-styles.css` — a prévia do gerador lê os mesmos tokens e acompanha.
- **Modo desenvolvedor (experimentar os 5 estilos no site de verdade):** acrescente `?dev=1` à URL de qualquer página e aparece um botão flutuante 🎨 listando as cinco linguagens visuais; escolher uma repinta o site *e* o dock na hora. Ele existe porque comparar estilos, de outro jeito, significa reeditar o `content.js` e recarregar para cada um deles. A escolha fica guardada no `localStorage`, então sobrevive à navegação seamless e a recarregamentos completos — o script de pré-boot no `<head>` de cada página o lê antes do primeiro paint, senão o estilo escolhido piscaria de volta ao configurado a cada página. Desligue pelo painel ("Sair do modo dev") ou com `?dev=0`; os dois também soltam o estilo escolhido, para a máquina não ficar presa num visual que não é o real do site. Ele mora no `site.js` e injeta o próprio CSS **só quando está ligado**, então o visitante comum não baixa nada a mais — e, por ser por navegador, mais ninguém vê o botão. O painel é estilizado de propósito com cores fixas em vez de tokens do site, para não mudar de cara junto com o estilo que você está julgando.
- **Cor de destaque do site:** um campo resolve — `theme: { accent: "#4dd7e0", accentLight: "" }` no `content.js`, ou o seletor de cor do `gerador.html` (prévia ao vivo). Dessa cor única o `site.js` deriva o degradê dos botões (`--site-accent-2`), o brilho do fundo (`--site-glow-1`), a cor do texto usada sobre o destaque (`--site-accent-ink`, escolhida por luminância WCAG para os rótulos continuarem legíveis) e a cor inicial do player (`--accent`, até a capa impor a sua). Deixe `accentLight` vazio e o tema claro escurece a cor só o quanto o contraste exigir.
- **Velocidade da rolagem do menu:** clicar num item do menu desliza até a seção em vez de saltar, e `theme: { scrollDuration: 1100 }` no `content.js` define quanto pode durar a viagem mais longa, em milissegundos (padrão `1100`). A duração real acompanha a distância percorrida — uma seção próxima chega em meio segundo, a outra ponta da página gasta o orçamento inteiro — então aumente para um deslize mais lento e deliberado, diminua para algo mais seco. Isto existe porque o `scroll-behavior: smooth` do CSS sozinho não te dá controle nenhum do tempo: o navegador escolhe (o Chrome gasta uns 300 ms para *qualquer* distância), o que numa página longa lê como um corte seco. O `site.js` anima a viagem por conta própria, acelerando e desacelerando, e para na hora se o visitante rolar na mão no meio do caminho. Quem pede movimento reduzido no sistema sempre salta direto para a seção, seja qual for o valor.
- **Idiomas (pt / en / es / it):** a interface inteira troca de idioma por um seletor no cabeçalho — títulos de seção, menu, abas dos dias da semana, botões, rótulos de acessibilidade, os avisos do PWA e os controles do próprio player (Letra, Histórico, Estações, Compartilhar). Tudo mora no `js/i18n.js`: um dicionário por idioma, mais atributos `data-i18n` no HTML estático. **Só a moldura é traduzida** — as notícias, os programas, os nomes da equipe e os slides que você escreve no `content.js` saem exatamente como você escreveu, porque são o seu conteúdo, não o quadro. O visitante recebe o idioma do navegador quando é um dos quatro, senão o padrão `theme: { language: "pt" }` do `content.js`; a escolha dele fica no `localStorage` e vale dali em diante. Trocar de idioma re-renderiza a página pela navegação seamless do player, então **a música não para**. As datas seguem o idioma também (`10 de julho de 2026` → `July 10, 2026`). Para acrescentar um quinto idioma, copie um bloco de dicionário no `js/i18n.js`, traduza os valores e adicione o código ao `LANGS`; qualquer chave que faltar cai no português em vez de mostrar a chave crua. Tire o `js/i18n.js` das páginas e o site fica byte a byte o mesmo só-em-português de antes — toda chamada `t()` carrega o texto original como reserva.
- **Zoom no hover:** `theme: { hoverZoom: false }` no `content.js` desliga a parte de *crescer* do hover — os cartões que incham um pouco no `liquid` e no `spatial`, a foto da galeria e a miniatura de vídeo que dão zoom dentro da moldura (essas duas acontecem em todos os estilos), os botões de ação e os botões do dock no `spatial`. Todo o resto que o hover faz continua: cada estilo mantém o próprio levantar, a borda segue acendendo e a sombra segue abrindo, então o cartão continua respondendo ao ponteiro. Funciona pondo `data-hover-zoom="off"` no `<html>`; sem o campo nada é emitido e o CSS é byte a byte o que sempre foi. Quem pede movimento reduzido no sistema não ganha crescimento de qualquer jeito.
- **Cores (player):** personalize as cores do player editando o arquivo `css/custom.css`.
- **Comportamento:** adapte o player editando o `js/radioplayer.js` (o componente). O `js/main.js` é a versão antiga, não-componente, mantida como referência.
- **API JavaScript:** o componente expõe `window.RadioPlayer` com `play()`, `pause()`, `toggle()`, o elemento `audio` e o nó DOM `root`.

### Projetos relacionados

Mais players de rádio gratuitos do mesmo autor:

| Projeto | Estilo |
|---|---|
| [**RadioPlayer**](https://github.com/jailsonsb2/RadioPlayer) | Player de página inteira para qualquer stream (API de now playing gratuita, modo clipe do YouTube) |
| [**Radioplayer_api**](https://github.com/jailsonsb2/Radioplayer_api) | Player multiestação com **3 layouts alternáveis** |
| [**RadioPlayer-ZenoRadio**](https://github.com/jailsonsb2/RadioPlayer-ZenoRadio) | Player de página inteira para streams da **Zeno.FM** (metadados por SSE) |
| [**metadados**](https://github.com/jailsonsb2/metadados) | A **API de now playing** gratuita (metadados ICY + iTunes + clipes do YouTube) |
| [**bottom-radioplayer-wordpress**](https://github.com/jailsonsb2/bottom-radioplayer-wordpress) | **Plugin de WordPress** que embrulha este projeto — página de configurações, sem editar arquivo |

### Suporte e contribuições

- Se tiver dúvidas ou problemas, abra uma issue no repositório do GitHub.
- Contribuições são bem-vindas! Fique à vontade para mandar pull requests com melhorias, correções ou recursos novos.
