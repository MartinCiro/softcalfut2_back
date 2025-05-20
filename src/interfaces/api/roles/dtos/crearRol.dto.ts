import { IsNotEmpty, IsString, IsArray, IsOptional, ArrayMinSize } from 'class-validator';

export class CrearRolDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El texto de nombre no es válido' })
  readonly nombre!: string;

  @IsOptional()
  @IsString({ message: 'El texto de descripción no es válido' })
  readonly descripcion?: string;

  @IsArray({ message: 'Debe ser una lista de permisos' })
  @ArrayMinSize(1, { message: 'Debe proporcionar al menos un permiso' })
  @IsString({ each: true, message: 'Cada permiso debe ser un texto válido' })
  readonly permisos!: string[];
}
