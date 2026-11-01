# Guía de Configuración de Desarrollo - KAIBARIX Platform

Esta guía proporciona instrucciones paso a paso para configurar el entorno de desarrollo de KAIBARIX Platform en tu máquina local.

## 📋 Requisitos Previos

### Software Necesario

- **Node.js**: v18.17.0 o superior ([Descargar](https://nodejs.org/))
- **npm**: v9.0.0 o superior (incluido con Node.js)
- **Git**: v2.30.0 o superior ([Descargar](https://git-scm.com/))
- **AWS CLI**: v2.0 o superior ([Instalación](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html))
- **Docker**: Opcional, para contenedores de base de datos ([Descargar](https://www.docker.com/))
- **VS Code**: Recomendado con extensiones:
  - ESLint
  - Prettier
  - Prisma
  - Tailwind CSS IntelliSense

### Verificar Instalación

```bash
node --version  # Debe ser v18.17.0+
npm --version   # Debe ser v9.0.0+
git --version   # Debe ser v2.30.0+
aws --version   # Debe ser v2.0+
docker --version # Opcional
```

## 🔑 Configuración de AWS

### 1. Instalar AWS CLI

**macOS/Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

**Windows:**
```powershell
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
```

### 2. Configurar Credenciales AWS

```bash
aws configure
```

Ingresa la siguiente información cuando se solicite:
```
AWS Access Key ID: [Tu Access Key ID]
AWS Secret Access Key: [Tu Secret Access Key]
Default region name: us-east-1
Default output format: json
```

### 3. Verificar Configuración

```bash
aws sts get-caller-identity
```

Deberías ver información sobre tu cuenta y usuario de AWS.

## 📥 Clonar el Repositorio

```bash
# Clonar el repositorio
git clone <repository-url>
cd kaibarix-platform

# Verificar estructura
ls -la
```

## 🔧 Configuración de Variables de Entorno

### Backend Variables (.env)

Crea el archivo `backend/.env`:

```bash
cd backend
touch .env
```

Agrega las siguientes variables:

```env
# Application
NODE_ENV=development
PORT=3001
API_PREFIX=api

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/kaibarix_dev?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_S3_BUCKET=kaibarix-uploads

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

### Frontend Variables (.env.local)

Crea el archivo `frontend/.env.local`:

```bash
cd ../frontend
touch .env.local
```

Agrega las siguientes variables:

```env
# Application
NEXT_PUBLIC_APP_NAME=KAIBARIX Platform
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG=true

# Environment
NODE_ENV=development
```

**Nota:** Las variables que comienzan con `NEXT_PUBLIC_` están disponibles en el navegador.

## 📦 Instalación de Dependencias

### Backend (NestJS)

```bash
cd backend

# Instalar dependencias
npm install

# Instalar dependencias globales (opcional)
npm install -g @nestjs/cli
npm install -g prisma

# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones de base de datos
npx prisma migrate dev --name init
```

### Frontend (Next.js)

```bash
cd frontend

# Instalar dependencias
npm install

# Instalar dependencias globales (opcional)
npm install -g next
```

## 🗄️ Configuración de Base de Datos

### Opción 1: PostgreSQL Local (Recomendado para Desarrollo)

#### Instalar PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Windows:**
Descargar e instalar desde [postgresql.org](https://www.postgresql.org/download/windows/)

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Crear Base de Datos

```bash
# Entrar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE kaibarix_dev;

# Crear usuario (opcional)
CREATE USER kaibarix_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE kaibarix_dev TO kaibarix_user;

# Salir
\q
```

#### Actualizar DATABASE_URL en .env

```env
DATABASE_URL="postgresql://kaibarix_user:your_password@localhost:5432/kaibarix_dev?schema=public"
```

### Opción 2: Docker (Alternativa)

```bash
# Crear docker-compose.yml en la raíz
cat > docker-compose.yml <<EOF
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: kaibarix-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: kaibarix_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: kaibarix-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
EOF

# Iniciar contenedores
docker-compose up -d

# Verificar contenedores
docker-compose ps
```

### Opción 3: AWS RDS (Para desarrollo avanzado)

```bash
# Crear instancia RDS via AWS CLI
aws rds create-db-instance \
  --db-instance-identifier kaibarix-dev \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password your-password \
  --allocated-storage 20 \
  --region us-east-1

# Obtener endpoint
aws rds describe-db-instances \
  --db-instance-identifier kaibarix-dev \
  --query "DBInstances[0].Endpoint.Address" \
  --output text
```

### Ejecutar Migraciones

```bash
cd backend

# Generar Prisma Client
npx prisma generate

# Crear migración inicial
npx prisma migrate dev --name init

# (Opcional) Abrir Prisma Studio para explorar la BD
npx prisma studio
```

## 🚀 Ejecución en Modo Desarrollo

### Iniciar Backend

```bash
cd backend

# Modo desarrollo con hot-reload
npm run start:dev

# O en modo watch
npm run start:watch
```

El backend estará disponible en: http://localhost:3001

**Endpoints disponibles:**
- API: http://localhost:3001/api
- Swagger Docs: http://localhost:3001/api
- Health Check: http://localhost:3001/health

### Iniciar Frontend

En una nueva terminal:

```bash
cd frontend

# Modo desarrollo con hot-reload
npm run dev
```

El frontend estará disponible en: http://localhost:3000

### Iniciar Redis (si no usas Docker)

```bash
# macOS (Homebrew)
brew install redis
brew services start redis

# Linux
sudo apt install redis-server
sudo systemctl start redis

# Windows
# Descargar Redis para Windows o usar Docker
```

## 🧪 Verificar Instalación

### 1. Verificar Backend

```bash
# Health check
curl http://localhost:3001/health

# Debería retornar: {"status":"ok","timestamp":"..."}
```

### 2. Verificar Frontend

Abre tu navegador en http://localhost:3000

Deberías ver la página de inicio de KAIBARIX Platform.

### 3. Verificar Conexión a Base de Datos

```bash
cd backend

# Abrir Prisma Studio
npx prisma studio
```

Esto abrirá una interfaz web en http://localhost:5555 para explorar la base de datos.

## 🛠️ Scripts de Desarrollo Útiles

### Backend

```bash
cd backend

# Desarrollo
npm run start:dev          # Hot-reload
npm run start:debug        # Debug mode
npm run start:prod         # Producción

# Build
npm run build              # Compilar TypeScript
npm run start:prod         # Ejecutar build

# Testing
npm run test               # Unit tests
npm run test:e2e           # E2E tests
npm run test:cov           # Coverage

# Linting
npm run lint               # ESLint
npm run lint:fix           # Auto-fix linting

# Database
npx prisma generate        # Generar client
npx prisma migrate dev     # Crear migración
npx prisma migrate reset   # Resetear BD
npx prisma studio          # UI de BD
npx prisma db seed         # Ejecutar seed
```

### Frontend

```bash
cd frontend

# Desarrollo
npm run dev                # Hot-reload
npm run build              # Build de producción
npm run start              # Ejecutar build

# Linting
npm run lint               # ESLint
npm run lint:fix           # Auto-fix linting

# Type checking
npm run type-check         # TypeScript check

# Testing
npm run test               # Unit tests
npm run test:e2e           # E2E tests con Playwright
```

## 🔍 Troubleshooting

### Problema: Puerto ya en uso

```bash
# Encontrar proceso usando el puerto
# macOS/Linux
lsof -i :3000
lsof -i :3001

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Matar proceso
# macOS/Linux
kill -9 <PID>

# Windows
taskkill /PID <PID> /F
```

### Problema: Error de conexión a PostgreSQL

```bash
# Verificar si PostgreSQL está corriendo
# macOS/Linux
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Windows
# Verificar servicio en Services.msc

# Reiniciar PostgreSQL
# macOS
brew services restart postgresql@15

# Linux
sudo systemctl restart postgresql
```

### Problema: Error de permisos en .env

```bash
# macOS/Linux
chmod 600 backend/.env
chmod 600 frontend/.env.local
```

### Problema: Migraciones de Prisma fallan

```bash
cd backend

# Resetear base de datos (ADVERTENCIA: borra todos los datos)
npx prisma migrate reset

# O resolver conflictos manualmente
npx prisma migrate resolve --applied "migration_name"
```

### Problema: Dependencias no instalan

```bash
# Limpiar cache de npm
npm cache clean --force

# Borrar node_modules y package-lock.json
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

## 📚 Recursos Adicionales

### Documentación Oficial
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [AWS Documentation](https://docs.aws.amazon.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Herramientas de Desarrollo
- [Prisma Studio](https://www.prisma.io/studio) - UI para base de datos
- [Postman](https://www.postman.com) - Testing de APIs
- [TablePlus](https://tableplus.com) - Cliente de base de datos
- [AWS Console](https://console.aws.amazon.com) - Consola de AWS

## 🎯 Siguientes Pasos

1. **Explorar el código**: Revisa la estructura de carpetas y archivos
2. **Leer arquitectura**: Consulta [ARCHITECTURE.md](./ARCHITECTURE.md)
3. **Crear tu primer feature**: Empieza con un componente simple
4. **Configurar git**: Configura tu nombre y email de git
5. **Unirte al equipo**: Contacta al equipo para permisos de repositorio

## 💡 Tips de Desarrollo

### VS Code Extensions Recomendadas

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "eamodio.gitlens"
  ]
}
```

### Configuración de Prettier

Crea `.prettierrc` en la raíz de cada proyecto:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### Configuración de ESLint

Crea `.eslintrc.json` en la raíz de cada proyecto:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

## 🆘 Soporte

Si encuentras problemas durante la configuración:

1. Revisa la sección de Troubleshooting arriba
2. Consulta la documentación oficial de cada tecnología
3. Busca issues similares en el repositorio
4. Contacta al equipo de desarrollo en: [dev@kaibarix.com](mailto:dev@kaibarix.com)

---

¡Listo! Tu entorno de desarrollo está configurado. Happy coding! 🚀
