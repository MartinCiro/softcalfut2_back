import { IsNotEmpty, IsNumber } from 'class-validator';

export class EliminarCategoriaDto {
  @IsNotEmpty({ message: 'El identificador de la categoria es obligatorio' })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un número' })
  id!: number;
}
