# Guía para Configurar un Contenedor MariaDB con Docker

Este documento proporciona instrucciones detalladas para configurar un contenedor de MariaDB utilizando Docker, realizar operaciones con la base de datos y entender la estructura del proyecto.

## **1. Crear el Contenedor**
Para desplegar un contenedor con la imagen oficial de MariaDB y exponer el puerto 3306 en local, ejecuta:

```bash
docker run -d --name sql -e MYSQL_ROOT_PASSWORD=1234 -p 3306:3306 mariadb
```

## **2. Eliminar y Crear la Base de Datos**
Crear la base de datos `bd_mims` sino existe:

```bash
docker exec -it psql psql -U postgres -c "CREATE DATABASE bd_mims;"
```

## **3. Crear una Copia de Seguridad de la Base de Datos**
Para generar un respaldo de la base de datos `bd_mims`, ejecuta:

```bash
docker exec -t psql pg_dump -U postgres -d bd_mims -Fc > backup.dump
```

## **4. Restaurar una Copia de Seguridad**
Si necesitas restaurar un respaldo previo de la base de datos, usa:

```bash
docker exec -it psql psql -U postgres -c "DROP DATABASE IF EXISTS bd_mims;"
docker exec -it psql psql -U postgres -c "CREATE DATABASE bd_mims;"
docker exec -i psql pg_restore -U postgres -d bd_mims < backup.dump

```

---

# **Estructura de Carpetas del Proyecto**
El proyecto sigue una organización modular basada en la arquitectura hexagonal, lo que mejora la mantenibilidad y escalabilidad del código al separar la lógica de negocio de las capas de infraestructura y presentación.

```
/src
  ├── /bd_backup/bd             # Carpeta para almacenar copias de seguridad de la base de datos
  ├── /core                     # Contiene la lógica de negocio principal
  │   ├── /usuarios             # Módulo de usuarios
  │   │   ├── usuarioPort.ts        # Interfaz que define el contrato del servicio
  │   │   ├── usuario.service.ts    # Servicio con la lógica de negocio de usuarios
  │
  ├── /interfaces               # Definición de las interfaces de comunicación
  │   ├── /api                  # API REST
  │   │   ├── /usuarios         # Endpoints relacionados con usuarios
  │   │   │   ├── usuario.controller.ts  # Controlador de usuarios
  │   │   │   ├── usuario.module.ts      # Módulo que agrupa controladores y servicios
  │   │   │   ├── usuario-port.token.ts  # Token para inyección de dependencias
  │   │   │   ├── usuarioController.ts   # Alternativa de controlador (¿duplicado?)
  │   │   │   ├── /dtos                  # Objetos de transferencia de datos (DTOs)
  │   │   │   │   ├── crear-usuario.dto.ts  # DTO para validación de datos al crear usuario
  │   │   ├── /models               # Modelos de datos compartidos en la API
  │   │   │   ├── ResponseBody.ts    # Estructura estándar de respuesta
  │
  ├── /config                  # Configuración global del proyecto (NestJS, variables de entorno, etc.)
  ├── /shared                  # Código reutilizable (utilidades, excepciones, middlewares, etc.)
  ├── app.module.ts            # Módulo raíz de la aplicación
  ├── main.ts                  # Punto de entrada de la aplicación (bootstrap de NestJS)
```

## **5. Descripción General**
- **`/core`**: Contiene la lógica de negocio pura, separada de la infraestructura (siguiendo principios de "Clean Architecture").
- **`/interfaces/api`**: Define los controladores, módulos y DTOs para la API REST.
- **`/config`**: Almacena la configuración general del proyecto.
- **`/shared`**: Contiene código común que puede ser utilizado en diferentes partes del proyecto.

Esta estructura modular facilita la escalabilidad y el mantenimiento del código. 🚀

