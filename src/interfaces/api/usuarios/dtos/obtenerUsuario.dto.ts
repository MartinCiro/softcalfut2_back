import { IsOptional, IsString } from 'class-validator';

export class ObtenerUsuariosDto {
  @IsOptional()
  @IsString()
  documento?: string;
}
