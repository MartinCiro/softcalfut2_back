/src
  /core
    /usuarios
      usuarioPort.ts             # Interface 
      usuario.service.ts         # Servicio con la lógica de negocio
  /interfaces
    /api
      /usuarios
        usuario.controller.ts    # Controlador para la API REST
        /dtos
          crear-usuario.dto.ts   # DTO para la validación de datos
        usuario.module.ts        # Módulo que agrupa controladores y servicios
      /middleware
          authMiddlewares.ts
      /models
          ResponseBody.ts
  /config                        # Configuración de NestJS (opcional)
  /shared                        # Código reutilizable (ej. excepciones, utils)
  app.module.ts                  # Módulo raíz de la aplicación
  main.ts                        # Punto de entrada de NestJS
