import { IsOptional, IsNumber } from 'class-validator';

export class ObtenerRolxPermisosDto {
  @IsOptional()
  @IsNumber()
  id_rol?: number;
}
