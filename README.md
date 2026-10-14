# Doce Maju

Site estático de docinhosmaju.com.br (HTML/CSS/JavaScript, sem build).

## Páginas (abas)

Menu: Início · Bolos · Brigadeiros · Tortas · Geladinhos · Como pedir.

- `/` (`index.html`): Início, com a capa, os 4 produtos (mesmo tamanho; 4 por linha no computador, 2 no celular), o destaque do maracujá, o convite para seguir no Instagram e como pedir.
- `/bolos/`, `/brigadeiros/`, `/tortas/`, `/geladinhos/`: uma página por doce, com foto, preço e todos os sabores. A pessoa escolhe quantos quer de cada sabor.
- O pedido fica guardado no navegador (`localStorage`, chave `docemaju-pedido`) e soma entre as páginas; a barra de baixo mostra o total, tem "Limpar" e envia tudo junto para o WhatsApp (`assets/pedido.js`).
- `/cardapio/`: resumo com os 4 produtos (para links antigos); não aparece no menu.
- `/como-pedir/`: passos, tabela de preços e contato.
- `/design/`: design system (cores, fontes e componentes). Não aparece no menu e não é indexado pelo Google.

Preços atuais: bolo de fatia R$ 12 · caixinha com 4 brigadeiros R$ 12 · tortinha R$ 10 · geladinho R$ 5.
Para mudar um preço ou um sabor, troque na página do doce (o `data-preco` de cada sabor é o que entra no total), nos cartões do Início e do `/cardapio/` e na tabela de `/como-pedir/`.

## Design system

Tudo em `assets/estilo.css`: os tokens ficam no começo (`--cor-*`, `--t-*`, `--e-*`, `--r-*`) e os componentes logo abaixo (`.botao`, `.cartao-claro|rosa|escuro`, `.aba`, `.preco`, `.selo`, `.item` + `.contador`, `.passos`, `.contato`). Use sempre as classes e os tokens em vez de cores soltas.

## Fotos e logo

Tudo em `assets/img/`, tirado das artes finais do Instagram (padrão com luva preta):

- `bolos.jpg`, `brigadeiros.jpg`, `tortas.jpg`, `geladinhos.jpg`: fotos dos cartões (960x720, recorte só do produto, sem texto).
- `logo-coruja.png`: logo oficial (corujinha + nome, fundo transparente) na capa.
- `logo.png`, `logo-pequena.png`: logo no círculo lilás (a pequena vai no topo, ao lado do nome).
- `favicon.png`, `apple-touch-icon.png`, `og.jpg`: ícone da aba, ícone do celular e imagem de compartilhamento (WhatsApp, Facebook).

Para trocar uma foto, salve com o mesmo nome e tamanho.

## Publicar

- Na VPS, o site fica em `/var/www/docinhosmaju`, servido pelo Nginx (`/etc/nginx/sites-available/docinhosmaju`) com SSL do Let's Encrypt (renovação automática).
- **Actions › Publicar no site › Run workflow**, sempre primeiro em `simular` e depois em `publicar`, a partir da `main`. Nunca apaga arquivos da VPS e não envia o que está em `.deployignore`.
- A publicação entra com o usuário `maju`, que só é dono da pasta deste site. Os segredos ficam no ambiente `producao` (só a `main`): `VPS_HOST`, `VPS_USER` (`maju`), `VPS_SSH_KEY`, `VPS_KNOWN_HOSTS` e, opcional, `VPS_DIR` e `VPS_PORT`.
- Não coloque senhas, chaves, arquivos `.env` ou dados reais no Git.

## Pendências da Maju

- Cidade, entrega ou retirada e formas de pagamento (não aparecem no site até ela confirmar).
