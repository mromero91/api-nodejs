# Aura Backend API

Una API REST moderna construida con arquitectura hexagonal, diseñada para escalabilidad y mantenibilidad.

## Stack Tecnológico

- **Runtime**: Node.js con TypeScript
- **Framework**: Express.js
- **Base de Datos**: PostgreSQL con TypeORM
- **Autenticación**: JWT con bcrypt
- **Contenedores**: Docker
- **Validación**: Middleware personalizado
- **Desarrollo**: Nodemon con hot-reload

## Arquitectura Hexagonal

Nuestra arquitectura sigue el patrón hexagonal (Clean Architecture) que separa la lógica de negocio de los detalles de implementación:

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERFACES LAYER                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   Controllers   │  │   Middlewares   │  │   Routes    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   Use Cases     │  │   Services      │  │  Factories  │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     DOMAIN LAYER                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │    Entities     │  │   Repositories  │  │  Services   │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   Database      │  │   External APIs │  │   Config    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### ¿Por qué Arquitectura Hexagonal?

- **Testabilidad**: Cada capa se puede probar independientemente
- **Mantenibilidad**: Cambios en una capa no afectan las otras
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Flexibilidad**: Cambiar implementaciones sin afectar el negocio
- **Inversión de Dependencias**: El dominio no depende de frameworks

## Configuración de Alias

Los alias están definidos en `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@domain/*": ["domain/*"],
      "@application/*": ["application/*"],
      "@infrastructure/*": ["infrastructure/*"],
      "@interfaces/*": ["interfaces/*"]
    }
  }
}
```

## Migraciones de Base de Datos

### Generar Nueva Migración
```bash
npm run typeorm:create -- src/infrastructure/database/migrations/NombreMigracion
```

### Ejecutar Migraciones
```bash
npm run migrate
```

### Ver Estado de Migraciones
```bash
npm run migrate:status
```

### Revertir Última Migración
```bash
npm run migrate:revert
```

## API Endpoints

### Autenticación

#### Registro de Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "me@mromero.mx",
    "password": "secret",
    "firstName": "Miguel",
    "lastName": "Romero"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "3924dd7b-2073-4e08-8681-069db9c1b546",
      "email": "me@mromero.mx",
      "firstName": "Miguel",
      "lastName": "Romero",
      "active": true,
      "role": "user",
      "createdAt": "2025-10-25T17:28:39.685Z",
      "updatedAt": "2025-10-25T17:28:39.685Z"
    },
    "message": "User registered successfully"
  }
}
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "me@mromero.mx",
    "password": "secret"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "3924dd7b-2073-4e08-8681-069db9c1b546",
      "email": "me@mromero.mx",
      "firstName": "Miguel",
      "lastName": "Romero",
      "active": true,
      "role": "user",
      "createdAt": "2025-10-25T17:28:39.685Z",
      "updatedAt": "2025-10-25T17:28:39.685Z"
    },
    "token": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "24h"
    },
    "message": "Login successful"
  }
}
```

### Gestión de Usuarios

#### Obtener Perfil
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "3924dd7b-2073-4e08-8681-069db9c1b546",
      "email": "me@mromero.mx",
      "firstName": "Miguel",
      "lastName": "Romero",
      "active": true,
      "role": "user",
      "createdAt": "2025-10-25T17:28:39.685Z",
      "updatedAt": "2025-10-25T17:28:39.685Z"
    }
  }
}
```

#### Actualizar Perfil
```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Miguel Updated",
    "lastName": "Romero Updated"
  }'
```

#### Listar Usuarios
```bash
curl -X GET http://localhost:3000/api/users/ \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "3924dd7b-2073-4e08-8681-069db9c1b546",
        "email": "me@mromero.mx",
        "firstName": "Miguel",
        "lastName": "Romero",
        "active": true,
        "role": "user",
        "createdAt": "2025-10-25T17:28:39.685Z",
        "updatedAt": "2025-10-25T17:28:39.685Z"
      }
    ],
    "total": 1
  }
}
```

## Desarrollo

### Iniciar Servidor
```bash
npm run dev
```

### Construir para Producción
```bash
npm run build
npm start
```

### Linting y Formato
```bash
npm run lint
npm run lint:fix
npm run format
```

## Características Técnicas

- **Seguridad**: Contraseñas hasheadas con bcrypt (12 salt rounds)
- **Autenticación**: JWT con expiración configurable
- **Base de Datos**: PostgreSQL con UUIDs como claves primarias
- **Validación**: Middleware de autenticación robusto
- **Arquitectura**: Separación clara de responsabilidades
- **Tipado**: TypeScript estricto en toda la aplicación
- **Contenedores**: Docker para desarrollo y producción