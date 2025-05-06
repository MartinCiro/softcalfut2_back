import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CrearCedulaDeportivaDto {
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  @IsNumber({}, { message: 'La categoría debe ser un número' })
  readonly categoria!: number;

  @IsNotEmpty({ message: 'El torneo es obligatorio' })
  @IsNumber({}, { message: 'El torneo debe ser un número' })
  readonly torneo!: number;

  @IsNotEmpty({ message: 'El equipo es obligatorio' })
  @IsNumber({}, { message: 'El equipo debe ser un número' })
  readonly equipo!: number;

  @IsOptional()
  @IsString({ message: 'La foto debe ser una cadena de texto (base64 o URL)' })
  readonly foto?: string;
}
