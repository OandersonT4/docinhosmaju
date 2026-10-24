# Doce Maju

Site estático de docinhosmaju.com.br (HTML/CSS/JavaScript, sem build).

## Páginas (abas)

Menu: Início · Bolos · Brigadeiros · Tortas · Geladinhos · Como pedir.

- `/` (`index.html`): Início, com a capa (os 4 doces em mosaico com a corujinha no meio), os 4 produtos (mesmo tamanho; 4 por linha no computador, 2 no celular), a caixinha que se monta ao rolar, o destaque do maracujá, o convite para seguir no Instagram e como pedir.
- **Caixinha que se monta ao rolar** (Início, `assets/caixinha.js`, desde 24/10/2026): o momento-assinatura do site. A seção fica parada na tela enquanto a pessoa rola, os 4 brigadeiros entram um de cada vez na caixinha, o contador vai de "0 de 4" a "Caixinha fechada!", a tampa com a corujinha fecha e aparece o preço. O botão leva para o montador (`/brigadeiros/#montador`). Só mexe em `transform` e `opacity`. Sem JS ou com "reduzir movimento", aparece montada e aberta, sem a seção fixa. Ao mudar o preço da caixinha, mude também o `.cx-preco` do Início.
- `/bolos/`, `/brigadeiros/`, `/tortas/`, `/geladinhos/`: uma página por doce, com foto, preço e todos os sabores. A pessoa escolhe quantos quer de cada sabor.
- O pedido fica guardado no navegador (`localStorage`, chave `docemaju-pedido`) e soma entre as páginas; a barra de baixo (compacta, uma linha) mostra o total, uma faixa com quanto falta para a entrega grátis, a lixeira para limpar e envia tudo junto para o WhatsApp (`assets/pedido.js`).
- O CSS e o JS são chamados com `?v=N` (ex.: `estilo.css?v=3`). Ao mudar `estilo.css` ou `pedido.js`, aumente o número em todas as páginas para o celular não ficar com a versão antiga.
- Em `/brigadeiros/`, além da caixinha sortida, a pessoa monta a caixinha escolhendo os 4 brigadeiros entre os sabores (chocolate, morango, chocolate branco, amendoim e crocante). Cada combinação entra no pedido como "Caixinha montada (2 chocolate, 2 morango)". Para mudar os sabores do montador, edite os `data-sabor` do bloco `data-montador`.
- Geladinhos: a cada 4 geladinhos no pedido, a pessoa escolhe 1 de brinde na página `/geladinhos/` (entra no pedido como "Geladinho de morango (brinde)", sem custo). O número fica em `BRINDE_A_CADA` no `assets/pedido.js`.
- Finalizar pedido: o botão "Finalizar" da barra abre um painel (`<dialog>` criado pelo `assets/pedido.js`) onde a pessoa escolhe **retirada** (grátis) ou **entrega** em Nova Serrana (R$ 10, `TAXA_ENTREGA`; grátis a partir de R$ 40). Na entrega, o CEP é buscado no ViaCEP (viacep.com.br, gratuito, chamado pelo navegador do cliente) e preenche rua e bairro; CEP de outra cidade é recusado. "Não sei meu CEP" busca pelo nome da rua em Nova Serrana. Se o ViaCEP estiver fora do ar, a pessoa digita o endereço. Endereço e nome ficam guardados no navegador (`docemaju-entrega`) e vão na mensagem do WhatsApp com a taxa e o total. O pagamento é **Pix** ou **dinheiro**; no dinheiro, a pessoa diz se precisa de troco e para quanto (tem que ser maior que o total).
- Entrega grátis a partir de R$ 40: o valor fica em `ENTREGA_GRATIS` no `assets/pedido.js` e nos selos do Início e de `/como-pedir/`.
- `/cardapio/`: só redireciona para o Início (o Início já é o cardápio). Fica para não quebrar links antigos.
- Páginas internas têm o botão "Voltar" no topo (`assets/voltar.js`): volta para a página anterior do site ou, se a pessoa chegou direto, vai para o Início.
- `/como-pedir/`: passos, tabela de preços e contato.
- `/design/`: design system (cores, fontes e componentes). Não aparece no menu e não é indexado pelo Google.

Preços atuais: bolo de fatia R$ 12 · caixinha com 4 brigadeiros R$ 12 · tortinha R$ 10 · geladinho R$ 5.
Para mudar um preço ou um sabor, troque na página do doce (o `data-preco` de cada sabor é o que entra no total), nos cartões do Início e na tabela de `/como-pedir/`.

## Design system

Tudo em `assets/estilo.css`: os tokens ficam no começo (`--cor-*`, `--t-*`, `--e-*`, `--r-*`) e os componentes logo abaixo (`.botao`, `.cartao-claro|rosa|escuro`, `.aba`, `.preco`, `.selo`, `.item` + `.contador`, `.passos`, `.contato`). Use sempre as classes e os tokens em vez de cores soltas.

## Google

- Cada página tem a sua palavra principal no título e no `<h1>`: Início "Doceria em Nova Serrana", Bolos "Bolo de pote em Nova Serrana", Brigadeiros "Brigadeiro em Nova Serrana", Tortas "Torta de limão em Nova Serrana", Geladinhos "Geladinho gourmet em Nova Serrana". Duas páginas não disputam a mesma palavra.
- Cada página de doce tem um bloco de texto no fim (`.texto-seo`) com os sabores, o preço, a entrega em Nova Serrana e links para os outros doces. Ao mudar sabor ou preço, mude também esse texto.
- Início com JSON-LD `Bakery` (nome, telefone, Nova Serrana, Pix/dinheiro, Instagram e os 4 produtos com preço). Como pedir com perguntas frequentes e o JSON-LD `FAQPage` com as mesmas perguntas: ao mudar uma, mude as duas.
- `sitemap.xml` (atualize o `lastmod` ao mudar páginas), `robots.txt` e `404.html` (com `noindex`). Para o Nginx usar a página 404, a configuração do site precisa de `error_page 404 /404.html;`.
- Fotos de sabor com `alt` descrevendo o sabor. Rodapé com "Nova Serrana/MG".

## Fontes, movimento e compartilhamento

- **Fontes** (Poppins, Lora itálico e Pacifico) servidas pelo próprio site, em `assets/fontes/` (`fontes.css` + arquivos `.woff2`, licença em `OFL.txt`). Não chama mais o Google Fonts. As duas mais usadas têm `preload` no `<head>`.
- **Movimento como token** (`assets/estilo.css`, começo): `--dur-rapida` (0,3 s), `--dur-media` (0,6 s), `--dur-lenta` (1,2 s), `--curva-suave` e `--curva-mola`. Todo efeito novo usa só esses valores.
- **Menu do celular**: o fim da faixa de abas some aos poucos para mostrar que dá para arrastar, e a aba da página atual já aparece na tela (`assets/movimento.js`).
- **Entrada suave ao rolar** (`assets/movimento.js`): o que está abaixo da primeira tela sobe de leve ao aparecer. Desligado com "reduzir movimento" no celular e sem JavaScript (o `<head>` marca `html.js`; sem ele nada fica escondido).
- **Toque:** botões, abas, contadores e links do rodapé com pelo menos 44 px de altura.
- **Pré-visualização do link** (WhatsApp, Instagram, Facebook): cada página tem a sua imagem de 1200x630 e o bloco completo de `og:*` e `twitter:*` (título, descrição, imagem com tamanho e `og:image:alt`, nome do site, `pt_BR`). Início: `assets/img/og.jpg`; doces e Como pedir: `assets/img/og-<página>.jpg`. Todas montadas em `docs/og/og.html` (`?p=bolos`, `brigadeiros`, `tortas`, `geladinhos`, `como-pedir`): rode o site localmente, tire um print de 1200x630, salve com o nome da página e aumente o `?v=` do `og:image` dela. Ao mudar preço, mude também na imagem. O WhatsApp guarda a prévia antiga de um link por um tempo; o `?v=` novo ajuda. A pasta `docs/` não vai para a VPS.
- **Ícone de "app"** (adicionar à tela inicial): `site.webmanifest` (nome Doce Maju, cores, ícones), `assets/img/apple-touch-icon.png` (iPhone, 180), `icone-192.png` e `icone-512.png` (Android) e `icone-maskable-512.png` (Android que recorta em círculo). Toda página tem o `manifest`, o `apple-touch-icon` e o nome `Doce Maju` embaixo do ícone.
- **Sem botão fixo de WhatsApp** (desde 24/10/2026): o site é para a pessoa montar o pedido e mandar pronto. O botão do topo é "Fazer pedido" (leva ao cardápio do Início, `#cardapio`); o WhatsApp aparece no Finalizar, em Como pedir e no rodapé.

## Fotos e logo

Tudo em `assets/img/`. As fotos dos doces são as versões profissionais (geradas no ChatGPT a partir das fotos reais da Maju, outubro de 2026):

- `bolos.jpg`, `brigadeiros.jpg`, `tortas.jpg`, `geladinhos.jpg`: foto grande de cada página e dos cartões do Início (960x720). A dos geladinhos é a foto dos 4 sabores juntos na tábua.
- `capa/`: recortes quadrados (440x440, WebP) dos 4 doces para o mosaico da capa. `bolos-480.webp` etc.: versões leves (480x360, WebP) dos cartões do Início, dentro de `<picture>` (o `.jpg` continua como reserva). Ao trocar a foto de um doce, refaça os dois a partir do `.jpg`.
- `sabores/`: miniatura de cada sabor (240x240). As de brigadeiro também são os doces da caixinha que se monta no Início. O bolo de chocolate com ninho usa a mesma foto do chocolate com maracujá (bolo marrom com cobertura branca).
- `logo-coruja.png`: logo oficial (corujinha + nome, fundo transparente) na capa.
- `logo.png`, `logo-pequena.png`: logo no círculo lilás (a pequena vai no topo, ao lado do nome).
- `favicon.png`, `apple-touch-icon.png`, `og.jpg`: ícone da aba, ícone do celular e imagem de compartilhamento (WhatsApp, Facebook).

Para trocar uma foto, salve com o mesmo nome e tamanho e aumente o `?v=N` dela nas páginas (senão o celular mostra a antiga).

## Publicar

- Na VPS, o site fica em `/var/www/docinhosmaju`, servido pelo Nginx (`/etc/nginx/sites-available/docinhosmaju`) com SSL do Let's Encrypt (renovação automática).
- **Actions › Publicar no site › Run workflow**, sempre primeiro em `simular` e depois em `publicar`, a partir da `main`. Nunca apaga arquivos da VPS e não envia o que está em `.deployignore`.
- A publicação entra com o usuário `maju`, que só é dono da pasta deste site. Os segredos ficam no ambiente `producao` (só a `main`): `VPS_HOST`, `VPS_USER` (`maju`), `VPS_SSH_KEY`, `VPS_KNOWN_HOSTS` e, opcional, `VPS_DIR` e `VPS_PORT`.
- Não coloque senhas, chaves, arquivos `.env` ou dados reais no Git.

## Pendências da Maju

- Local da retirada (não aparece no site até ela confirmar).
- Em análise: brinde a partir de R$ 80 (ainda não está no site).
