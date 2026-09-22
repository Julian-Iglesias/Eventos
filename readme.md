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
- Nodemailer

## Instalación

```bash```

npm install




# Crear un archivo .env en la raíz del proyecto tomando como referencia .env.example.
```json
port=8080

node_env=development

mongo_url=

jwt_secret=
jwt_expires_in=1h

mail_host=smtp.gmail.com
mail_port=587
mail_user=
mail_pass=
mail_from=
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




# Tickets e inscripciones


## Estados de ticket
- confirmed
- pending
- cancelled
Los tickets cancelados permanecen almacenados pero dejan de ocupar cupo.


### Rutas de tickets
| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/events/:eid/tickets` | Autenticado |
| GET | `/api/tickets/my-tickets` | Autenticado |
| GET | `/api/events/:eid/tickets` | Organizer dueño o admin |
| PATCH | `/api/tickets/:tid/cancel` | Dueño del ticket o admin |


#### Reglas de inscripción
- El evento debe existir y estar en estado `published`.
- `quantity` debe ser mayor a 0.
- Debe haber cupos suficientes.
- Los tickets `cancelled` no cuentan como cupos ocupados.
- Un usuario no puede tener más de una inscripción activa para el mismo evento.
- Al cancelar un ticket se cambia su estado a `cancelled` y se registra `cancelledAt`.
- Los tickets no se eliminan físicamente.
- Un organizer solo puede consultar tickets de sus propios eventos.
- Un admin puede consultar tickets de cualquier evento.


##### Notificaciones por email
Al confirmar una inscripción se envía un email mediante Nodemailer.

El correo incluye:
- nombre del evento
- cantidad de entradas
- código de reserva

Las credenciales SMTP se configuran mediante variables de entorno y no se almacenan en el código ni se suben al repositorio.




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