// Pedido: cada página de doce (bolos, brigadeiros, tortas, geladinhos) mostra os sabores com
// contador. O pedido fica guardado no navegador (localStorage), então soma entre as páginas,
// e a barra de baixo envia tudo junto, numa mensagem pronta, para o WhatsApp da Maju.
// Em /brigadeiros/ o montador deixa escolher os 4 sabores da caixinha; cada caixinha
// diferente vira um item do pedido ("Caixinha montada (2 chocolate, 2 morango)").
(function () {
  var WHATS = '5537998765591';
  var CHAVE = 'docemaju-pedido';
  var ENTREGA_GRATIS = 40; // pedidos a partir deste valor têm entrega grátis
  var BRINDE_A_CADA = 4; // a cada 4 geladinhos, 1 de brinde (a pessoa escolhe o sabor)
  var BRINDE = ' (brinde)';
  var barra = document.getElementById('barra-pedido');
  var resumo = document.getElementById('pedido-resumo');
  var total = document.getElementById('pedido-total');
  var frete = document.getElementById('pedido-frete');
  var enviar = document.getElementById('pedido-enviar');
  var limpar = document.getElementById('pedido-limpar');
  var montador = document.querySelector('[data-montador]');
  var caixinhas = document.querySelector('[data-caixinhas]');
  var brinde = document.querySelector('[data-brinde]');
  var reais = function (v) { return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: v % 1 ? 2 : 0 }); };

  // pedido = { "Nome do item": { qtd: 2, preco: 12 }, ... }
  function ler() {
    try { return JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch (e) { return {}; }
  }
  function gravar(p) {
    try { localStorage.setItem(CHAVE, JSON.stringify(p)); } catch (e) { /* sem armazenamento: vale só nesta página */ }
  }
  var pedido = ler();

  // brinde dos geladinhos: quantos a pessoa ganhou e quantos já escolheu
  function ehBrinde(nome) { return nome.slice(-BRINDE.length) === BRINDE; }
  function contarBrindes() {
    var comprados = 0, escolhidos = 0;
    Object.keys(pedido).forEach(function (nome) {
      if (nome.indexOf('Geladinho') !== 0) return;
      if (ehBrinde(nome)) escolhidos += pedido[nome].qtd; else comprados += pedido[nome].qtd;
    });
    return { comprados: comprados, ganhos: Math.floor(comprados / BRINDE_A_CADA), escolhidos: escolhidos };
  }
  // se a pessoa tirou geladinhos e perdeu brinde, tira os brindes que sobraram
  function ajustarBrindes() {
    var c = contarBrindes(), sobra = c.escolhidos - c.ganhos;
    if (sobra <= 0) return;
    Object.keys(pedido).forEach(function (nome) {
      if (sobra <= 0 || !ehBrinde(nome)) return;
      var tira = Math.min(sobra, pedido[nome].qtd);
      pedido[nome].qtd -= tira; sobra -= tira;
      if (!pedido[nome].qtd) delete pedido[nome];
    });
    gravar(pedido);
  }
  function desenharBrinde() {
    if (!brinde) return;
    var c = contarBrindes();
    var status = brinde.querySelector('[data-brinde-status]');
    if (!c.ganhos) {
      var falta = BRINDE_A_CADA - (c.comprados % BRINDE_A_CADA);
      status.textContent = 'Põe mais ' + falta + (falta === 1 ? ' geladinho' : ' geladinhos') + ' no pedido e escolhe 1 de brinde.';
    } else {
      status.textContent = 'Você ganhou ' + c.ganhos + (c.ganhos === 1 ? ' brinde' : ' brindes') + '! Escolha o sabor: ' + c.escolhidos + ' de ' + c.ganhos + '.';
    }
    brinde.classList.toggle('liberado', c.ganhos > 0);
    brinde.querySelectorAll('[data-brinde-sabor]').forEach(function (li) {
      var nome = li.dataset.brindeSabor + BRINDE;
      var q = pedido[nome] ? pedido[nome].qtd : 0;
      li.querySelector('output').textContent = q;
      li.classList.toggle('escolhido', q > 0);
      li.querySelector('[data-mais]').disabled = c.escolhidos >= c.ganhos;
      li.querySelector('[data-menos]').disabled = q === 0;
    });
  }

  // caixinhas montadas que já estão no pedido, cada uma com o seu contador
  function desenharCaixinhas() {
    if (!caixinhas) return;
    var prefixo = montador.dataset.nome + ' (';
    var lista = caixinhas.querySelector('[data-caixinhas-lista]');
    lista.textContent = '';
    Object.keys(pedido).forEach(function (nome) {
      if (nome.indexOf(prefixo) !== 0) return;
      var li = document.createElement('li');
      li.className = 'item sabor';
      li.dataset.nome = nome;
      li.dataset.preco = pedido[nome].preco;
      var img = document.createElement('img');
      img.className = 'sabor-foto';
      img.src = '/assets/img/brigadeiros.jpg?v=3';
      img.alt = ''; img.width = 88; img.height = 88;
      var texto = document.createElement('div');
      var h3 = document.createElement('h3');
      h3.textContent = 'Caixinha montada';
      var nota = document.createElement('p');
      nota.className = 'sabor-nota';
      nota.textContent = nome.slice(prefixo.length, -1);
      var preco = document.createElement('p');
      preco.className = 'preco';
      preco.innerHTML = '<span></span> <span class="preco-nota">a caixinha</span>';
      preco.firstChild.textContent = reais(pedido[nome].preco);
      texto.append(h3, nota, preco);
      var contador = document.createElement('span');
      contador.className = 'contador';
      contador.innerHTML = '<button type="button" data-menos>−</button><output aria-live="polite">0</output><button type="button" data-mais>+</button>';
      contador.firstChild.setAttribute('aria-label', 'Tirar 1 ' + nome);
      contador.lastChild.setAttribute('aria-label', 'Pôr 1 ' + nome);
      li.append(img, texto, contador);
      lista.appendChild(li);
    });
    caixinhas.hidden = !lista.children.length;
  }

  function atualizar() {
    ajustarBrindes();
    desenharCaixinhas();
    desenharBrinde();
    document.querySelectorAll('.item[data-preco]').forEach(function (li) {
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
      linhas.push('• ' + it.qtd + 'x ' + nome + (ehBrinde(nome) ? '' : ' (' + reais(it.qtd * it.preco) + ')'));
    });
    var gratis = soma >= ENTREGA_GRATIS;
    barra.classList.toggle('visivel', qtdTotal > 0);
    document.body.classList.toggle('com-pedido', qtdTotal > 0);
    resumo.textContent = '· ' + qtdTotal + (qtdTotal === 1 ? ' item' : ' itens');
    total.textContent = reais(soma);
    if (frete) {
      frete.textContent = gratis ? 'Entrega grátis!' : 'Faltam ' + reais(ENTREGA_GRATIS - soma) + ' para a entrega grátis';
      frete.classList.toggle('frete-gratis', gratis);
    }
    var msg = 'Oi Maju! Vim pelo site e quero encomendar:\n\n' + linhas.join('\n') +
      '\n\nTotal: ' + reais(soma) +
      (gratis ? '\nEntrega grátis (pedido a partir de ' + reais(ENTREGA_GRATIS) + ')' : '') +
      '\n\nQual dia e horário fica bom?';
    enviar.href = 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(msg);
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.item[data-preco] button');
    if (!b) return;
    var li = b.closest('.item');
    var nome = li.dataset.nome;
    var atual = pedido[nome] ? pedido[nome].qtd : 0;
    var q = Math.max(0, Math.min(99, atual + (b.hasAttribute('data-mais') ? 1 : -1)));
    if (q) pedido[nome] = { qtd: q, preco: Number(li.dataset.preco) };
    else delete pedido[nome];
    gravar(pedido);
    atualizar();
  });

  // montador da caixinha: escolhe os sabores até completar o tamanho, depois põe no pedido
  if (montador) {
    var tamanho = Number(montador.dataset.tamanho);
    var sabores = Array.prototype.slice.call(montador.querySelectorAll('[data-sabor]'));
    var conta = montador.querySelector('[data-montador-conta]');
    var pronto = montador.querySelector('[data-montador-pronto]');
    var escolha = {};
    var somaEscolha = function () { return sabores.reduce(function (s, li) { return s + (escolha[li.dataset.sabor] || 0); }, 0); };

    var atualizarMontador = function () {
      var n = somaEscolha();
      sabores.forEach(function (li) {
        var q = escolha[li.dataset.sabor] || 0;
        li.querySelector('output').textContent = q;
        li.classList.toggle('escolhido', q > 0);
        li.querySelector('[data-mais]').disabled = n >= tamanho;
        li.querySelector('[data-menos]').disabled = q === 0;
      });
      conta.textContent = n;
      montador.classList.toggle('completo', n === tamanho);
      pronto.disabled = n !== tamanho;
    };

    sabores.forEach(function (li) {
      li.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b) return;
        var s = li.dataset.sabor;
        var q = (escolha[s] || 0) + (b.hasAttribute('data-mais') ? 1 : -1);
        if (q < 0 || (q > (escolha[s] || 0) && somaEscolha() >= tamanho)) return;
        escolha[s] = q;
        atualizarMontador();
      });
    });

    pronto.addEventListener('click', function () {
      if (somaEscolha() !== tamanho) return;
      var partes = sabores
        .filter(function (li) { return escolha[li.dataset.sabor]; })
        .map(function (li) { return escolha[li.dataset.sabor] + ' ' + li.dataset.sabor; });
      var nome = montador.dataset.nome + ' (' + partes.join(', ') + ')';
      var atual = pedido[nome] ? pedido[nome].qtd : 0;
      pedido[nome] = { qtd: Math.min(99, atual + 1), preco: Number(montador.dataset.preco) };
      gravar(pedido);
      escolha = {};
      atualizarMontador();
      atualizar();
    });

    atualizarMontador();
  }

  if (brinde) {
    brinde.addEventListener('click', function (e) {
      var b = e.target.closest('[data-brinde-sabor] button');
      if (!b || b.disabled) return;
      var nome = b.closest('[data-brinde-sabor]').dataset.brindeSabor + BRINDE;
      var c = contarBrindes(), atual = pedido[nome] ? pedido[nome].qtd : 0;
      if (b.hasAttribute('data-mais')) {
        if (c.escolhidos >= c.ganhos) return;
        pedido[nome] = { qtd: atual + 1, preco: 0 };
      } else if (atual > 1) pedido[nome].qtd = atual - 1;
      else delete pedido[nome];
      gravar(pedido);
      atualizar();
    });
  }

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
