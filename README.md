/src
  /core
    /usuarios
      usuario.service.ts         # Servicio con la lógica de negocio
      usuario.model.ts           # Modelo de datos de usuario (si usas una entidad)
      usuario.repository.ts      # Capa de acceso a datos (si usas repositorio)
  /interfaces
    /api
      /usuarios
        usuario.controller.ts    # Controlador para la API REST
        /dtos
          crear-usuario.dto.ts   # DTO para la validación de datos
        usuario.module.ts        # Módulo que agrupa controladores y servicios
  /config                        # Configuración de NestJS (opcional)
  /shared                        # Código reutilizable (ej. excepciones, utils)
  app.module.ts                  # Módulo raíz de la aplicación
  main.ts                        # Punto de entrada de NestJS
