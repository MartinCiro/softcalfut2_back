import { IsNumber } from 'class-validator';

export class EliminarRolDto {
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un número' })
    id!: string;
}
