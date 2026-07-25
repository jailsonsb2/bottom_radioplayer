/* ============================================================
   PWA do site: registra o service worker (sw.js), mostra o botão
   "Instalar app" no topo e avisa quando há versão nova.
   ------------------------------------------------------------
   Nada aqui é obrigatório para o player funcionar — é o site de
   demonstração virando aplicativo instalável. Para desativar,
   basta remover a linha <script src="pwa.js"> das páginas.

   Este arquivo é reexecutado a cada troca de página (navegação
   seamless do player), então tudo aqui é idempotente: o registro
   acontece uma vez só e o botão só é injetado se ainda não existir.
   ============================================================ */

(function () {
    "use strict";

    const SUPPORTED = "serviceWorker" in navigator &&
        (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1");

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text) node.textContent = text;
        return node;
    }

    // --- aviso de versão nova ---------------------------------------------
    // O SW novo fica "waiting" até a página liberar; o toast dá esse comando
    // e recarrega (recarregar interrompe o áudio, por isso é decisão do
    // visitante, não automática).

    function showUpdateToast(worker) {
        if (document.querySelector(".pwa-toast")) return;

        const toast = el("div", "pwa-toast");
        toast.setAttribute("data-seamless-keep", "");
        toast.appendChild(el("span", "pwa-toast-text", "Nova versão disponível"));

        const update = el("button", "pwa-toast-button", "Atualizar");
        update.type = "button";
        update.addEventListener("click", () => {
            worker.postMessage({ type: "SKIP_WAITING" });
            update.disabled = true;
        });
        toast.appendChild(update);

        const dismiss = el("button", "pwa-toast-close", "✕");
        dismiss.type = "button";
        dismiss.setAttribute("aria-label", "Dispensar");
        dismiss.addEventListener("click", () => toast.remove());
        toast.appendChild(dismiss);

        document.body.appendChild(toast);
    }

    if (SUPPORTED && !window.__pwaRegistered) {
        window.__pwaRegistered = true;

        // Na PRIMEIRA visita o clients.claim() do sw.js também dispara
        // controllerchange — sem esta marca, o site recarregaria sozinho
        // logo na chegada do visitante
        const hadController = !!navigator.serviceWorker.controller;

        navigator.serviceWorker.register("sw.js").then((registration) => {
            registration.addEventListener("updatefound", () => {
                const worker = registration.installing;
                if (!worker) return;
                worker.addEventListener("statechange", () => {
                    // "installed" com controller = atualização (não é a 1ª visita)
                    if (worker.state === "installed" && navigator.serviceWorker.controller) {
                        showUpdateToast(worker);
                    }
                });
            });
            if (registration.waiting && navigator.serviceWorker.controller) showUpdateToast(registration.waiting);
        }).catch(() => { /* sem service worker o site funciona igual */ });

        // o SW novo assumiu: recarrega uma vez para a página passar a usá-lo
        let reloading = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
            if (reloading || !hadController) return;
            reloading = true;
            location.reload();
        });
    }

    // --- botão "Instalar app" ---------------------------------------------
    // Chrome/Edge/Android: o evento beforeinstallprompt entrega o convite
    // nativo. iOS não tem esse evento — lá o botão explica o caminho manual
    // (Compartilhar › Adicionar à Tela de Início).

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;

    if (!window.__pwaPromptBound) {
        window.__pwaPromptBound = true;
        window.addEventListener("beforeinstallprompt", (event) => {
            event.preventDefault(); // o convite fica guardado para o nosso botão
            window.__pwaPrompt = event;
            mountInstallButton();
        });
        window.addEventListener("appinstalled", () => {
            window.__pwaPrompt = null;
            document.querySelectorAll(".header-install").forEach((button) => button.remove());
        });
    }

    function showIOSHelp() {
        if (document.querySelector(".pwa-ios-help")) return;

        const overlay = el("div", "news-modal pwa-ios-help");
        const card = el("article", "news-modal-card");

        const close = el("button", "news-modal-close", "✕");
        close.type = "button";
        close.setAttribute("aria-label", "Fechar");
        card.appendChild(close);

        const body = el("div", "news-modal-body");
        body.appendChild(el("h2", null, "Instalar no iPhone/iPad"));
        body.appendChild(el("p", null, "1. Toque no botão Compartilhar (o quadrado com a seta para cima), na barra do Safari."));
        body.appendChild(el("p", null, "2. Escolha “Adicionar à Tela de Início”."));
        body.appendChild(el("p", null, "3. Confirme em “Adicionar”. Pronto: a rádio abre como um aplicativo, em tela cheia."));
        card.appendChild(body);

        overlay.appendChild(card);
        document.body.appendChild(overlay);
        document.body.classList.add("news-modal-open");

        function dismiss() {
            overlay.remove();
            document.body.classList.remove("news-modal-open");
            document.removeEventListener("keydown", onKey);
        }
        function onKey(event) {
            if (event.key === "Escape") dismiss();
        }
        close.addEventListener("click", dismiss);
        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) dismiss();
        });
        document.addEventListener("keydown", onKey);

        requestAnimationFrame(() => overlay.classList.add("is-open"));
    }

    const INSTALL_ICON = '<svg viewBox="0 0 24 24"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"></path></svg>';

    // No Chrome/Edge o convite nativo é disparado aqui; no iOS abrimos as
    // instruções do "Adicionar à Tela de Início"
    async function runInstall(button) {
        if (window.__pwaPrompt) {
            window.__pwaPrompt.prompt();
            const choice = await window.__pwaPrompt.userChoice;
            window.__pwaPrompt = null;
            if (choice.outcome === "accepted") {
                document.querySelectorAll(".header-install, .listen-install").forEach((b) => b.remove());
            }
            return;
        }
        showIOSHelp();
    }

    function mountInstallButton() {
        if (isStandalone) return; // já está instalado
        if (!window.__pwaPrompt && !isIOS) return; // navegador não oferece instalação

        // 1) botão redondo no topo (só o ícone: o header já tem menu, clima,
        //    doação e tema — um rótulo aqui empurrava o menu para duas linhas)
        document.querySelectorAll(".site-header-inner").forEach((headerInner) => {
            if (headerInner.querySelector(".header-install")) return;

            const button = el("button", "header-install");
            button.type = "button";
            button.title = "Instalar a rádio como aplicativo";
            button.setAttribute("aria-label", "Instalar a rádio como aplicativo");
            button.innerHTML = INSTALL_ICON;
            button.addEventListener("click", () => runInstall(button));

            const extras = headerInner.querySelector(".header-extras");
            if (extras) extras.appendChild(button);
            else headerInner.insertBefore(button, headerInner.querySelector("#theme-toggle"));
        });

        // 2) botão com rótulo dentro do card "Como nos ouvir", que é
        //    justamente onde o visitante procura como ouvir a rádio
        document.querySelectorAll(".listen-card").forEach((card) => {
            if (card.querySelector(".listen-install")) return;

            const button = el("button", "listen-install");
            button.type = "button";
            const icon = el("span", "listen-install-icon");
            icon.innerHTML = INSTALL_ICON;
            button.appendChild(icon);
            button.appendChild(el("span", null, "Instalar como aplicativo"));
            button.addEventListener("click", () => runInstall(button));
            card.appendChild(button);
        });
    }

    mountInstallButton();
    // o card "Como nos ouvir" pode ser montado depois deste script (ou o
    // convite do navegador chegar mais tarde): tenta de novo no próximo tique
    setTimeout(mountInstallButton, 800);
})();
