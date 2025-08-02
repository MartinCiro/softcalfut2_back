import { IsString, IsOptional, IsNumber, IsNotEmpty, IsArray } from 'class-validator';

export class ActualizarAfiliadoDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre del afiliado es obligatorio' })
  @IsString({ message: 'El texto del nombre del afiliado no es válido' })
  readonly nom_afiliado?: string

  @IsOptional()
  @IsNotEmpty({ message: 'El documento del encargado es obligatorio' })
  @IsString({ message: 'El numero de documento del encargado debe ser un texto válido' })
  readonly encargado?: string

  @IsOptional()
  @IsNotEmpty({ message: 'La categoria es obligatoria' })
  @IsString({ message: 'El nombre de la categoria no es válido' })
  readonly categoria?: string

  @IsOptional()
  @IsArray({ message: 'Debe ser una lista de jugadores' })
  @IsString({ each: true, message: 'Cada permiso debe ser un texto válido' })
  readonly jugadores?: string[];

  @IsNotEmpty({ message: 'El id del afiliado es obligatorio' })
  @IsNumber({}, { message: 'El id del afiliado debe ser un número' })
  readonly id!: number | string
}
