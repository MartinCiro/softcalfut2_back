import { IsNotEmpty, IsNumber } from 'class-validator';

export class EliminarEquipoDto {
  @IsNotEmpty({ message: 'El identificador del equipo es obligatorio' })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un número' })
  id!: number;
}
