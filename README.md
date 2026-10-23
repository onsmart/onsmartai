# Onsmart.AI — Site institucional

Cópia pública independente do site institucional da Onsmart.AI, com páginas de soluções, ecossistema, blog e CMS. Esta exportação foi autorizada para `onsmart/onsmartai`. O projeto original e seu Preview permanecem no ambiente gerenciado da Manus; este repositório não recebe sincronização automática e sua criação não publica o site.

## Escopo

Interface em português com Poppins, paleta institucional, componentes arredondados e navegação responsiva. Inclui Home, Quem Somos, Serviços, Ecossistema, Conteúdo, Contato, oito landing pages, Parcerias e painel CMS. Os formulários comerciais, newsletter e assistente SON.IA mantêm os limites de demonstração documentados na interface; não há integração ativa com CRM ou rastreadores de marketing.

Os três artigos completos aprovados estão em `docs/blog/` e no catálogo inicial de rascunhos. Sua inclusão pública neste GitHub foi autorizada separadamente. Os textos continuam sem publicação no blog: o CMS inicial os mantém em `draft`, e `/conteudo` apresenta apenas as prévias “Aprovado — publicação pendente”. Nenhuma data de publicação foi inventada. Os demais rascunhos editoriais, registros internos e histórico anterior não integram esta cópia.

## Requisitos

Node.js 22, pnpm 10.18.0 e banco MySQL compatível para usar o backend/CMS. OAuth e uploads utilizam serviços da infraestrutura Manus e exigem configuração própria autorizada. O repositório não contém credenciais, contas administrativas pré-criadas ou uma concessão automática de acesso.

```bash
corepack enable
corepack prepare pnpm@10.18.0 --activate
pnpm install --frozen-lockfile
cp .env.example .env
```

Preencha somente o arquivo local `.env` com as credenciais da sua infraestrutura. Nunca o envie ao GitHub. Use um banco próprio ou um ambiente explicitamente autorizado; migrações e seed fazem alterações persistentes nesse banco.

```bash
pnpm db:migrate
pnpm cms:seed
pnpm dev
```

O servidor utiliza `PORT`, com padrão 3000. A importação inicial é idempotente e preserva registros existentes. Para hospedar fora da infraestrutura Manus, configure ou adapte os serviços de autenticação e armazenamento; copiar o código não transfere o banco, as sessões, os acessos nem as credenciais do projeto original.

## Build e verificações

```bash
pnpm check
pnpm test
pnpm build
pnpm start
```

O build produz arquivos do frontend, o módulo de renderização do HTML e o servidor Express. O Dockerfile utiliza Node.js 22 e não contém segredos. A homologação permanece com bloqueio de indexação; SEO de produção, domínio definitivo e lançamento exigem aprovação e configuração específicas.

## Estrutura

| Pasta | Responsabilidade |
|---|---|
| `client/src` | Páginas React, componentes, estilos e dados de apresentação |
| `client/public` | Fontes, mídias, manifesto de rotas e arquivos públicos |
| `client/public/manus-storage` | Derivados visuais locais com os mesmos caminhos da versão gerenciada |
| `server` | API Express, autenticação, CMS e renderização inicial |
| `shared` | Contratos compartilhados de dados e validação |
| `drizzle` | Esquema e migrações do banco |
| `docs/blog` | Os três artigos completos autorizados |

A aprovação editorial é diferente da publicação: os textos completos ficam fora do bundle público e da API pública enquanto não tiverem um snapshot publicado. Seu conteúdo, contudo, é visível nos arquivos deste repositório público, conforme autorização.

## Pendências preservadas

O primeiro login e a homologação autenticada completa do CMS ainda precisam ser concluídos no projeto original. As permissões Admin/Editor não devem ser presumidas a partir da presença do painel. Traduções públicas completas, integrações de produção, revisão jurídica, domínio, migração e lançamento continuam fora desta entrega.

## Créditos e direitos

Consulte [CREDITOS.md](CREDITOS.md) e as licenças das dependências. Marcas, fotografias, vídeos, fontes e conteúdo editorial conservam seus direitos próprios; um repositório público não concede licença irrestrita para esses materiais.

Nenhuma GitHub Action, GitHub Pages ou implantação automática é ativada por esta exportação.
