// Entrada suave ao rolar: o que está abaixo da primeira tela aparece subindo de leve quando
// chega na tela. Itens lado a lado (cartões, sabores, passos) entram um pouco depois do outro.
// Não roda com "reduzir movimento" ligado nem em navegador sem IntersectionObserver.
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var alvos = document.querySelectorAll(
    'main .secao h2, main .secao .rotulo, main .secao .apoio, .grade-produtos > *, .sabores > li, .passos > li, .contato, .instagram, .continua'
  );
  var obs = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('visto');
      obs.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  var dobra = window.innerHeight;
  alvos.forEach(function (el) {
    if (el.getBoundingClientRect().top < dobra) return; // já está na tela: fica como está
    var irmaos = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.setProperty('--i', Math.min(irmaos, 4));
    el.classList.add('reveal');
    obs.observe(el);
  });
})();
