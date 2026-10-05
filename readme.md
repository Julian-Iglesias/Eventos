# Plataforma de Eventos

API REST base desarrollada con Node.js y Express para una plataforma de eventos.

## Tecnologías

- Node.js
- Express
- dotenv
- nodemon

## Instalación

```bash
npm install
```

### Crear un archivo .env tomando como referencia .env.example.
Variables requeridas:
- PORT=8080
- NODE_ENV=development
- MONGO_URL=
- JWT_SECRET=

## Ejecución
```bash
npm run dev
```

o:
```bash
npm start
```

## Arquitectura
El proyecto está organizado por capas:
Route > Controller > Service > Repository > DAO

### Carpetas principales:
config/
routes/
controllers/
services/
repositories/
dao/
models/
middlewares/
utils/

### Rutas disponibles
- GET /api/health > verifica que el servidor esté activo.
- GET /api/events > devuelve la lista inicial de eventos.
- Estructura base para sessions.

## Manejo de errores
La API incluye middleware para rutas no encontradas y manejo centralizado de errores.
