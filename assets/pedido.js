// Pedido: cada página de doce (bolos, brigadeiros, tortas, geladinhos) mostra os sabores com
// contador. O pedido fica guardado no navegador (localStorage), então soma entre as páginas,
// e a barra de baixo envia tudo junto, numa mensagem pronta, para o WhatsApp da Maju.
// Em /brigadeiros/ o montador deixa escolher os 4 sabores da caixinha; cada caixinha
// diferente vira um item do pedido ("Caixinha montada (2 chocolate, 2 morango)").
// O botão "Finalizar" abre o painel onde a pessoa escolhe retirada ou entrega (taxa de R$ 10,
// grátis a partir de R$ 40) e, na entrega, preenche o endereço buscando pelo CEP (ViaCEP).
(function () {
  var WHATS = '5537998765591';
  var CHAVE = 'docemaju-pedido';
  var ENTREGA_GRATIS = 40; // pedidos a partir deste valor têm entrega grátis
  var BRINDE_A_CADA = 4; // a cada 4 geladinhos, 1 de brinde (a pessoa escolhe o sabor)
  var BRINDE = ' (brinde)';
  var TAXA_ENTREGA = 10; // entrega abaixo de ENTREGA_GRATIS
  var CIDADE = 'Nova Serrana', UF = 'MG'; // só entregamos aqui
  var CHAVE_ENTREGA = 'docemaju-entrega';
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
    conta = { linhas: linhas, soma: soma, qtd: qtdTotal };
    var gratis = soma >= ENTREGA_GRATIS;
    barra.classList.toggle('visivel', qtdTotal > 0);
    document.body.classList.toggle('com-pedido', qtdTotal > 0);
    resumo.textContent = '· ' + qtdTotal + (qtdTotal === 1 ? ' item' : ' itens');
    total.textContent = reais(soma);
    if (frete) {
      frete.textContent = gratis ? 'Entrega grátis!' : 'Faltam ' + reais(ENTREGA_GRATIS - soma) + ' para a entrega grátis';
      frete.classList.toggle('frete-gratis', gratis);
    }
    enviar.href = linkWhats();
    desenharFinalizar();
  }

  // ---------- finalizar: retirada ou entrega, com busca de endereço pelo CEP ----------
  var conta = { linhas: [], soma: 0, qtd: 0 };
  var fin = null; // o painel (<dialog>), criado no primeiro clique em "Finalizar"
  var dados = (function () { try { return JSON.parse(localStorage.getItem(CHAVE_ENTREGA)) || {}; } catch (e) { return {}; } })();
  var cepStatus = '', cepCidade = ''; // cepStatus: buscando | ok | fora | invalido | erro
  function gravarDados() {
    try { localStorage.setItem(CHAVE_ENTREGA, JSON.stringify(dados)); } catch (e) { /* sem armazenamento */ }
  }
  function semAcento(t) { return (t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
  function soNumeros(t) { return (t || '').replace(/\D/g, ''); }
  function formatarCep(t) { var v = soNumeros(t).slice(0, 8); return v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v; }
  function taxa() { return dados.modo === 'entrega' && conta.soma < ENTREGA_GRATIS ? TAXA_ENTREGA : 0; }

  function mensagem() {
    var t = taxa(), m = 'Oi Maju! Vim pelo site e quero encomendar:\n\n' + conta.linhas.join('\n') + '\n\n';
    if (dados.modo === 'entrega') {
      m += 'Doces: ' + reais(conta.soma) + '\nEntrega: ' + (t ? reais(t) : 'grátis') + '\n*Total: ' + reais(conta.soma + t) + '*\n\n' +
        '*Entrega* em:\n' + (dados.rua || '') + ', ' + (dados.numero || '') + (dados.complemento ? ' - ' + dados.complemento : '') +
        '\n' + (dados.bairro || '') + ' - ' + CIDADE + '/' + UF + '\nCEP ' + formatarCep(dados.cep);
    } else {
      m += '*Total: ' + reais(conta.soma) + '*';
      if (dados.modo === 'retirada') m += '\n\n*Retirada* (combinar o local com você)';
    }
    if (dados.nome) m += '\n\nNome: ' + dados.nome;
    return m + '\n\nQual dia e horário fica bom?';
  }
  function linkWhats() { return 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(mensagem()); }

  // o que ainda falta para poder enviar (texto vazio = pode enviar)
  function faltando() {
    if (!conta.qtd) return 'Seu pedido está vazio.';
    if (dados.modo !== 'retirada' && dados.modo !== 'entrega') return 'Escolha retirada ou entrega.';
    if (dados.modo === 'retirada') return '';
    if (soNumeros(dados.cep).length !== 8) return 'Digite o CEP para a entrega.';
    if (cepStatus === 'buscando') return 'Buscando o CEP…';
    if (cepStatus === 'fora') return 'Por enquanto entregamos só em ' + CIDADE + '. Escolha retirada.';
    if (cepStatus === 'invalido') return 'CEP não encontrado. Confira os números.';
    if (!dados.rua) return 'Digite a rua.';
    if (!dados.numero) return 'Digite o número da casa.';
    if (!dados.bairro) return 'Digite o bairro.';
    return '';
  }

  function criarPainel() {
    var d = document.createElement('dialog');
    d.className = 'finalizar';
    d.setAttribute('aria-labelledby', 'fin-titulo');
    d.innerHTML =
      '<div class="fin-corpo">' +
      '<div class="fin-topo"><h2 id="fin-titulo">Finalizar pedido</h2>' +
      '<button type="button" class="fin-fechar" data-fin-fechar aria-label="Fechar">×</button></div>' +
      '<ul class="fin-itens" data-fin-itens></ul>' +
      '<fieldset class="fin-modo"><legend>Como você quer receber?</legend>' +
      '<label class="fin-opcao"><input type="radio" name="modo" value="retirada"><span><strong>Retirada</strong><small>Grátis · o local você combina com a Maju</small></span></label>' +
      '<label class="fin-opcao"><input type="radio" name="modo" value="entrega"><span><strong>Entrega</strong><small data-fin-taxa-nota></small></span></label>' +
      '</fieldset>' +
      '<div class="fin-endereco" data-fin-endereco hidden>' +
      '<p class="fin-cidade">Entregamos em ' + CIDADE + ' (' + UF + ').</p>' +
      '<label class="fin-campo">CEP<input name="cep" inputmode="numeric" autocomplete="postal-code" placeholder="00000-000" maxlength="9"></label>' +
      '<p class="fin-aviso" data-fin-cep-aviso aria-live="polite"></p>' +
      '<details class="fin-sem-cep" data-fin-sem-cep><summary>Não sei meu CEP</summary>' +
      '<label class="fin-campo">Nome da rua<input name="busca" placeholder="Ex.: Rua Pernambuco" autocomplete="off"></label>' +
      '<ul class="fin-ruas" data-fin-ruas></ul></details>' +
      '<label class="fin-campo">Rua<input name="rua" autocomplete="address-line1"></label>' +
      '<div class="fin-linha"><label class="fin-campo">Número<input name="numero" inputmode="numeric"></label>' +
      '<label class="fin-campo"><span>Complemento <small>(opcional)</small></span><input name="complemento" autocomplete="address-line2"></label></div>' +
      '<label class="fin-campo">Bairro<input name="bairro"></label>' +
      '</div>' +
      '<label class="fin-campo"><span>Seu nome <small>(opcional)</small></span><input name="nome" autocomplete="name"></label>' +
      '<dl class="fin-totais"><dt>Doces</dt><dd data-fin-subtotal></dd><dt>Entrega</dt><dd data-fin-taxa></dd>' +
      '<dt class="fin-total">Total</dt><dd class="fin-total" data-fin-total></dd></dl>' +
      '<p class="fin-falta" data-fin-falta aria-live="polite"></p>' +
      '<a class="botao botao-whats fin-enviar" data-fin-enviar href="#" target="_blank" rel="noopener">Enviar pedido no WhatsApp →</a>' +
      '</div>';
    document.body.appendChild(d);

    d.addEventListener('click', function (e) {
      if (e.target === d || e.target.closest('[data-fin-fechar]')) fechar();
    });
    d.addEventListener('close', function () { document.body.classList.remove('com-painel'); });
    d.addEventListener('change', function (e) {
      if (e.target.name !== 'modo') return;
      dados.modo = e.target.value;
      gravarDados();
      desenharFinalizar();
      if (dados.modo === 'entrega' && !dados.cep) campo('cep').focus();
    });
    d.addEventListener('input', function (e) {
      var n = e.target.name;
      if (n === 'cep') {
        e.target.value = formatarCep(e.target.value);
        dados.cep = e.target.value;
        cepStatus = '';
        if (soNumeros(dados.cep).length === 8) buscarCep(soNumeros(dados.cep));
      } else if (n === 'busca') {
        buscarRua(e.target.value);
        return;
      } else if (n) {
        dados[n] = e.target.value.trim();
      }
      gravarDados();
      desenharFinalizar();
    });
    d.querySelector('[data-fin-enviar]').addEventListener('click', function (e) {
      var falta = faltando();
      if (falta) {
        e.preventDefault();
        var aviso = d.querySelector('[data-fin-falta]');
        aviso.classList.remove('piscar'); void aviso.offsetWidth; aviso.classList.add('piscar');
        return;
      }
      this.href = linkWhats();
      setTimeout(fechar, 300);
    });
    return d;
  }
  function campo(n) { return fin.querySelector('[name="' + n + '"]'); }

  function buscarCep(cep) {
    cepStatus = 'buscando';
    desenharFinalizar();
    fetch('https://viacep.com.br/ws/' + cep + '/json/')
      .then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); })
      .then(function (j) {
        if (cep !== soNumeros(dados.cep)) return; // a pessoa mudou o CEP enquanto buscava
        if (j.erro) cepStatus = 'invalido';
        else if (semAcento(j.localidade) !== semAcento(CIDADE) || j.uf !== UF) { cepStatus = 'fora'; cepCidade = j.localidade + ' (' + j.uf + ')'; }
        else {
          cepStatus = 'ok';
          if (j.logradouro) { dados.rua = j.logradouro; campo('rua').value = j.logradouro; }
          if (j.bairro) { dados.bairro = j.bairro; campo('bairro').value = j.bairro; }
          gravarDados();
          (j.logradouro ? campo('numero') : campo('rua')).focus();
        }
        desenharFinalizar();
      })
      .catch(function () { if (cep === soNumeros(dados.cep)) { cepStatus = 'erro'; desenharFinalizar(); } });
  }

  var buscaEspera;
  function buscarRua(texto) {
    var lista = fin.querySelector('[data-fin-ruas]');
    clearTimeout(buscaEspera);
    texto = texto.trim();
    if (texto.length < 3) { lista.textContent = ''; return; }
    buscaEspera = setTimeout(function () {
      fetch('https://viacep.com.br/ws/' + UF + '/' + encodeURIComponent(CIDADE) + '/' + encodeURIComponent(texto) + '/json/')
        .then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); })
        .then(function (res) {
          lista.textContent = '';
          if (!Array.isArray(res) || !res.length) { lista.innerHTML = '<li class="fin-nada">Nenhuma rua encontrada. Confira o nome ou digite o endereço abaixo.</li>'; return; }
          res.slice(0, 8).forEach(function (j) {
            var li = document.createElement('li');
            var b = document.createElement('button');
            b.type = 'button';
            b.innerHTML = '<strong></strong><small></small>';
            b.firstChild.textContent = j.logradouro;
            b.lastChild.textContent = [j.bairro, j.complemento, 'CEP ' + j.cep].filter(Boolean).join(' · ');
            b.addEventListener('click', function () {
              dados.cep = j.cep; dados.rua = j.logradouro; dados.bairro = j.bairro || dados.bairro;
              cepStatus = 'ok';
              campo('cep').value = formatarCep(j.cep); campo('rua').value = dados.rua; campo('bairro').value = dados.bairro || '';
              fin.querySelector('[data-fin-sem-cep]').open = false;
              gravarDados();
              desenharFinalizar();
              campo('numero').focus();
            });
            li.appendChild(b);
            lista.appendChild(li);
          });
        })
        .catch(function () { lista.innerHTML = '<li class="fin-nada">Não deu para buscar agora. Digite o endereço abaixo.</li>'; });
    }, 400);
  }

  function desenharFinalizar() {
    if (!fin || !fin.open) return;
    var t = taxa();
    var itens = fin.querySelector('[data-fin-itens]');
    itens.textContent = '';
    conta.linhas.forEach(function (l) {
      var li = document.createElement('li');
      li.textContent = l.replace(/^• /, '');
      itens.appendChild(li);
    });
    fin.querySelectorAll('[name="modo"]').forEach(function (r) { r.checked = r.value === dados.modo; });
    fin.querySelector('[data-fin-taxa-nota]').textContent = conta.soma >= ENTREGA_GRATIS
      ? 'Grátis neste pedido (a partir de ' + reais(ENTREGA_GRATIS) + ')'
      : reais(TAXA_ENTREGA) + ' · grátis a partir de ' + reais(ENTREGA_GRATIS);
    fin.querySelector('[data-fin-endereco]').hidden = dados.modo !== 'entrega';
    var aviso = fin.querySelector('[data-fin-cep-aviso]');
    aviso.className = 'fin-aviso' + (cepStatus === 'ok' ? ' fin-ok' : cepStatus === 'fora' || cepStatus === 'invalido' ? ' fin-erro' : '');
    aviso.textContent = {
      buscando: 'Buscando o CEP…',
      ok: dados.rua ? 'Endereço encontrado. Agora é só o número.' : 'CEP de ' + CIDADE + '. Digite a rua e o bairro.',
      fora: 'Esse CEP é de ' + cepCidade + '. Por enquanto entregamos só em ' + CIDADE + '.',
      invalido: 'CEP não encontrado. Confira os números.',
      erro: 'Não deu para buscar o CEP agora. Digite o endereço abaixo.'
    }[cepStatus] || '';
    fin.querySelector('[data-fin-subtotal]').textContent = reais(conta.soma);
    fin.querySelector('[data-fin-taxa]').textContent = dados.modo === 'entrega' ? (t ? reais(t) : 'Grátis') : dados.modo === 'retirada' ? 'Retirada' : '—';
    fin.querySelector('[data-fin-total]').textContent = reais(conta.soma + t);
    var falta = faltando();
    fin.querySelector('[data-fin-falta]').textContent = falta;
    var botao = fin.querySelector('[data-fin-enviar]');
    botao.setAttribute('aria-disabled', falta ? 'true' : 'false');
    botao.href = linkWhats();
  }

  function abrir() {
    if (!fin) fin = criarPainel();
    ['cep', 'rua', 'numero', 'complemento', 'bairro', 'nome'].forEach(function (n) {
      campo(n).value = n === 'cep' ? formatarCep(dados.cep) : (dados[n] || '');
    });
    if (fin.showModal) fin.showModal(); else fin.setAttribute('open', '');
    document.body.classList.add('com-painel');
    if (dados.modo === 'entrega' && soNumeros(dados.cep).length === 8 && !cepStatus) buscarCep(soNumeros(dados.cep));
    desenharFinalizar();
  }
  function fechar() {
    if (fin.close) fin.close(); else fin.removeAttribute('open');
    document.body.classList.remove('com-painel');
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

  if (enviar) {
    enviar.addEventListener('click', function (e) {
      e.preventDefault();
      abrir();
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
