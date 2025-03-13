import { IsNumber } from 'class-validator';

export class EliminarEstadoDto {
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un número' })
  id!: number;
}
