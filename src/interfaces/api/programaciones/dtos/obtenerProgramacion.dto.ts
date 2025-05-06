import { IsOptional, IsNumber } from 'class-validator';

export class ObtenerProgramacionesDto {
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un número' })
  id?: number;
}
