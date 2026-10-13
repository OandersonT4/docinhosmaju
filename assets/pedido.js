// Cardápio: soma os itens escolhidos e monta a mensagem do pedido para o WhatsApp.
(function () {
  var WHATS = '5537998765591';
  var itens = Array.prototype.slice.call(document.querySelectorAll('.item[data-preco]'));
  var barra = document.getElementById('barra-pedido');
  var resumo = document.getElementById('pedido-resumo');
  var total = document.getElementById('pedido-total');
  var enviar = document.getElementById('pedido-enviar');
  var reais = function (v) { return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: v % 1 ? 2 : 0 }); };

  function atualizar() {
    var linhas = [], soma = 0, qtdTotal = 0;
    itens.forEach(function (li) {
      var q = Number(li.dataset.qtd || 0);
      li.querySelector('output').textContent = q;
      li.classList.toggle('escolhido', q > 0);
      if (!q) return;
      var preco = Number(li.dataset.preco);
      soma += q * preco;
      qtdTotal += q;
      linhas.push('• ' + q + 'x ' + li.dataset.nome + ' (' + reais(q * preco) + ')');
    });
    barra.classList.toggle('visivel', qtdTotal > 0);
    document.body.classList.toggle('com-pedido', qtdTotal > 0);
    resumo.textContent = qtdTotal + (qtdTotal === 1 ? ' item' : ' itens');
    total.textContent = reais(soma);
    var msg = 'Oi Maju! Vim pelo site e quero encomendar:\n\n' + linhas.join('\n') +
      '\n\nTotal: ' + reais(soma) + '\n\nQual dia e horário fica bom?';
    enviar.href = 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(msg);
  }

  itens.forEach(function (li) {
    li.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var q = Number(li.dataset.qtd || 0) + (b.hasAttribute('data-mais') ? 1 : -1);
      li.dataset.qtd = Math.max(0, Math.min(99, q));
      atualizar();
    });
  });

  // destaca a aba da categoria visível
  var abas = document.querySelectorAll('.filtros .aba');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        abas.forEach(function (a) { a.classList.toggle('ativa', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('.grade-cardapio > [id]').forEach(function (s) { obs.observe(s); });
  }
  atualizar();
})();
