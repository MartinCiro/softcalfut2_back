import { IsString, IsOptional, IsNumber, IsNotEmpty, IsArray } from 'class-validator';

export class ActualizarNotaDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre del nota es obligatorio' })
  @IsString({ message: 'El texto del nombre de la nota no es válido' })
  readonly nombre?: string

  @IsOptional()
  @IsNotEmpty({ message: 'La descripcion de la nota es obligatoria' })
  @IsString({ message: 'El texto de la descripcion de la nota no es válido' })
  readonly descripcion?: string

  @IsNotEmpty({ message: 'El id del nota es obligatorio' })
  @IsNumber({}, { message: 'El id del nota debe ser un número' })
  readonly id!: number | string
}
