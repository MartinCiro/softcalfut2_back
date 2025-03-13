import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class CrearRolDto {


  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El texto de nombre no es valido' })
  readonly nombre!: string

  @IsOptional()
  @IsString({ message: 'El texto de descripcion no es valido' })
  readonly descripcion!: string;

  @IsArray({ message: 'Debe ser una lista' })
  @IsNotEmpty({ message: 'Debe proporcionar al menos un permiso' })
  readonly permisos!: (string | number)[];
}

