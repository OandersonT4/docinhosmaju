// Caixinha que se monta ao rolar (Início): a seção fica parada na tela enquanto a pessoa rola,
// os 4 brigadeiros entram um de cada vez nos lugares da caixinha e, no fim, a tampa com a
// corujinha fecha e aparece o preço. Só mexe em transform e opacity (leve no celular).
// Sem JS ou com "reduzir movimento" ligado, a caixinha aparece montada e aberta, sem a seção fixa.
(function () {
  var cx = document.querySelector('[data-caixinha]');
  if (!cx) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var doces = cx.querySelectorAll('.cx-doce');
  var tampa = cx.querySelector('.cx-tampa');
  var conta = cx.querySelector('[data-cx-conta]');
  var caixa = cx.querySelector('.cx-caixa');
  // de onde cada brigadeiro sai, em "tamanhos de caixinha" (x, y) e o giro inicial
  var saidas = [[-0.95, -0.75, -24], [0.95, -0.6, 18], [-0.85, 0.85, 14], [0.9, 0.95, -20]];
  var total = doces.length;

  cx.classList.add('cx-vivo');

  var entre = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var suave = function (t) { return 1 - Math.pow(1 - t, 3); }; // mesma ideia de --curva-suave
  var ultimo = -1, pedido = false;

  var desenhar = function () {
    pedido = false;
    var r = cx.getBoundingClientRect();
    var curso = cx.offsetHeight - window.innerHeight;
    var p = curso > 0 ? entre(-r.top / curso) : 1;
    var lado = caixa.offsetWidth;
    var dentro = 0;

    for (var i = 0; i < total; i++) {
      var ini = 0.06 + i * 0.15;
      var k = suave(entre((p - ini) / 0.2));
      var s = saidas[i % saidas.length];
      var falta = 1 - k;
      doces[i].style.transform = 'translate(' + (s[0] * lado * falta).toFixed(1) + 'px,' + (s[1] * lado * falta).toFixed(1) + 'px) rotate(' + (s[2] * falta).toFixed(1) + 'deg) scale(' + (1 + 0.12 * falta).toFixed(3) + ')';
      doces[i].style.opacity = (0.25 + 0.75 * entre(k * 2)).toFixed(3);
      if (k > 0.98) dentro++;
    }

    var t = suave(entre((p - 0.74) / 0.14));
    tampa.style.opacity = entre(t * 1.6).toFixed(3);
    tampa.style.transform = 'translateY(' + (-(1 - t) * 60).toFixed(1) + '%) scale(' + (1.06 - 0.06 * t).toFixed(3) + ')';

    var fechada = t > 0.98;
    cx.classList.toggle('cx-fechada', fechada);
    var estado = fechada ? total + 1 : dentro;
    if (estado !== ultimo && conta) {
      conta.textContent = fechada ? 'Caixinha fechada!' : dentro + ' de ' + total + ' brigadeiros';
      ultimo = estado;
    }
  };

  var pedir = function () { if (!pedido) { pedido = true; requestAnimationFrame(desenhar); } };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir);
  desenhar();
})();
