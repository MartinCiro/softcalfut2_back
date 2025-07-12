import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { Genero } from '@prisma/client';

export class ActualizaProgramacionDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El género de la programación es obligatorio' })
  @IsEnum(Genero, { message: 'El género proporcionado no es válido' })
  readonly rama?: Genero;

  @IsOptional()
  @IsNotEmpty({ message: 'La fecha de la programacion es obligatorio' })
  @IsString({ message: 'La fecha no es valida' })
  readonly fecha!: string;

  @IsOptional()
  @IsNotEmpty({ message: 'El lugar de la programacion es obligatorio' })
  @IsNumber({}, { message: 'El texto en lugar de la programacion no es valido' })
  readonly lugar?: number

  @IsOptional()
  @IsNotEmpty({ message: 'El nombre de la competencia es obligatorio' })
  @IsString({ message: 'El texto en nombre de la competencia no es valido' })
  readonly competencia?: string

  @IsOptional()
  @IsNotEmpty({ message: 'El equipo local es obligatorio' })
  @IsNumber({}, { message: 'El texto en equipo local no es valido' })
  readonly equipoLocal?: number

  @IsOptional()
  @IsNotEmpty({ message: 'El equipo visitante es obligatorio' })
  @IsNumber({}, { message: 'El equipo visitante no es valido' })
  readonly equipoVisitante?: number;

  @IsOptional()
  @IsNotEmpty({ message: 'El torneo es obligatorio' })
  @IsNumber({}, { message: 'El torneo no es valido' })
  readonly torneo?: number;

  @IsOptional()
  @IsNotEmpty({ message: 'La categoria es obligatorio' })
  @IsNumber({}, { message: 'La categoria no es valido' })
  readonly categoria?: number;
  
  @IsOptional()
  @IsNotEmpty({ message: 'La hora no puede estar vacia' })
  @IsString({ message: 'La hora no es valida' })
  readonly hora?: string

  @IsNotEmpty({ message: 'El identificador de la programacion es obligatorio' })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'El identificador de la programacion debe ser un número' })
  readonly id!: number
}