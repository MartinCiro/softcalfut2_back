import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class ActualizarProgramacionDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El genero de la programacion es obligatorio' })
  @IsString({ message: 'El texto en genero de la programacion no es valido' })
  readonly rama?: string

  @IsOptional()
  @IsNotEmpty({ message: 'El lugar de la programacion es obligatorio' })
  @IsString({ message: 'El texto en lugar de la programacion no es valido' })
  readonly lugar_encuentro?: string

  @IsOptional()
  @IsNotEmpty({ message: 'El nombre de la competencia es obligatorio' })
  @IsString({ message: 'El texto en nombre de la competencia no es valido' })
  readonly cronograma_juego?: string

  @IsOptional()
  @IsNotEmpty({ message: 'La fecha de la programacion es obligatorio' })
  @IsNumber({}, { message: 'El texto en fecha de la programacion no es valido' })
  readonly fecha_encuentro?: number

  @IsOptional()
  @IsNotEmpty({ message: 'El equipo local es obligatorio' })
  @IsNumber({}, { message: 'El texto en equipo local no es valido' })
  readonly equipo_local?: number

  @IsOptional()
  @IsNotEmpty({ message: 'El equipo visitante es obligatorio' })
  @IsNumber({}, { message: 'El equipo visitante no es valido' })
  readonly equipo_visitante?: number;

  @IsOptional()
  @IsNotEmpty({ message: 'El torneo es obligatorio' })
  @IsNumber({}, { message: 'El torneo no es valido' })
  readonly torneo!: number;

  @IsNotEmpty({ message: 'El identificador de la programacion es obligatorio' })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'El identificador de la programacion debe ser un número' })
  readonly id!: number
}
