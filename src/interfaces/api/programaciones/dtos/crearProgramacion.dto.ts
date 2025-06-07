import { IsNotEmpty, IsString, IsNumber, IsISO8601 } from 'class-validator';

export class CrearProgramacionDto {
  @IsNotEmpty({ message: 'El genero de la programacion es obligatorio' })
  @IsString({ message: 'El texto en genero de la programacion no es valido' })
  readonly rama!: string

  @IsNotEmpty({ message: 'El lugar de la programacion es obligatorio' })
  @IsNumber({}, { message: 'El texto en lugar de la programacion no es valido' })
  readonly lugarEncuentro!: number

  @IsNotEmpty({ message: 'El nombre de la competencia es obligatorio' })
  @IsString({ message: 'El texto en nombre de la competencia no es valido' })
  readonly cronogramaJuego!: string

  @IsNotEmpty({ message: 'La fecha de la programacion es obligatorio' })
  @IsISO8601({ strict: true }, { message: 'La fecha no es valida' })
  readonly fechaEncuentro!: Date | string;

  @IsNotEmpty({ message: 'El equipo local es obligatorio' })
  @IsNumber({}, { message: 'El texto en equipo local no es valido' })
  readonly equipoLocal!: number

  @IsNotEmpty({ message: 'El equipo visitante es obligatorio' })
  @IsNumber({}, { message: 'El equipo visitante no es valido' })
  readonly equipoVisitante!: number;

  @IsNotEmpty({ message: 'El torneo es obligatorio' })
  @IsNumber({}, { message: 'El torneo no es valido' })
  readonly torneo!: number;
}