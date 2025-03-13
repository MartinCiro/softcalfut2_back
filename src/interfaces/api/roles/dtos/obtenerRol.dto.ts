import { IsOptional, IsString } from 'class-validator';

export class ObtenerRolesDto {
  @IsOptional()
  @IsString()
  id?: string;
}
