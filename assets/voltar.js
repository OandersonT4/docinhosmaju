// Botão "Voltar": volta para a aba anterior do site; se a pessoa chegou direto (link, Google),
// vai para o Início.
(function () {
  var b = document.querySelector('[data-voltar]');
  if (!b) return;
  b.addEventListener('click', function (e) {
    if (document.referrer.indexOf(location.origin + '/') === 0 && history.length > 1) {
      e.preventDefault();
      history.back();
    }
  });
})();
