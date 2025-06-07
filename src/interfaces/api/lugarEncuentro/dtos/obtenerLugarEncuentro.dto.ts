import { IsOptional, IsNumber } from 'class-validator';

export class ObtenerLugarEncuentroDto {
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un número' })
  id?: number | string
}
