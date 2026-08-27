# Plataforma de Eventos

API REST desarrollada con Node.js y Express para la gestión de una plataforma de eventos e inscripciones.

El proyecto está organizado con una arquitectura por capas para facilitar su mantenimiento y permitir que pueda crecer en próximas actualizaciones.


## Tecnologías

- Node.js
- Express
- MongoDB
- Mongoose
- bcrypt
- dotenv
- JavaScript con módulos ESM


## Instalación

Clonar el repositorio e instalar las dependencias:

```bash
npm install
```



## Registro de usuarios

### POST /api/sessions/register

Permite registrar un nuevo usuario.

Campos esperados:

```json
{
  "first_name": "Ana",
  "last_name": "Perez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```



## Variables de entorno
Crear un archivo .env en la raíz del proyecto tomando como referencia el archivo .env.example.

Variables necesarias:

PORT=8080
NODE_ENV=development
MONGO_URL=
JWT_SECRET=

El archivo .env contiene información privada y no debe subirse al 
repositorio.



## Ejecutar el proyecto
Para ejecutar el proyecto en modo desarrollo:
```bash
npm run dev
```
Para ejecutar el proyecto normalmente:
```bash
npm start
```
Por defecto, el servidor se ejecuta en:
http://localhost:8080



## Estructura de carpetas
src/
├── app.js
├── server.js
├── config/
│   └── database.js
├── routes/
│   ├── events.router.js
│   └── sessions.router.js
├── controllers/
│   ├── events.controller.js
│   └── sessions.controller.js
├── services/
│   └── sessions.service.js
├── repositories/
│   └── users.repository.js
├── dao/
│   └── users.dao.js
├── models/
│   ├── User.js
│   └── Event.js
├── middlewares/
└── utils/
    └── hash.js



## Rutas disponibles

### GET /api/health
Permite verificar que el servidor esté funcionando.
Respuesta:
```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

### GET /api/events
Obtiene la lista de eventos.
Actualmente devuelve una lista vacía.
Respuesta:
```json
{
  "status": "success",
  "payload": []
}
```

### POST /api/sessions/register
Permite registrar un nuevo usuario en la plataforma.



## Registro de usuarios
Para probar el registro se debe realizar una petición POST a:
http://localhost:8080/api/sessions/register

El body debe enviarse en formato JSON con los siguientes campos:
```json
{
  "first_name": "Ana",
  "last_name": "Perez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

Los campos obligatorios son:
- first_name
- last_name
- email
- password

El sistema realiza las siguientes validaciones:
- Todos los campos deben estar presentes.
- El email debe tener un formato válido.
- El email se normaliza utilizando trim() y toLowerCase().
- La contraseña debe tener al menos 8 caracteres.
- No se permite registrar un email que ya exista.
- El rol se asigna automáticamente como user.
- El rol no puede ser modificado desde el body del registro público.
- La contraseña se guarda hasheada utilizando bcrypt.
- La contraseña no se devuelve en la respuesta.



## Registro exitoso
Ejemplo de respuesta:
```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "first_name": "Ana",
    "last_name": "Perez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```
Código HTTP:
201 Created



## Posibles errores

### Campos faltantes
```json
{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
```
Código HTTP:
400 Bad Request

### Email inválido
```json
{
  "status": "error",
  "message": "Email inválido"
}
```
Código HTTP:
400 Bad Request

### Contraseña demasiado corta
```json
{
  "status": "error",
  "message": "La contraseña debe tener al menos 8 caracteres"
}
```
Código HTTP:
400 Bad Request

### Email ya registrado
```json
{
  "status": "error",
  "message": "El email ya está registrado"
}
```
Código HTTP:
409 Conflict



## Seguridad
Las contraseñas no se almacenan en texto plano.
Antes de guardar un usuario en MongoDB, la contraseña se hashea utilizando bcrypt mediante un helper reutilizable ubicado en:
src/utils/hash.js
La respuesta del endpoint de registro nunca incluye el campo password, ni en texto plano ni hasheado.

![alt text](image.png)



## Rutas disponibles

### GET /api/health
Verifica que el servidor esté funcionando.

- Respuesta:
```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

### GET /api/events
Obtiene la lista de eventos.

``` json
{
  "status": "success",
  "payload": []
}
```

### POST /api/sessions/register
Registra un nuevo usuario.

- Request:
```json
{
  "first_name": "Ana",
  "last_name": "Perez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

- Respuesta exitosa:
```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "first_name": "Ana",
    "last_name": "Perez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

- Errores posibles:
```json
{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
{
  "status": "error",
  "message": "Email inválido"
}
{
  "status": "error",
  "message": "El email ya está registrado"
}
```

### POST /api/sessions/login
Inicia sesión con email y contraseña.

- Request:
```json
{
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

- Respuesta exitosa:
```json
{
  "status": "success",
  "message": "Login correcto"
}
```
Además, el servidor guarda el JWT en una cookie HTTP Only llamada currentUser.

- Si las credenciales son incorrectas:
```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```

### GET /api/sessions/current
Devuelve los datos del usuario autenticado.
Requiere la cookie currentUser.

- Respuesta exitosa:
```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

- Si no hay una sesión válida:
```json
{
  "status": "error",
  "message": "No autenticado"
}
```

### POST /api/sessions/logout
Cierra la sesión y elimina la cookie currentUser.

Respuesta:
```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```