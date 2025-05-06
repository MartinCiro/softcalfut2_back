import { IsNotEmpty, IsNumber } from 'class-validator';

export class EliminarCedulaDeportivaDto {
  @IsNotEmpty({ message: 'El identificador del equipo es obligatorio' })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un número' })
  id!: number;
}
