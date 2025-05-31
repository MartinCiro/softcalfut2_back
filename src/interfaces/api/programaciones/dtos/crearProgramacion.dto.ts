import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';

export class CrearProgramacionDto {
  @IsNotEmpty({ message: 'El genero de la programacion es obligatorio' })
  @IsString({ message: 'El texto en genero de la programacion no es valido' })
  readonly rama!: string

  @IsNotEmpty({ message: 'El lugar de la programacion es obligatorio' })
  @IsString({ message: 'El texto en lugar de la programacion no es valido' })
  readonly lugarEncuentro!: string

  @IsNotEmpty({ message: 'El nombre de la competencia es obligatorio' })
  @IsString({ message: 'El texto en nombre de la competencia no es valido' })
  readonly nombreCompetencia!: string

  @IsNotEmpty({ message: 'La fecha de la programacion es obligatorio' })
  @IsDate({ message: 'La fecha no es valida' })
  readonly fechaEncuentro!: string;

  @IsNotEmpty({ message: 'El equipo local es obligatorio' })
  @IsNumber({}, { message: 'El texto en equipo local no es valido' })
  readonly equipoLocal!: number

  @IsNotEmpty({ message: 'El equipo visitante es obligatorio' })
  @IsNumber({}, { message: 'El equipo visitante no es valido' })
  readonly equipoVisitante!: number;
}