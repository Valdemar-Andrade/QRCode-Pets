# QR Code Pets - Sistema de Identificação de Animais

Sistema completo de identificação de pets através de QR Code. Permite que donos de animais cadastrem seus pets, gerem QR Codes únicos e os anexem em coleiras. Ao escanear o QR Code, qualquer pessoa pode visualizar as informações do pet e entrar em contato com o dono.

## 🚀 Funcionalidades

- ✅ Cadastro de usuários e autenticação com JWT
- ✅ Cadastro de múltiplos pets por usuário
- ✅ Geração de QR Codes únicos para cada pet
- ✅ Página pública acessível via QR Code
- ✅ Informações de contato do dono
- ✅ Status de pet perdido/encontrado
- ✅ Informações médicas importantes
- ✅ Dashboard para gerenciamento de pets
- ✅ Download de QR Code em PNG
- ✅ Edição e atualização de informações do pet

## 🛠️ Tecnologias

- **Next.js 14+** (App Router) - Framework React full-stack
- **TypeScript** - Tipagem estática
- **PostgreSQL** - Banco de dados relacional
- **Prisma** - ORM para Node.js
- **JWT** - Autenticação
- **Tailwind CSS** - Estilização
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **QRCode** - Geração de QR Codes

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Docker e Docker Compose (para PostgreSQL local)
- npm ou yarn

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd "QR view and Pet register"
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://qr_pets_user:qr_pets_password@localhost:5432/qr_pets_db?schema=public"

# JWT Secret (gere uma chave segura)
JWT_SECRET="sua-chave-secreta-super-segura-aqui"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Inicie o PostgreSQL com Docker

```bash
docker-compose up -d
```

Isso irá iniciar um container PostgreSQL na porta 5432.

### 5. Configure o banco de dados

```bash
# Gerar o cliente Prisma
npm run db:generate

# Criar as tabelas no banco de dados
npm run db:push
```

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000)

## 📖 Uso

### Criar uma conta

1. Acesse a página inicial
2. Clique em "Registrar"
3. Preencha nome, email e senha
4. Faça login com suas credenciais

### Cadastrar um Pet

1. Após fazer login, você será redirecionado para o dashboard
2. Clique em "Adicionar Pet"
3. Preencha as informações do pet:
   - Nome (obrigatório)
   - Espécie (obrigatório)
   - Raça, data de nascimento, cor, peso (opcionais)
   - URL da foto (opcional)
   - Informações médicas (opcional)
   - Marque se o pet está perdido
4. Clique em "Adicionar Pet"

### Gerar e Baixar QR Code

1. Na lista de pets, clique em "Ver QR Code"
2. O QR Code será gerado automaticamente
3. Clique em "Download QR Code" para baixar a imagem
4. Imprima o QR Code e cole na coleira do seu pet

### Visualizar Página Pública do Pet

1. Escaneie o QR Code com qualquer leitor de QR Code
2. Ou acesse diretamente a URL: `http://localhost:3000/pet/[qrCodeId]`
3. A página pública exibirá todas as informações do pet e dados de contato

### Gerenciar Pets

- **Editar**: Clique em "Editar" no card do pet
- **Marcar como Perdido/Encontrado**: Use o botão "Marcar Perdido" ou "Marcar Encontrado"
- **Deletar**: Clique em "Deletar" (confirmação será solicitada)

## 🏗️ Estrutura do Projeto

```
/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # Endpoints de autenticação
│   │   └── pets/         # Endpoints de pets
│   ├── auth/             # Páginas de autenticação
│   ├── dashboard/        # Dashboard do usuário
│   ├── pet/              # Página pública do pet
│   └── layout.tsx        # Layout principal
├── components/           # Componentes React
│   └── ui/              # Componentes de UI reutilizáveis
├── lib/                 # Utilitários e helpers
│   ├── auth/           # Autenticação (JWT, hash)
│   ├── db/             # Cliente Prisma
│   ├── qrcode/         # Geração de QR Codes
│   └── validations/    # Schemas de validação Zod
├── prisma/             # Prisma
│   └── schema.prisma   # Schema do banco de dados
└── docker-compose.yml  # Configuração do PostgreSQL
```

## 🗄️ Banco de Dados

### Modelos

- **User**: Usuários do sistema
- **Pet**: Pets cadastrados
- **QRCode**: QR Codes vinculados aos pets

### Comandos Prisma

```bash
# Gerar cliente Prisma
npm run db:generate

# Criar/atualizar schema no banco
npm run db:push

# Criar migration
npm run db:migrate

# Abrir Prisma Studio (interface visual)
npm run db:studio
```

## 🔒 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação. Os tokens são armazenados em cookies HTTP-only para segurança.

### Endpoints de Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout
- `GET /api/auth/me` - Obter usuário atual

## 📱 API Endpoints

### Pets

- `GET /api/pets` - Listar pets do usuário autenticado
- `POST /api/pets` - Criar novo pet
- `GET /api/pets/[id]` - Obter pet por ID
- `PUT /api/pets/[id]` - Atualizar pet
- `DELETE /api/pets/[id]` - Deletar pet
- `GET /api/pets/qrcode/[id]` - Obter pet por QR Code ID (público)
- `POST /api/pets/qrcode/[id]` - Gerar imagem do QR Code

## 🚀 Deploy para Produção

### Opção 1: Vercel (Recomendado)

1. **Instale a CLI da Vercel**:
   ```bash
   npm i -g vercel
   ```

2. **Configure o projeto**:
   ```bash
   vercel
   ```

3. **Configure as variáveis de ambiente na Vercel**:
   - `DATABASE_URL`: URL de conexão do PostgreSQL (use um serviço como Railway, Render ou Supabase)
   - `JWT_SECRET`: Chave secreta para JWT (gere uma chave forte)
   - `NEXTAUTH_URL`: URL do seu site em produção (ex: https://seu-site.vercel.app)

4. **Configure o banco de dados PostgreSQL**:
   - Use um serviço como [Railway](https://railway.app), [Render](https://render.com) ou [Supabase](https://supabase.com)
   - Copie a URL de conexão e adicione como `DATABASE_URL` nas variáveis de ambiente

5. **Execute as migrations**:
   ```bash
   # Localmente ou em um script de deploy
   npx prisma db push
   ```

### Opção 2: Render

1. **Crie uma conta no Render**:
   - Acesse [render.com](https://render.com)

2. **Crie um novo Web Service**:
   - Conecte seu repositório GitHub
   - Escolha "Next.js" como ambiente
   - Configure as variáveis de ambiente

3. **Crie um banco de dados PostgreSQL**:
   - No dashboard do Render, crie um novo PostgreSQL database
   - Copie a Internal Database URL
   - Adicione como `DATABASE_URL` nas variáveis de ambiente do Web Service

4. **Configure as variáveis de ambiente**:
   - `DATABASE_URL`: URL do PostgreSQL do Render
   - `JWT_SECRET`: Chave secreta forte
   - `NEXTAUTH_URL`: URL do seu serviço no Render

5. **Deploy**:
   - Render irá fazer o build e deploy automaticamente
   - Execute as migrations após o primeiro deploy

### Opção 3: Railway

1. **Crie uma conta no Railway**:
   - Acesse [railway.app](https://railway.app)

2. **Crie um novo projeto**:
   - Conecte seu repositório GitHub
   - Adicione um serviço "PostgreSQL"
   - Adicione um serviço "GitHub Repo" (seu projeto Next.js)

3. **Configure as variáveis de ambiente**:
   - Railway automaticamente cria a variável `DATABASE_URL` do PostgreSQL
   - Adicione `JWT_SECRET` e `NEXTAUTH_URL`

4. **Deploy**:
   - Railway fará o deploy automaticamente
   - Execute as migrations após o primeiro deploy

### Configuração do Banco de Dados em Produção

Após criar o banco de dados, execute as migrations:

```bash
# Localmente (conectado ao banco de produção)
DATABASE_URL="sua-url-de-producao" npx prisma db push

# Ou adicione um script de deploy no package.json
```

### Variáveis de Ambiente de Produção

Certifique-se de configurar:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
JWT_SECRET="uma-chave-super-secreta-e-longa-aqui"
NEXTAUTH_URL="https://seu-dominio.com"
```

### Build de Produção

```bash
# Build local
npm run build

# Iniciar servidor de produção
npm start
```

## 🔐 Segurança

- Senhas são hashadas com bcrypt
- Tokens JWT são armazenados em cookies HTTP-only
- Validação de dados com Zod
- Proteção de rotas com middleware
- SQL injection prevenido com Prisma

## 📝 Notas Importantes

- **JWT_SECRET**: Use uma chave forte e única em produção
- **DATABASE_URL**: Mantenha a URL do banco de dados segura
- **HTTPS**: Use HTTPS em produção para segurança dos dados
- **Backup**: Faça backups regulares do banco de dados

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma issue no repositório.

## 🎯 Próximas Melhorias

- [ ] Upload de imagens (atualmente apenas URL)
- [ ] Notificações por email quando pet é marcado como perdido
- [ ] Histórico de localizações (se pet for encontrado)
- [ ] Integração com mapas
- [ ] App mobile
- [ ] Compartilhamento de QR Code via WhatsApp
- [ ] Múltiplos idiomas
- [ ] Temas dark/light

---

Desenvolvido com ❤️ para ajudar a proteger e identificar nossos pets

