import { IsInt, IsOptional, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CrearAfiliadoDto {
  @IsInt({ message: 'El ID del equipo debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del equipo es obligatorio' })
  readonly equipo!: number;

  @IsInt({ message: 'El ID del lugar de encuentro debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del lugar de encuentro es obligatorio' })
  readonly lugar_entrenamiento!: number;

  @IsInt({ message: 'El ID del estado debe ser un número entero' })
  @IsOptional()
  readonly estado?: number;

  @IsString({ message: 'La URL del logo debe ser una cadena de texto válida' })
  @IsUrl({}, { message: 'La URL del logo no es válida' })
  @IsOptional()
  readonly logo?: string;
}
