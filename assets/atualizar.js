/* Aviso de versão nova (24/10/2026), igual ao do painel: quando o site está aberto como app da tela inicial
   (o celular guarda os arquivos antigos), confere ao abrir e ao voltar para o app se a página no servidor mudou.
   Se mudou, aparece "Tem uma versão nova" com o botão Atualizar, que baixa de novo a página e os arquivos dela,
   ignorando o que estava guardado, e recarrega. No navegador comum não aparece nada.
   Compara a data/etiqueta da página no servidor (Last-Modified/ETag) e a lista de CSS e JS com ?v=.
   Cores pelo próprio <script>: data-fundo, data-texto, data-botao, data-botao-texto, data-borda.
   Teste fora do app: ?versao=teste no endereço mostra o aviso. */
(function () {
  if (!window.fetch || !window.DOMParser) return;
  var app = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
  var teste = /[?&]versao=teste\b/.test(location.search);
  if (!app && !teste) return;

  var eu = document.currentScript || document.querySelector('script[src*="atualizar.js"]');
  var cor = function (k, padrao) { return (eu && eu.getAttribute("data-" + k)) || padrao; };
  var aqui = location.pathname;
  var ultima = 0;

  var arquivosDe = function (doc) {
    return [].slice.call(doc.querySelectorAll('script[src],link[rel="stylesheet"][href]'))
      .map(function (e) { return e.getAttribute("src") || e.getAttribute("href"); })
      .filter(function (u) { return u && u.charAt(0) === "/" && u.charAt(1) !== "/"; }).sort().join("|");
  };
  var marca = function (r) { return (r.headers.get("etag") || "") + "|" + (r.headers.get("last-modified") || ""); };
  var baixar = function (modo) {
    return fetch(aqui, { cache: modo, credentials: "same-origin" }).then(function (r) {
      if (!r.ok) throw new Error("http");
      return r.text().then(function (t) { return { marca: marca(r), doc: new DOMParser().parseFromString(t, "text/html") }; });
    });
  };

  var mostrar = function () {
    if (document.getElementById("novaVersao")) return;
    var st = document.createElement("style");
    st.textContent = "#novaVersao{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:300;display:flex;align-items:center;gap:12px;" +
      "width:min(440px,calc(100% - 32px));padding:12px 12px 12px 16px;border-radius:16px;background:" + cor("fundo", "#221a1a") + ";border:1px solid " + cor("borda", "rgba(240,100,42,.5)") + ";" +
      "box-shadow:0 18px 40px -12px rgba(0,0,0,.6);color:" + cor("texto", "#F1E7DA") + ";font:600 15px/1.35 system-ui,-apple-system,'Segoe UI',sans-serif}" +
      "#novaVersao span{flex:1;min-width:0}" +
      "#novaVersao button{flex:none;height:42px;padding:0 16px;border-radius:11px;border:0;background:" + cor("botao", "#C3121E") + ";color:" + cor("botao-texto", "#fff") + ";font:inherit;font-weight:700;cursor:pointer}" +
      "#novaVersao button.x{background:transparent;color:inherit;opacity:.7;padding:0 8px;font-size:1.4rem}";
    document.head.appendChild(st);
    var d = document.createElement("div"); d.id = "novaVersao"; d.setAttribute("role", "status");
    d.innerHTML = '<span>Tem uma versão nova do site.</span><button type="button" class="ok">Atualizar</button><button type="button" class="x" aria-label="Agora não">×</button>';
    d.querySelector(".x").onclick = function () { d.remove(); };
    d.querySelector(".ok").onclick = atualizar;
    document.body.appendChild(d);
  };

  var atualizar = function () {
    var d = document.getElementById("novaVersao"); if (d) d.querySelector("span").textContent = "Atualizando…";
    var limpar = ("caches" in window) ? caches.keys().then(function (ks) { return Promise.all(ks.map(function (k) { return caches.delete(k); })); }).catch(function () {}) : Promise.resolve();
    var sw = ("serviceWorker" in navigator) ? navigator.serviceWorker.getRegistrations().then(function (rs) { return Promise.all(rs.map(function (r) { return r.update().catch(function () {}); })); }).catch(function () {}) : Promise.resolve();
    var tudo = baixar("reload").then(function (n) {
      var us = [].slice.call(n.doc.querySelectorAll('script[src],link[rel="stylesheet"][href],link[rel="manifest"],link[rel="apple-touch-icon"]'))
        .map(function (e) { return e.getAttribute("src") || e.getAttribute("href"); })
        .filter(function (u) { return u && u.charAt(0) === "/" && u.charAt(1) !== "/"; });
      return Promise.all(us.map(function (u) { return fetch(u, { cache: "reload", credentials: "same-origin" }).catch(function () {}); }));
    }).catch(function () {});
    Promise.all([limpar, sw, tudo]).then(function () {
      var q = location.search.replace(/[?&]r=\d+/, "").replace(/^&/, "?");
      location.replace(aqui + (q ? q + "&" : "?") + "r=" + Date.now() + location.hash);
    });
  };

  var checar = function () {
    if (Date.now() - ultima < 60000 || document.getElementById("novaVersao")) return;
    ultima = Date.now();
    if (teste) { mostrar(); return; }
    // a cópia guardada contra a do servidor; e cada CSS/JS da tela contra o mesmo arquivo no servidor (o ?v= mudou?)
    Promise.all([baixar("force-cache"), baixar("no-store")]).then(function (v) {
      var novo = arquivosDe(v[1].doc), tela = arquivosDe(document).split("|"), velho = false;
      novo.split("|").forEach(function (u) {
        var base = u.split("?")[0];
        tela.forEach(function (t) { if (t.split("?")[0] === base && t !== u) velho = true; });
      });
      var mudou = (v[0].marca !== "|" && v[0].marca !== v[1].marca) || arquivosDe(v[0].doc) !== novo || velho;
      if (mudou) mostrar();
    }).catch(function () {});
  };

  // depois de atualizar, tira o ?r= do endereço
  if (/[?&]r=\d/.test(location.search)) {
    try { history.replaceState(null, "", aqui + location.search.replace(/[?&]r=\d+/, "").replace(/^&/, "?") + location.hash); } catch (e) {}
  }
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") checar(); });
  window.addEventListener("load", function () { setTimeout(checar, 3000); });
})();
