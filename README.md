---

# 📌 **Guía para Configurar un Contenedor Postgres con Docker**

Este documento explica cómo configurar un contenedor de **Postgres** con Docker, realizar operaciones con la base de datos y entender la estructura del proyecto.
---


## 🚀 **1. Iniciar el Contenedor**  

Para desplegar el contenedor, ejecuta (renombrar example a .env sino lo tiene []):

```bash
docker-compose up -d
```

---

## 🧪 **2. Ejecutar Pruebas**

Para iniciar las pruebas de microservicios, usa:

```bash
docker exec -it nestjs_app sh -c "npm test"
```

---

## 📄 **3. Acceder a la Documentación de la API**

La documentación de la API se aloja en la siguiente ruta (el puerto varia segun el .env):

```
http://localhost:4000/api/docs
```

Si la documentación no carga, verifica que el archivo `docs.html` exista en la carpeta `public/`.

---

# 🏗 **Configuración de la Base de Datos**

## **4. Crear el Contenedor de PostgreSQL**

Para desplegar un contenedor con **PostgreSQL** y exponer el puerto `5432`, ejecuta:

```bash
docker run --name psql -e POSTGRES_USER=ciro -e POSTGRES_PASSWORD=tu_contraseña -p 5432:5432 -d postgres

docker run --name psql -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=secreto123 -e POSTGRES_DB=softcalfut_prod -v postgres_data:/var/lib/postgresql/data -p 5432:5432 -d postgres:16-alpine
```

---

## **5. Crear la Base de Datos**  

Si la base de datos `softcalfut_psql` no existe, créala con:

```bash
docker exec -it psql psql -U postgres -c "CREATE DATABASE softcalfut_psql;"
```

---

## **6. Crear una Copia de Seguridad**  

Para generar un respaldo de la base de datos `softcalfut_psql`, usa:

```bash
docker exec -t psql bash -c 'pg_dump -U postgres -Fc -d softcalfut_psql > /tmp/backup.dump'

```
### Copiar bd a local
```bash
docker cp psql:/tmp/backup.dump ./src/bd_backup/backup.dump

```
---

## **7. Restaurar una Copia de Seguridad**

Para restaurar una copia de seguridad, ejecuta:

```bash
docker exec -it psql psql -U postgres -c "DROP DATABASE IF EXISTS softcalfut_psql;"
docker exec -it psql psql -U postgres -c "CREATE DATABASE softcalfut_psql;"
docker exec -i psql pg_restore -U postgres -d softcalfut_psql < backup.dump
```

### En caso de error
```bash
docker cp .\backup.dump psql:/tmp/backup.dump
docker exec -it psql pg_restore -U postgres -d softcalfut_psql -Fc /tmp/backup.dump

```

---

# 📂 **Estructura del Back**

Este proyecto sigue una organización modular basada en **arquitectura hexagonal**, lo que mejora la mantenibilidad y escalabilidad.

```
/src
  ├── /bd_backup             # Carpeta para copias de seguridad
  ├── /core                  # Lógica de negocio
  │   ├── /usuarios          # Módulo de usuarios
  │   │   ├── usuarioPort.ts     # Interfaz del servicio
  │   │   ├── usuario.service.ts # Lógica de negocio de usuarios
  │
  ├── /interfaces            # Interfaces de comunicación
  │   ├── /api               # API REST
  │   │   ├── /usuarios      # Endpoints de usuarios
  │   │   │   ├── usuario.controller.ts  # Controlador de usuarios
  │   │   │   ├── usuario.module.ts      # Módulo de usuarios
  │   │   │   ├── /dtos                  # DTOs (Data Transfer Objects)
  │   │   │   │   ├── crear-usuario.dto.ts  # DTO para validación
  │   │   ├── /models            # Modelos de datos compartidos
  │   │   │   ├── ResponseBody.ts # Estructura estándar de respuesta
  │
  ├── /config               # Configuración global (NestJS, variables de entorno)
  ├── /shared               # Código reutilizable (utilidades, middlewares)
  ├── app.module.ts         # Módulo raíz de la aplicación
  ├── main.ts               # Punto de entrada de la aplicación (bootstrap de NestJS)
```

---

# 📌 **Descripción General**

- **`/core`** → Contiene la lógica de negocio pura, independiente de la infraestructura.  
- **`/interfaces/api`** → Define los controladores, módulos y DTOs para la API REST.  
- **`/config`** → Configuración general del proyecto (variables de entorno, NestJS, etc.).  
- **`/shared`** → Código reutilizable (utilidades, excepciones, middlewares).  

Esta estructura modular **facilita la escalabilidad y el mantenimiento** del código. 🚀  

---

# 📂 **Estructura del Front**

Este proyecto sigue una organización modular **tradicional**.

```
/src
├── /Utils                     # Funciones auxiliares reutilizables
│   ├── /constants             # Constantes globales (colores, rutas, etc.)
│   ├── /methods               # Métodos utilitarios específicos (ej. formateadores)
│   ├── /helpers               # Funciones de apoyo generales
│   ├── /interfaces            # Interfaces TypeScript para tipado de datos
│   ├── /types                 # Tipos TypeScript personalizados
│   ├── /enums                 # Enumeraciones (ej. estados, roles, etc.)
│
├── /Lib                      # Librerías del proyecto (núcleo funcional)
│   ├── /Hooks                # Custom hooks reutilizables (useAuth, useFetch, etc.)
│   ├── /Providers            # Contextos y providers globales (ej. AuthProvider)
│   ├── /Services             # Lógica de conexión a APIs o servicios externos
│   ├── /Layouts              # Componentes de layout general (Sidebar, Header)
│
├── /UI                       # Todo lo relacionado con la interfaz visual
│   ├── /screen-components    # Componentes que se usan en una pantalla específica
│   ├── /useable-components   # Componentes reutilizables (Button, Modal, Card)
│   ├── /screens              # Vistas o páginas principales (Login, Dashboard, etc.)
```

---

# 📌 **Descripción General**

- **`/Utils`** →  Centraliza la lógica auxiliar y definiciones globales que pueden ser utilizadas por todo el proyecto.  
- **`/Lib`** → Contiene funcionalidades esenciales del sistema como hooks, servicios y providers globales.  
- **`/UI`** →  Agrupa todos los elementos visuales, estructurados por su nivel de reutilización o por pantalla.

Esta estructura modular **facilita la escalabilidad y el mantenimiento** del código. 🚀  

---

🔹 **Con estos pasos, tu entorno estará listo para funcionar sin problemas.**  
Si tienes dudas, revisa los logs de Docker con:  

```bash
docker logs -f psql
```

---

---

🔹 **Aplicar cambios en bd.**  
Para generar migraciones nuevas o aplicar los modelos (PERDERAS LOS DATOS):  

```bash
    command: ["sh", "-c", "npm install && npm run merge && npm run gen && npx prisma migrate dev --name init && npx prisma migrate reset --force && npm run server"]
```

---  

---

🔹 **Eliminar cache redis.**  
Para eliminar el cache problematico en los response:  

```bash
redis-cli DEL anuncios:lista
```

---
