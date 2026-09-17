# Plataforma de Eventos

API REST desarrollada con Node.js, Express y MongoDB para gestionar usuarios, autenticación, roles y eventos.

## Tecnologías

- Node.js
- Express
- MongoDB + Mongoose
- Passport.js
- JWT
- bcrypt
- cookie-parser
- dotenv

## Instalación

```bash```

npm install




# Crear un archivo .env en la raíz del proyecto tomando como referencia .env.example.
```json
PORT=8080
NODE_ENV=development
MONGO_URL=
JWT_SECRET=
JWT_EXPIRES_IN=1h
```




# Ejecutar en desarrollo:
```bash
npm run dev
```




# Servidor por defecto:
http://localhost:8080




# Arquitectura
El proyecto utiliza una arquitectura por capas:
Route
> Middleware / Passport
> Controller
> Service
> Repository
> DAO
> Model
> MongoDB




# Roles
Los roles disponibles son:
- user
- organizer
- admin

El rol por defecto es user.

El registro público no permite asignar manualmente roles organizer o admin.




# Autenticación
La autenticación se realiza con Passport.js y JWT.

El JWT se almacena en una cookie HTTP Only llamada: currentUser




# Rutas principales:
| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/sessions/register` | Público |
| POST | `/api/sessions/login` | Público |
| GET | `/api/sessions/current` | Autenticado |
| POST | `/api/sessions/logout` | Autenticado |




# Eventos
El modelo Event incluye:
- title
- description
- category
- date
- location
- capacity
- price
- status
- organizer

## Estados permitidos:
- draft
- published
- cancelled
- finished

organizer es una referencia al usuario que creó el evento.




# Rutas de eventos
| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/events` | organizer, admin |
| GET | `/api/events` | Público |
| GET | `/api/events/:id` | Público |
| PUT | `/api/events/:id` | Dueño o admin |
| PATCH | `/api/events/:id/status` | Dueño o admin |




# Reglas de negocio
- No se pueden crear eventos con fecha pasada.
- capacity debe ser mayor a 0.
- price debe ser mayor o igual a 0.
- El organizer se obtiene automáticamente desde el usuario autenticado.
- Un organizer solo puede modificar sus propios eventos.
- Un admin puede modificar cualquier evento.
- El campo organizer no puede modificarse desde el body.
- Los eventos cancelados no pueden modificarse.
- Cancelar un evento cambia su estado a cancelled; no se elimina de la base.
- No se puede publicar un evento cancelado o finalizado.




# Filtros y paginación
GET /api/events acepta:
- status
- category
- location
- dateFrom
- dateTo
- page
- limit
- sort




# Ejemplo:
GET /api/events?status=published&category=workshop&page=1&limit=5&sort=date
La respuesta incluye:
{
  "data": [],
  "page": 1,
  "limit": 5,
  "total": 0,
  "totalPages": 0
}




# Autorización
Los middlewares:
src/middlewares/auth.middleware.js
src/middlewares/authorize.middleware.js

controlan autenticación y roles.
- 401 Unauthorized: no existe una sesión válida.
- 403 Forbidden: el usuario está autenticado pero no tiene permisos.




# Usuarios
Ruta administrativa:
GET /api/users
Solo accesible por admin.

Las contraseñas no se devuelven en las respuestas.




# Seguridad
- Contraseñas hasheadas con bcrypt.
- JWT firmado con JWT_SECRET.
- JWT almacenado en cookie HTTP Only.
- Password no incluido en respuestas ni en el JWT.
- .env y node_modules no se suben al repositorio.