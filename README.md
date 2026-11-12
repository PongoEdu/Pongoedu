  # PongoEdu — Front-end

  Front-end (React + Vite) do PongoEdu, plataforma de Laboratórios Educacionais didáticos. Consome a API do backend Spring Boot descrita no projeto (autenticação, produtos/categorias/lotes, roteiros, agendamentos, preparações, empréstimos, solicitações de compra, recebimentos, usuários e notificações).

  ## Configuração

  1. Rode `npm i` para instalar as dependências.
  2. Copie `.env.example` para `.env` e ajuste `VITE_API_BASE_URL` para o endereço do backend (padrão: `http://localhost:8080`).
  3. O backend precisa estar no ar para login e qualquer tela autenticada funcionarem — não há dados mockados nem fallback local.

  ## Rodando

  Run `npm run dev` to start the development server.

  Run `npm run build` to gerar o build de produção.
  