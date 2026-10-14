// Pedido: cada página de doce (bolos, brigadeiros, tortas, geladinhos) mostra os sabores com
// contador. O pedido fica guardado no navegador (localStorage), então soma entre as páginas,
// e a barra de baixo envia tudo junto, numa mensagem pronta, para o WhatsApp da Maju.
(function () {
  var WHATS = '5537998765591';
  var CHAVE = 'docemaju-pedido';
  var itens = Array.prototype.slice.call(document.querySelectorAll('.item[data-preco]'));
  var barra = document.getElementById('barra-pedido');
  var resumo = document.getElementById('pedido-resumo');
  var total = document.getElementById('pedido-total');
  var enviar = document.getElementById('pedido-enviar');
  var limpar = document.getElementById('pedido-limpar');
  var reais = function (v) { return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: v % 1 ? 2 : 0 }); };

  // pedido = { "Nome do item": { qtd: 2, preco: 12 }, ... }
  function ler() {
    try { return JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch (e) { return {}; }
  }
  function gravar(p) {
    try { localStorage.setItem(CHAVE, JSON.stringify(p)); } catch (e) { /* sem armazenamento: vale só nesta página */ }
  }
  var pedido = ler();

  function atualizar() {
    itens.forEach(function (li) {
      var q = pedido[li.dataset.nome] ? pedido[li.dataset.nome].qtd : 0;
      li.querySelector('output').textContent = q;
      li.classList.toggle('escolhido', q > 0);
    });
    if (!barra) return;
    var linhas = [], soma = 0, qtdTotal = 0;
    Object.keys(pedido).forEach(function (nome) {
      var it = pedido[nome];
      if (!it.qtd) return;
      soma += it.qtd * it.preco;
      qtdTotal += it.qtd;
      linhas.push('• ' + it.qtd + 'x ' + nome + ' (' + reais(it.qtd * it.preco) + ')');
    });
    barra.classList.toggle('visivel', qtdTotal > 0);
    document.body.classList.toggle('com-pedido', qtdTotal > 0);
    resumo.textContent = qtdTotal + (qtdTotal === 1 ? ' item no pedido' : ' itens no pedido');
    total.textContent = reais(soma);
    var msg = 'Oi Maju! Vim pelo site e quero encomendar:\n\n' + linhas.join('\n') +
      '\n\nTotal: ' + reais(soma) + '\n\nQual dia e horário fica bom?';
    enviar.href = 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(msg);
  }

  itens.forEach(function (li) {
    li.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var nome = li.dataset.nome;
      var atual = pedido[nome] ? pedido[nome].qtd : 0;
      var q = Math.max(0, Math.min(99, atual + (b.hasAttribute('data-mais') ? 1 : -1)));
      if (q) pedido[nome] = { qtd: q, preco: Number(li.dataset.preco) };
      else delete pedido[nome];
      gravar(pedido);
      atualizar();
    });
  });

  if (limpar) {
    limpar.addEventListener('click', function () {
      pedido = {};
      gravar(pedido);
      atualizar();
    });
  }

  // outra aba do navegador mudou o pedido
  window.addEventListener('storage', function (e) {
    if (e.key === CHAVE) { pedido = ler(); atualizar(); }
  });

  atualizar();
})();
