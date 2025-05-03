import { IsNumber } from 'class-validator';

export class EliminarUsuarioDto {
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un número' })
    documento!: string;
}
