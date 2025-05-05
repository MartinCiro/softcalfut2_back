import { IsNotEmpty, IsString } from 'class-validator';

export class CrearEquipoDto {
  @IsNotEmpty({ message: 'El nombre del equipo es obligatorio' })
  @IsString({ message: 'El texto del nombre del equipo no es valido' })
  readonly nombre_equipo!: string

  @IsNotEmpty({ message: 'El documento del jugador es obligatorio' })
  @IsString({ message: 'El numero de documento debe ser un texto' })
  readonly num_doc!: string
}

