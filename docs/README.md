# KAIBARIX Platform

KAIBARIX Platform es una aplicación web moderna y escalable construida con una arquitectura de microservicios que combina las mejores tecnologías de frontend y backend en la nube.

## 🚀 Descripción del Proyecto

KAIBARIX Platform es una plataforma de gestión empresarial que proporciona:
- Gestión de usuarios y autenticación segura
- Panel de administración con analytics en tiempo real
- API RESTful robusta con NestJS
- Interfaz de usuario moderna con Next.js
- Escalabilidad horizontal en AWS

## 🛠 Stack Tecnológico

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Estado**: React Context / Zustand
- **UI Components**: shadcn/ui
- **HTTP Client**: Axios / Fetch

### Backend
- **Framework**: NestJS 10+
- **Lenguaje**: TypeScript
- **ORM**: Prisma
- **Validación**: class-validator / class-transformer
- **Documentación**: Swagger/OpenAPI
- **Autenticación**: JWT + Passport

### Base de Datos
- **Relacional**: PostgreSQL
- **Cache**: Redis
- **ORM**: Prisma

### Cloud Infrastructure
- **Hosting**: AWS Amplify
- **Serverless**: AWS Lambda
- **Base de Datos**: AWS RDS (PostgreSQL)
- **Almacenamiento**: AWS S3
- **CDN**: AWS CloudFront
- **CI/CD**: AWS CodePipeline

## 📁 Estructura del Proyecto

```
kaibarix-platform/
├── docs/                   # Documentación del proyecto
│   ├── README.md          # Documentación general
│   ├── ARCHITECTURE.md    # Arquitectura del sistema
│   └── SETUP.md           # Guía de configuración
├── frontend/              # Aplicación Next.js
│   ├── app/              # App Router
│   ├── components/       # Componentes React
│   ├── lib/              # Utilidades y helpers
│   ├── public/           # Archivos estáticos
│   └── package.json
├── backend/              # Aplicación NestJS
│   ├── src/
│   │   ├── modules/      # Módulos de funcionalidad
│   │   ├── common/       # Utilidades compartidas
│   │   ├── config/       # Configuración
│   │   └── main.ts       # Punto de entrada
│   ├── prisma/           # Schema de base de datos
│   └── package.json
└── README.md            # Documentación raíz
```

## 📦 Instalación

### Requisitos Previos
- Node.js 18+ 
- npm 9+ o yarn/pnpm
- AWS CLI configurado
- Cuenta de AWS con permisos adecuados

### Clonar el Repositorio
```bash
git clone <repository-url>
cd kaibarix-platform
```

### Instalación de Dependencias

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### Configuración de Variables de Entorno

Ver el archivo [SETUP.md](./SETUP.md) para instrucciones detalladas de configuración.

## 🎯 Scripts de Desarrollo

### Frontend (Next.js)
```bash
cd frontend

# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

### Backend (NestJS)
```bash
cd backend

# Desarrollo
npm run start:dev

# Build de producción
npm run build

# Iniciar producción
npm run start:prod

# Ejecutar pruebas
npm run test

# Ejecutar pruebas con coverage
npm run test:cov

# Linting
npm run lint

# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev
```

## 🔧 Comandos de Infraestructura AWS

```bash
# Desplegar en AWS Amplify
amplify publish

# Ver logs de Lambda
aws logs tail /aws/lambda/kaibarix-function --follow

# Desplegar stack de CloudFormation
aws cloudformation deploy \
  --template-file infrastructure/template.yaml \
  --stack-name kaibarix-platform \
  --capabilities CAPABILITY_IAM
```

## 🌐 URLs de Desarrollo

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation (Swagger)**: http://localhost:3001/api
- **Prisma Studio**: http://localhost:5555

## 📚 Documentación Adicional

- [Arquitectura del Sistema](./ARCHITECTURE.md)
- [Guía de Configuración](./SETUP.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [AWS Documentation](https://docs.aws.amazon.com)

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Equipo

- **Development Team**: KAIBARIX Team
- **Contact**: [team@kaibarix.com](mailto:team@kaibarix.com)

---

Para más información sobre la configuración y desarrollo, consulta las guías en la carpeta `docs/`.
