# Doce Maju

Site estático de docinhosmaju.com.br (HTML/CSS/JavaScript, sem build).

## Páginas (abas)

- `/` (`index.html`): Início, com a capa, os 4 produtos com preço, o destaque do maracujá e como pedir.
- `/cardapio/`: cardápio com todos os sabores e contador. O cliente monta o pedido, vê o total e envia a mensagem pronta para o WhatsApp (`assets/pedido.js`).
- `/como-pedir/`: passos, tabela de preços e contato.
- `/design/`: design system (cores, fontes e componentes). Não aparece no menu e não é indexado pelo Google.

Preços atuais: bolo de fatia R$ 12 · caixinha com 4 brigadeiros R$ 12 · tortinha R$ 10 · geladinho R$ 5.
Para mudar um preço, troque nas 3 páginas (o `data-preco` do cardápio é o que entra no total).

## Design system

Tudo em `assets/estilo.css`: os tokens ficam no começo (`--cor-*`, `--t-*`, `--e-*`, `--r-*`) e os componentes logo abaixo (`.botao`, `.cartao-claro|rosa|escuro`, `.aba`, `.preco`, `.selo`, `.item` + `.contador`, `.passos`, `.contato`). Use sempre as classes e os tokens em vez de cores soltas.

## Fotos

Os lugares das fotos estão marcados com `<!-- FOTO: ... -->` no HTML. Coloque as imagens em `assets/img/` (`bolos.jpg`, `brigadeiros.jpg`, `tortas.jpg`, `geladinhos.jpg`) e troque o `<span>` com o emoji pela `<img>`.

## Publicar

- Na VPS, o site fica em `/var/www/docinhosmaju`, servido pelo Nginx (`/etc/nginx/sites-available/docinhosmaju`) com SSL do Let's Encrypt (renovação automática).
- **Actions › Publicar no site › Run workflow**, sempre primeiro em `simular` e depois em `publicar`, a partir da `main`. Nunca apaga arquivos da VPS e não envia o que está em `.deployignore`.
- A publicação entra com o usuário `maju`, que só é dono da pasta deste site. Os segredos ficam no ambiente `producao` (só a `main`): `VPS_HOST`, `VPS_USER` (`maju`), `VPS_SSH_KEY`, `VPS_KNOWN_HOSTS` e, opcional, `VPS_DIR` e `VPS_PORT`.
- Não coloque senhas, chaves, arquivos `.env` ou dados reais no Git.

## Pendências da Maju

- Cidade, entrega ou retirada e formas de pagamento (não aparecem no site até ela confirmar).
- Fotos dos produtos e logo oficial (a corujinha em `assets/img/coruja.svg` é provisória).
