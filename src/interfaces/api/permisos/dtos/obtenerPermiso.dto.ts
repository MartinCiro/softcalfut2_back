import { IsOptional, IsString } from 'class-validator';

export class ObtenerPermisosDto {
  @IsOptional()
  @IsString()
  id?: string ;
}
