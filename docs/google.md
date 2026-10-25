# Google: o que fica fora do site

O site já está pronto para o Google (blocos 1 e 2, ver README › Google). O que mais pesa para aparecer em "doceria perto de mim" e no mapa de Nova Serrana fica fora do site e depende do Anderson e da Maju.

## Search Console (Anderson)

Igual ao do seu site (`docs/google.md` do oandersont4):

1. search.google.com/search-console › Adicionar propriedade › **Domínio** › `docinhosmaju.com.br`.
2. Crie o registro **TXT** que o Google mostrar, no painel onde o domínio está, e clique em **Verificar**.
3. Em **Sitemaps**, envie `https://docinhosmaju.com.br/sitemap.xml`.
4. Em **Inspeção de URL**, peça a indexação do Início e das 4 páginas de doce.
5. Em **Melhorias**, confira se aparecem "Produtos" e "Caminhos de navegação" sem erro (os dados do bloco 2).

## Perfil da Empresa no Google (Maju, com ajuda do Anderson)

1. business.google.com, com a conta Google da Maju (o perfil é dela).
2. Nome: **Doce Maju** (sem palavras a mais, o Google pune nome recheado).
3. Categoria principal: **Confeitaria**. Secundárias: Loja de doces, Serviço de entrega de comida.
4. Como a retirada ainda não tem local confirmado, marque que **não atende clientes no endereço** e coloque a **área de atendimento** Nova Serrana. O endereço fica escondido.
5. Telefone (37) 99876-5591, site `https://docinhosmaju.com.br/`, horário de atendimento dos pedidos.
6. Produtos: os 4 doces com foto, preço e link da página de cada um (as mesmas fotos de `assets/img/`).
7. Verificação: o Google costuma pedir vídeo mostrando a cozinha e os doces. Siga o que aparecer.

## Depois do perfil no ar

- Peça avaliação a cada cliente que gostou (o link de avaliação aparece no perfil, em "Pedir avaliações"). Avaliação com o nome do doce e "Nova Serrana" no texto ajuda.
- Responda todas as avaliações.
- Uma foto ou novidade por semana no perfil (pode ser a mesma do Instagram).
- Mande o horário para entrar no site: o JSON-LD do Início ganha `openingHoursSpecification`.
- Quando a Maju confirmar o local da retirada, o endereço entra no site, no JSON-LD (`streetAddress`, `geo`) e no perfil, escrito igual nos três.
