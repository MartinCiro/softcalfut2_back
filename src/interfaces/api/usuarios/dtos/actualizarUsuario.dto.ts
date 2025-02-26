import { IsString, IsEmail, IsOptional, IsInt } from 'class-validator';

export class ActualizarUsuarioDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  nombres?: string;

  @IsOptional()
  @IsString()
  pass?: string;

  @IsOptional()
  @IsString()
  id_rol?: string;

  @IsOptional()
  @IsInt()
  estado?: number;
}
