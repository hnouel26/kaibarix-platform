# Arquitectura de KAIBARIX Platform

Este documento describe la arquitectura técnica de KAIBARIX Platform, incluyendo los componentes principales, flujo de datos y decisiones de diseño.

## 🏗️ Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                        │
│                     React / Next.js Application                  │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AWS CloudFront (CDN)                        │
│                    Static Assets & Caching                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AWS Amplify (Frontend Hosting)                │
│                      Next.js Application                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    App Router Structure                     │ │
│  │  ├── /page.tsx          (Homepage)                          │ │
│  │  ├── /dashboard/        (Dashboard protegido)               │ │
│  │  ├── /api/              (API Routes de Next.js)             │ │
│  │  └── /components/       (Componentes React)                │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │ API Calls (REST)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway (AWS)                             │
│              Routing & Authentication Layer                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AWS Lambda Functions                           │
│                   NestJS Serverless Deployment                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              NestJS Application Structure                   │ │
│  │  ├── AppModule              (Módulo raíz)                    │ │
│  │  ├── AuthModule             (Autenticación JWT)             │ │
│  │  ├── UsersModule            (Gestión de usuarios)           │ │
│  │  ├── BusinessModule         (Lógica de negocio)             │ │
│  │  └── DatabaseModule         (Conexión a BD)                 │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────┬───────────────────────┬────────────────────────────────┘
          │                       │
          ▼                       ▼
┌───────────────────┐   ┌───────────────────┐
│   AWS RDS         │   │   AWS ElastiCache │
│  (PostgreSQL)     │   │    (Redis)        │
│                   │   │                   │
│  - Users          │   │  - Sessions       │
│  - Business Data  │   │  - Cache          │
│  - Audit Logs     │   │  - Queues         │
└───────────────────┘   └───────────────────┘
          │                       │
          └───────────┬───────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AWS S3 (Storage)                              │
│  - User uploads (images, documents)                              │
│  - Static assets                                                  │
│  - Backup files                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 🎨 Frontend Architecture (Next.js)

### Stack Tecnológico
- **Framework**: Next.js 14+ con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui
- **Estado**: React Context API / Zustand
- **Formularios**: React Hook Form + Zod
- **HTTP**: Axios con interceptors

### Estructura de Componentes

```
frontend/
├── app/                          # App Router
│   ├── layout.tsx               # Layout raíz
│   ├── page.tsx                 # Homepage
│   ├── (auth)/                  # Grupo de rutas auth
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/             # Grupo de rutas protegidas
│   │   ├── dashboard/
│   │   ├── users/
│   │   └── settings/
│   └── api/                     # API Routes de Next.js
│       └── webhooks/
├── components/                  # Componentes React
│   ├── ui/                      # Componentes base (shadcn/ui)
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── features/                # Feature-specific components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── users/
│   └── common/                  # Shared components
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── DataTable.tsx
├── lib/                         # Utilidades
│   ├── api/                     # API clients
│   │   └── client.ts
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts
│   │   └── useApi.ts
│   ├── utils/                   # Helper functions
│   └── config/                  # Configuración
└── public/                      # Archivos estáticos
```

### Flujo de Datos Frontend

```
User Action → Component → Custom Hook → API Client → Backend API
     ↓              ↓            ↓             ↓
   State Update  Re-render  Data Fetch  Response Handling
```

### Estrategia de Estado
- **Estado Global**: Zustand store para autenticación y preferencias
- **Estado Local**: React useState para componentes individuales
- **Estado del Servidor**: React Server Components (RSC) para datos iniciales
- **Cache**: React Query / SWR para data fetching

## 🔧 Backend Architecture (NestJS)

### Stack Tecnológico
- **Framework**: NestJS 10+ (Node.js)
- **Lenguaje**: TypeScript
- **ORM**: Prisma
- **Validación**: class-validator + class-transformer
- **Documentación**: Swagger/OpenAPI
- **Autenticación**: JWT + Passport
- **Logging**: Winston / Pino

### Estructura de Módulos

```
backend/src/
├── main.ts                      # Punto de entrada
├── app.module.ts                # Módulo raíz
├── config/                      # Configuración
│   ├── database.config.ts
│   ├── aws.config.ts
│   └── env.config.ts
├── common/                      # Utilidades compartidas
│   ├── decorators/              # Custom decorators
│   ├── filters/                 # Exception filters
│   ├── guards/                  # Auth guards
│   ├── interceptors/            # Logging, transform
│   ├── middlewares/             # Custom middlewares
│   └── pipes/                   # Validation pipes
├── modules/                     # Módulos de funcionalidad
│   ├── auth/                    # Autenticación
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── strategies/          # Passport strategies
│   │   └── dto/                 # Data Transfer Objects
│   ├── users/                   # Gestión de usuarios
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   └── dto/
│   ├── business/                # Lógica de negocio
│   │   ├── business.controller.ts
│   │   ├── business.service.ts
│   │   ├── business.module.ts
│   │   └── dto/
│   └── database/                # Base de datos
│       ├── database.module.ts
│       └── prisma.service.ts
└── prisma/                      # Prisma schema
    └── schema.prisma
```

### Patrón de Arquitectura Backend

NestJS sigue una arquitectura modular basada en:

1. **Modules**: Encapsulan funcionalidad relacionada
2. **Controllers**: Manejan requests HTTP
3. **Services**: Contienen lógica de negocio
4. **DTOs**: Validación de datos de entrada
5. **Repositories**: Acceso a datos (vía Prisma)

### Flujo de Request Backend

```
HTTP Request → Middleware → Guard → Controller → Service → Repository → Database
                     ↓         ↓          ↓         ↓           ↓
                 Logging   Auth     Validation  Business     Prisma
```

## 🗄️ Base de Datos Architecture

### PostgreSQL (AWS RDS)

**Schema Principal:**
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  password      String
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  // ... relaciones
}

enum Role {
  USER
  ADMIN
  SUPER_ADMIN
}
```

**Características:**
- **Replicación**: Multi-AZ para alta disponibilidad
- **Backups**: Automáticos diarios y snapshots manuales
- **Security**: VPC private, encryption at rest and in transit
- **Scaling**: Read replicas para queries de lectura

### Redis (AWS ElastiCache)

**Uso de Redis:**
- **Session Storage**: Tokens de sesión activos
- **Cache**: Caching de queries frecuentes
- **Rate Limiting**: Limitación de requests por usuario
- **Pub/Sub**: Notificaciones en tiempo real

**Estrategia de Caching:**
```
L1: Browser Cache (HTTP headers)
L2: CDN Cache (CloudFront)
L3: Application Cache (Redis)
L4: Database (PostgreSQL)
```

## ☁️ Cloud Infrastructure (AWS)

### Servicios AWS Utilizados

#### 1. AWS Amplify
- **Frontend Hosting**: Despliegue de Next.js
- **CI/CD**: Automated builds desde GitHub
- **Features**: Branch previews, domain management

#### 2. AWS Lambda
- **Backend Serverless**: NestJS adaptado para Lambda
- **Autoscaling**: Escalado automático basado en tráfico
- **Cold Starts**: Optimizado con provisioned concurrency

#### 3. API Gateway
- **REST API**: Endpoint único para API
- **Authentication**: Cognito user pools integration
- **Throttling**: Rate limiting configurado
- **Caching**: Response caching para endpoints GET

#### 4. AWS RDS (PostgreSQL)
- **Database**: PostgreSQL 15+
- **Instance**: db.t3.medium (escalable)
- **Storage**: gp3 SSD (IOPS provisionados)
- **Security**: Security groups, encryption

#### 5. AWS ElastiCache (Redis)
- **Cluster**: Redis 7+
- **Node Type**: cache.t3.micro
- **Mode**: Cluster mode disabled (single node)
- **Security**: VPC private, encryption

#### 6. AWS S3
- **Storage**: User uploads, static assets
- **Buckets**: 
  - `kaibarix-uploads` (user content)
  - `kaibarix-assets` (static assets)
- **Security**: Bucket policies, presigned URLs

#### 7. AWS CloudFront
- **CDN**: Distribución global de contenido
- **Cache**: Configuración por path pattern
- **SSL**: ACM certificate
- **Security**: WAF integration

#### 8. AWS CloudFormation
- **IaC**: Infrastructure as Code
- **Stacks**: Backend, Database, Networking
- **Updates**: Rolling updates para zero downtime

### Arquitectura de Red

```
Internet
    │
    ▼
┌───────────────────┐
│  CloudFront CDN   │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│   Route 53 DNS    │
└─────────┬─────────┘
          │
          ▼
┌─────────────────────────────────────┐
│           VPC (10.0.0.0/16)         │
│  ┌───────────────────────────────┐  │
│  │  Public Subnets (10.0.1.0/24)│  │
│  │  - ALB / API Gateway          │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  Private Subnets (10.0.2.0/24)│  │
│  │  - Lambda Functions           │  │
│  │  - RDS PostgreSQL             │  │
│  │  - ElastiCache Redis          │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## 🔄 Flujo de Datos Completo

### 1. Flujo de Autenticación

```
1. User ingresa credenciales en Frontend
2. Frontend → POST /api/auth/login
3. Backend valida credenciales
4. Backend genera JWT token
5. Backend retorna token + user data
6. Frontend guarda token en localStorage/cookie
7. Frontend incluye token en headers de requests subsiguientes
8. Backend valida token via JWT Guard
9. Request autorizado → Procesamiento
```

### 2. Flujo de Data Fetching

```
1. Component monta → useEffect hook
2. Hook llama API client
3. API client agrega auth token
4. Request → API Gateway → Lambda
5. NestJS controller recibe request
6. Validation via DTO
7. Service ejecuta lógica de negocio
8. Service consulta Redis (cache)
9. Si cache miss → consulta PostgreSQL
10. Resultado almacenado en Redis
11. Response serializado y enviado
12. Frontend actualiza estado
13. Component re-renderiza con nuevos datos
```

### 3. Flujo de File Upload

```
1. User selecciona archivo en Frontend
2. Frontend solicita presigned URL a Backend
3. Backend genera presigned URL (S3)
4. Frontend sube archivo directamente a S3
5. S3 confirma upload exitoso
6. Frontend notifica Backend con file metadata
7. Backend guarda referencia en PostgreSQL
8. Frontend muestra confirmación al usuario
```

## 🔐 Seguridad

### Autenticación y Autorización
- **JWT Tokens**: Access tokens (15min) + Refresh tokens (7d)
- **Password Hashing**: bcrypt con salt rounds = 10
- **Role-Based Access Control**: Roles y permisos por recurso
- **API Security**: Rate limiting, CORS configurado

### Data Security
- **Encryption**: TLS 1.3 en transit, AES-256 at rest
- **PII Protection**: Datos sensibles encriptados en BD
- **Audit Logging**: Todos los cambios de datos auditados
- **Backup Strategy**: Backups diarios con retención de 30 días

### Network Security
- **VPC**: Aislamiento de recursos en red privada
- **Security Groups**: Reglas de acceso mínimas necesarias
- **WAF**: Protección contra ataques comunes (SQLi, XSS)
- **DDoS Protection**: AWS Shield Standard

## 📊 Monitoreo y Logging

### Logging Strategy
- **Application Logs**: Winston / Pino → CloudWatch Logs
- **Access Logs**: API Gateway → CloudWatch
- **Error Tracking**: Sentry integration
- **Audit Logs**: Tabla dedicada en PostgreSQL

### Monitoring
- **Metrics**: CloudWatch Metrics (CPU, Memory, Latency)
- **Alarms**: SNS notifications para umbrales críticos
- **Health Checks**: /health endpoint en Backend
- **Performance**: X-Ray tracing para distributed tracing

## 🚀 Deployment Strategy

### CI/CD Pipeline

```
GitHub Push → AWS CodePipeline
    ↓
Build Stage (CodeBuild)
    ↓
Test Stage (Unit + E2E tests)
    ↓
Deploy Stage (Staging)
    ↓
Manual Approval
    ↓
Deploy Stage (Production)
```

### Environment Strategy
- **Development**: Local + Amplify dev branch
- **Staging**: Amplify staging branch + staging DB
- **Production**: Amplify production branch + production DB

## 📈 Escalabilidad

### Horizontal Scaling
- **Frontend**: Amplify auto-scaling
- **Backend**: Lambda concurrent executions
- **Database**: Read replicas para queries de lectura
- **Cache**: Redis cluster mode cuando sea necesario

### Vertical Scaling
- **Database**: Instance class upgrades
- **Cache**: Node size upgrades
- **Lambda**: Memory timeout configuration

## 🎯 Decisiones de Diseño

### ¿Por qué Next.js?
- Server-Side Rendering para SEO
- API Routes integradas para BFF (Backend for Frontend)
- Optimización automática de imágenes
- Excelente developer experience

### ¿Por qué NestJS?
- Arquitectura modular y escalable
- Inyección de dependencias built-in
- Soporte nativo para TypeScript
- Extensible con middleware y guards

### ¿Por qué AWS Serverless?
- Pay-per-use (costo basado en consumo)
- Autoscaling automático
- Sin gestión de servidores
- Alta disponibilidad por defecto

### ¿Por qué Prisma?
- Type-safe database access
- Migraciones automáticas
- Excelente DX con TypeScript
- Soporte para múltiples databases

---

Para más información sobre configuración y desarrollo, consulta [SETUP.md](./SETUP.md).
