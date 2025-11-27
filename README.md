# QR Code Pets

Sistema para identificação de pets via QR Code. Donos cadastram seus animais, geram um QR Code único e o colocam na coleira. Ao escanear, qualquer pessoa pode ver as informações do pet e entrar em contato com o dono.

## 🚀 Funcionalidades

- Cadastro e login de usuários (JWT)
- Cadastro de múltiplos pets
- Geração de QR Code único
- Página pública do pet via QR
- Informações de contato do dono
- Status perdido/encontrado
- Informações médicas
- Dashboard de gerenciamento
- Download do QR Code em PNG
- Edição dos dados do pet

## 🛠️ Tecnologias

- Next.js 14+
- TypeScript
- PostgreSQL + Prisma
- JWT
- Tailwind CSS
- React Hook Form + Zod
- QRCode

## 📦 Instalação

```bash
git clone <seu-repositorio>
cd "QR view and Pet register"
npm install
cp .env.example .env
docker-compose up -d
npm run db:generate
npm run db:push
npm run dev
```

Aplicação disponível em:  
**http://localhost:3000**

## 📖 Como Usar

- Crie uma conta e faça login
- Cadastre um pet no dashboard
- Gere e baixe o QR Code
- Fixe o QR Code na coleira
- Ao escanear, a página pública do pet será exibida

## 🗄️ Banco de Dados

Gerenciamento via Prisma.

### Comandos úteis

```bash
npm run db:generate
npm run db:push
npm run db:migrate
npm run db:studio
```

## 🔐 Autenticação

Autenticação com JWT armazenado em cookies HTTP-only.

### Endpoints principais

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

## 🌐 Endpoints de Pets

- `GET /api/pets`
- `POST /api/pets`
- `PUT /api/pets/[id]`
- `DELETE /api/pets/[id]`
- `GET /api/pets/qrcode/[id]`

## 🚀 Deploy

Funciona em plataformas como **Vercel** e **Render**.

### Variáveis obrigatórias

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXTAUTH_URL`

### Aplicar migrations

```bash
npx prisma db push
```

## 🔒 Segurança

- Senhas hashadas com bcrypt
- Cookies HTTP-only
- Validação com Zod
- SQL injection prevenido com Prisma

## 🎯 Próximas Melhorias

- Upload de imagens
- Notificações por email
- App mobile
- Integração com mapas

---

Desenvolvido por **valdemar-andrade** 🐾
