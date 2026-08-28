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
- jsonwebtoken
- Passport.js
- passport-local
- passport-custom
- cookie-parser

## Instalación

Clonar el repositorio e instalar las dependencias:

```bash
npm install
```



## Variables de entorno
Crear un archivo .env en la raíz del proyecto tomando como referencia el archivo .env.example.

Variables necesarias:

PORT=8080
NODE_ENV=development
MONGO_URL=
JWT_SECRET=
JWT_EXPIRES_IN=1h

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
```text
src/
├── app.js
├── server.js
├── config/
│   ├── database.js
│   └── passport.config.js
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
│   └── .gitkeep
└── utils/
    ├── hash.js
    └── jwt.js
```


## Arquitectura
El proyecto está organizado por capas:

Ruta=
Passport / Controller > Service > Repository > DAO > Modelo > MongoDB 



## Autenticación con Passport.js
Las estrategias de autenticación están centralizadas en: src/config/passport.config.js

Actualmente existen tres estrategias:

### register
Se utiliza para registrar nuevos usuarios.
La estrategia se encarga de:
- Validar campos obligatorios.
- Validar el formato del email.
- Normalizar el email con trim() y toLowerCase().
- Validar la longitud mínima de la contraseña.
- Verificar que el email no esté registrado.
- Hashear la contraseña con bcrypt.
- Crear el usuario en MongoDB.
- Asignar automáticamente el rol user.
El rol no puede modificarse desde el body del registro público.

### login
Se utiliza para validar las credenciales del usuario.
La estrategia:
- Normaliza el email.
- Busca el usuario por email.
- Compara la contraseña con bcrypt.
- Devuelve un mensaje genérico si las credenciales no son válidas.
Por seguridad, no se informa si el error corresponde al email o a la contraseña.

### current
Se utiliza para validar al usuario autenticado.
La estrategia:
- Lee la cookie currentUser.
- Verifica el JWT.
- Deja el payload del usuario disponible en req.user.
Si no existe una cookie válida o el JWT está vencido o manipulado, responde con 401 Unauthorized.



## JWT y cookies
Después de un login exitoso, el controller genera un JWT.
El token contiene:
```json
{
  "id": "...",
  "email": "usuario@mail.com",
  "role": "user"
}
```

El JWT se firma utilizando: JWT_SECRET

Su tiempo de expiración se configura mediante: JWT_EXPIRES_IN

El token se guarda en una cookie llamada: currentUser

Configuración de la cookie:
- httpOnly: true
- sameSite: "lax"
- maxAge: 3600000
- secure: true únicamente en producción



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
Respuesta:
```json
{
  "status": "success",
  "payload": []
}
```


### POST /api/sessions/register
Registra un nuevo usuario.
Request:
```json
{
  "first_name": "Ana",
  "last_name": "Perez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

Respuesta exitosa:
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

Codigo HTTP: 201 Created
(La respuesta no incluye el campo password.)



#### Posibles errores

- Campos faltantes
```json
{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
```
Código HTTP: 400 Bad Request

- Email inválido
```json
{
  "status": "error",
  "message": "Email inválido"
}
```
Código HTTP: 400 Bad Request

- Contraseña demasiado corta
```json
{
  "status": "error",
  "message": "La contraseña debe tener al menos 8 caracteres"
}
```
Código HTTP: 400 Bad Request

- Email ya registrado
```json
{
  "status": "error",
  "message": "El email ya está registrado"
}
```
Código HTTP: 409 Conflict



### POST /api/sessions/login
Inicia sesión con email y contraseña.
Request:
```json
{
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

Respuesta exitosa:
```json
{
  "status": "success",
  "message": "Login correcto"
}
```
Código HTTP: 200 OK

Además, el servidor genera un JWT y lo guarda en la cookie HTTP Only currentUser.
Si las credenciales son incorrectas:
```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```
Código HTTP: 401 Unauthorized
El mensaje es el mismo tanto si el email no existe como si la contraseña es incorrecta.


### GET /api/sessions/current
Devuelve los datos del usuario autenticado.
Requiere una cookie currentUser válida.
Respuesta exitosa:
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
Código HTTP: 200 OK

Si no existe una sesión válida:
```json
{
  "status": "error",
  "message": "No autenticado"
}
```
Código HTTP: 401 Unauthorized



### POST /api/sessions/logout
Cierra la sesión del usuario.
El endpoint elimina la cookie: currentUser
Respuesta:
```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```
Código HTTP: 200 OK



#### Flujo de autenticación
El flujo esperado es:
POST /register > POST /login > GET /current > POST /logout > GET /current > 401 Unauthorized



## Seguridad
Las contraseñas nunca se almacenan en texto plano.
El hash se realiza utilizando bcrypt mediante: src/utils/hash.js
La lógica de JWT se encuentra en: src/utils/jwt.js
La contraseña no se incluye:
- en las respuestas de la API;
- en el payload del JWT;
- en la información devuelta por /current.
![alt text](image.png)



## Passport y futuras estrategias
La configuración de Passport está centralizada en: src/config/passport.config.js
Esto permite agregar nuevas estrategias de autenticación sin modificar app.js.
El proyecto queda preparado para incorporar en el futuro proveedores externos como:
- Google
- GitHub
Por ejemplo, podrían agregarse nuevas estrategias como:
- google
- github
manteniendo centralizada la configuración de autenticación.



## Pruebas realizadas
Se comprobaron los siguientes casos:
- Registro exitoso.
- Registro con campos faltantes.
- Registro con email duplicado.
- Login exitoso.
- Login con email inexistente.
- Login con contraseña incorrecta.
- Login con credenciales faltantes.
- /current con cookie válida.
- /current sin cookie.
- Logout exitoso.
- /current devuelve 401 después del logout.
- Contraseña almacenada hasheada en MongoDB.
- Password no incluido en respuestas ni JWT.
