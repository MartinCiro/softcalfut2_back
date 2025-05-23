import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CrearEquipoDto {
  @IsNotEmpty({ message: 'El nombre del equipo es obligatorio' })
  @IsString({ message: 'El texto del nombre del equipo no es válido' })
  readonly nom_equipo!: string

  @IsNotEmpty({ message: 'El documento del encargado es obligatorio' })
  @IsString({ message: 'El numero de documento del encargado debe ser un texto válido' })
  readonly encargado!: string

  @IsArray({ message: 'Debe ser una lista de permisos' })
  @IsString({ each: true, message: 'Cada permiso debe ser un texto válido' })
  readonly jugadores!: string[];
}

