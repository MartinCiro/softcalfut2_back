import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CrearNotaDto {
  @IsNotEmpty({ message: 'El nombre de la nota es obligatorio' })
  @IsString({ message: 'El texto del nombre en la nota no es válido' })
  readonly nombre!: string

  @IsOptional()
  @IsNotEmpty({ message: 'El documento del encargado es obligatorio' })
  @IsString({ message: 'El numero de documento del encargado debe ser un texto válido' })
  readonly descripcion?: string
}

