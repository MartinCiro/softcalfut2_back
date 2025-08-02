import { IsNotEmpty, IsNumber } from 'class-validator';

export class EliminarAfiliadoDto {
  @IsNotEmpty({ message: 'El identificador del afiliado es obligatorio' })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un número' })
  id!: number;
}
