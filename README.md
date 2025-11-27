QR Code Pets
Sistema para identificação de pets por QR Code. Donos cadastram seus animais, geram um QR Code único e o colocam na coleira. Ao escanear, qualquer pessoa pode ver as informações do pet e contatar o dono.
🚀 Funcionalidades
Cadastro e login de usuários (JWT)
Cadastro de múltiplos pets
Geração de QR Code único
Página pública do pet via QR
Informações de contato do dono
Status perdido/encontrado
Dados médicos
Dashboard de gerenciamento
Download do QR Code em PNG
Edição dos dados do pet
🛠️ Tecnologias
Next.js 14+
TypeScript
PostgreSQL + Prisma
JWT
Tailwind CSS
React Hook Form + Zod
QRCode
📦 Instalação
git clone <seu-repositorio>
cd "QR view and Pet register"
npm install
cp .env.example .env
docker-compose up -d
npm run db:generate
npm run db:push
npm run dev
Acesse em: http://localhost:3000
📖 Uso Básico
Crie uma conta e faça login
Cadastre um pet no dashboard
Gere e baixe o QR Code
Cole na coleira do pet
Quem escanhar verá a página pública com as informações e contato
🗄️ Banco de Dados
Gerenciado pelo Prisma.
Comandos úteis:
npm run db:generate
npm run db:push
npm run db:migrate
npm run db:studio
🔐 Autenticação
Autenticação via JWT em cookies HTTP-only.
Endpoints principais:
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
🌐 Endpoints de Pets
GET /api/pets
POST /api/pets
PUT /api/pets/[id]
DELETE /api/pets/[id]
GET /api/pets/qrcode/[id]
🚀 Deploy
Funciona em plataformas como Vercel ou Render usando:
DATABASE_URL
JWT_SECRET
NEXTAUTH_URL
Execute as migrations em produção com:
npx prisma db push
🔒 Segurança
Hash de senha com bcrypt
Cookies HTTP-only
Validação com Zod
Prisma prevenindo SQL injection
