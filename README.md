# Docinhos Maju

Site estático de docinhosmaju.com.br (HTML/CSS/JavaScript, sem build).

- Os arquivos do site ficam na raiz do repositório. A página inicial é `index.html`.
- Na VPS, o site fica em `/var/www/docinhosmaju`, servido pelo Nginx (`/etc/nginx/sites-available/docinhosmaju`) com SSL do Let's Encrypt (renovação automática).
- Publicar: **Actions › Publicar no site › Run workflow**, sempre primeiro em `simular` e depois em `publicar`, a partir da `main`. Nunca apaga arquivos da VPS e não envia o que está em `.deployignore`.
- A publicação entra com o usuário `maju`, que só é dono da pasta deste site. Os segredos ficam no ambiente `producao` (só a `main`): `VPS_HOST`, `VPS_USER` (`maju`), `VPS_SSH_KEY`, `VPS_KNOWN_HOSTS` e, opcional, `VPS_DIR` e `VPS_PORT`.
- Não coloque senhas, chaves, arquivos `.env` ou dados reais no Git.
