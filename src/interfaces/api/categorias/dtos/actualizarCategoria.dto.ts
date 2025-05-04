import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class ActualizarCategoriaDto {
  @IsOptional()
  @IsString({ message: 'El nombre de la categoria no es valido' })
  readonly nombre!: string

  @IsNotEmpty({ message: 'El identificador de la categoria es obligatorio' })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'El identificador de la categoria debe ser un número' })
  readonly id!: number
}
