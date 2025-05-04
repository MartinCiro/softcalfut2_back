import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class ActualizarEquipoDto {
  @IsOptional()
  @IsString({ message: 'El nombre del equipo no es valido' })
  readonly nombre_equipo!: string

  @IsOptional()
  @IsString({ message: 'El nombre del jugador no es valido' })
  readonly nom_jugador!: string

  @IsNotEmpty({ message: 'El identificador del equipo es obligatorio' })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'El identificador del equipo debe ser un número' })
  readonly id!: number
}
