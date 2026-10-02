# Gift List — By João Arthur

Site de lista de presentes, pensado para funcionar gratuitamente com **GitHub Pages + Supabase**.

## O que já está pronto

- Tela de carregamento de 5 segundos.
- Barra de progresso atravessando a tela.
- Presentes, laços e símbolos flutuando aleatoriamente.
- Visual na cor #27364D, baseada na imagem fornecida.
- Categorias em cards.
- Categoria fixa "Valores + Mensagens".
- Chave Pix com botão para copiar.
- Área de entrega e informações adicionais.
- Login de administrador.
- Criar, editar e excluir categorias.
- Cada categoria aceita nome, descrição, imagem por URL e link da lista da Amazon.
- Endereço e instruções podem ser alterados pelo painel.
- Layout responsivo para computador e celular.

## IMPORTANTE SOBRE O LOGIN

O site NÃO guarda a senha no código.

O nome que aparece na tela é "João Arthur", mas o Supabase usa internamente o e-mail:
`joao.arthur@giftlist.admin`

A senha deve ser criada no painel do Supabase. Não coloque a senha dentro do `config.js`.

O GitHub Pages é público. Nunca coloque uma senha, Service Role Key ou outro segredo no JavaScript público.

## Estrutura

- `index.html` — página.
- `style.css` — visual.
- `app.js` — funcionamento.
- `config.js` — configuração pública do Supabase e chave Pix.
- `supabase.sql` — banco e permissões.
- `LEIA-ME.md` — este guia.

## Fluxo

Visitante → Gift List → categoria → lista Amazon.

Ou:

Visitante → Valores + Mensagens → chave Pix → Copiar chave.

Administrador → By João Arthur → login → painel → cria categorias e altera instruções.
