## Backend Checkpoint

### Descripción

Desarrollo de una API para el manejo de ordenes, las cuales estan relacionadas con usuarios, trucks, ubicación de origen y destino.
La funcionalidad final permite que un usuario pueda crear ordenes vinculadas a un truck, origen, destino, user y completar su status.
Cada dominio tiene un CRUD.
Autenticación con JWT y control de token en cada servicio.

1. Autenticación de usuarios

- Registro de usuario con email y password.
- Login retorna token JWT.
- Los endpoints requieren un token valido para permitir el acceso.

2. Users

- Endpoints CRUD.

3. Trucks

- Datos de truck: user, color, year and plates.
- Endpoints CRUD.

4. Locations

- Datos de location: place_id de Google Maps.
- Se obtiene la dirección y coordenadas del place_id utilizando la API de Google Maps.
- Endpoints CRUD.

5. Ordenes

- Datos de orden: user, status, truck, pickup, dropoff.
- Endpoints CRUD + endpoint para cambiar el status de una orden.

Para todos los dominios, se realizan controles de datos de entrada, control de duplicados al registrar y modificar, y controles al eliminar. Ejemplo: no se puede eliminar una location si esta asociada a una orden.

## Pre-Requisitos

- Node.js v18 o superior
- Docker instalado (para la BD)
- Ports free: 3000 and 27017
- Una Google Places API Key

### Como levantar la BD (Docker)

```
chmod +x ./up.sh
./up.sh
```

### Como detener la BD (Docker)

```
chmod +x ./down.sh
./down.sh
```

### Como ejecutar la APP
configurar .env

bash
npm install
npm run start:dev


## Techs

- Node: node:20.9.0
- Nest: 11.0.1
- Typescript
- MongoDB
- Mongoose

## Decisiones Tomadas

- NestJS: para establecer arquitectura modular con separación de responsabilidades de cada dominio, lo cual facilita el mantenimiento. Uso del patrón de inyección de dependencias para desacoplar clases. Typescript Nativo para definición de interfaces y DTOs.
- Clean Architecture: facilita la escalabilidad, el testing y mejor adaptación para cambios a futuro.
- MongoDB y Mongoose: para los servicios de ordenes, se utilizó aggregations para obtener la información completa de cada orden junto con usuario, locations y trucks, optimizando el rendimiento en las consultas a la BD.
- Repository Pattern para abstraer la logica de la BD/Mongoose de los servicios encargados de la logica de negocio.
- Mappers para la transformación de los datos desde BD a entidades de dominio.
- Autenticación con jwt y passport.js. Uso de Guards para protección de las rutas.
- Validaciones de DTOs utilizando class-validator y class-transformer.
- Bcrypt: para el hashing de las password
- Swagger: para la documentación de la API

## Areas a mejorar

- Testing de los endpoints, con mock de la API de Google Places API
- Deployment del proyecto

## Route de Documentación de la API

- Local: [API Swagger](http://localhost:3000/api)
