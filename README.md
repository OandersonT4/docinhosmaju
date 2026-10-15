# Doce Maju

Site estático de docinhosmaju.com.br (HTML/CSS/JavaScript, sem build).

## Páginas (abas)

Menu: Início · Bolos · Brigadeiros · Tortas · Geladinhos · Como pedir.

- `/` (`index.html`): Início, com a capa, os 4 produtos (mesmo tamanho; 4 por linha no computador, 2 no celular), o destaque do maracujá, o convite para seguir no Instagram e como pedir.
- `/bolos/`, `/brigadeiros/`, `/tortas/`, `/geladinhos/`: uma página por doce, com foto, preço e todos os sabores. A pessoa escolhe quantos quer de cada sabor.
- O pedido fica guardado no navegador (`localStorage`, chave `docemaju-pedido`) e soma entre as páginas; a barra de baixo (compacta, uma linha) mostra o total, uma faixa com quanto falta para a entrega grátis, a lixeira para limpar e envia tudo junto para o WhatsApp (`assets/pedido.js`).
- O CSS e o JS são chamados com `?v=N` (ex.: `estilo.css?v=3`). Ao mudar `estilo.css` ou `pedido.js`, aumente o número em todas as páginas para o celular não ficar com a versão antiga.
- Em `/brigadeiros/`, além da caixinha sortida, a pessoa monta a caixinha escolhendo os 4 brigadeiros entre os sabores (chocolate, morango, chocolate branco, amendoim e crocante). Cada combinação entra no pedido como "Caixinha montada (2 chocolate, 2 morango)". Para mudar os sabores do montador, edite os `data-sabor` do bloco `data-montador`.
- Entrega grátis a partir de R$ 40: o valor fica em `ENTREGA_GRATIS` no `assets/pedido.js` e nos selos do Início e de `/como-pedir/`.
- `/cardapio/`: só redireciona para o Início (o Início já é o cardápio). Fica para não quebrar links antigos.
- Páginas internas têm o botão "Voltar" no topo (`assets/voltar.js`): volta para a página anterior do site ou, se a pessoa chegou direto, vai para o Início.
- `/como-pedir/`: passos, tabela de preços e contato.
- `/design/`: design system (cores, fontes e componentes). Não aparece no menu e não é indexado pelo Google.

Preços atuais: bolo de fatia R$ 12 · caixinha com 4 brigadeiros R$ 12 · tortinha R$ 10 · geladinho R$ 5.
Para mudar um preço ou um sabor, troque na página do doce (o `data-preco` de cada sabor é o que entra no total), nos cartões do Início e na tabela de `/como-pedir/`.

## Design system

Tudo em `assets/estilo.css`: os tokens ficam no começo (`--cor-*`, `--t-*`, `--e-*`, `--r-*`) e os componentes logo abaixo (`.botao`, `.cartao-claro|rosa|escuro`, `.aba`, `.preco`, `.selo`, `.item` + `.contador`, `.passos`, `.contato`). Use sempre as classes e os tokens em vez de cores soltas.

## Fotos e logo

Tudo em `assets/img/`. As fotos dos doces são as versões profissionais (geradas no ChatGPT a partir das fotos reais da Maju, outubro de 2026):

- `bolos.jpg`, `brigadeiros.jpg`, `tortas.jpg`, `geladinhos.jpg`: foto grande de cada página e dos cartões do Início (960x720). A dos geladinhos junta os 4 sabores.
- `sabores/`: miniatura de cada sabor (240x240). O bolo de chocolate com ninho usa a mesma foto do chocolate com maracujá (bolo marrom com cobertura branca).
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

- Cidade, valor da entrega abaixo de R$ 40, retirada e formas de pagamento (não aparecem no site até ela confirmar).
- Em análise: brinde a partir de R$ 80 (ainda não está no site).
