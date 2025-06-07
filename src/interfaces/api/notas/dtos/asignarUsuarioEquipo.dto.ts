import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class AsignarUsuarioEquipoDto {
  @IsNotEmpty({ message: 'El nombre del equipo es obligatorio' })
  @IsString({ message: 'El texto del nombre del equipo no es valido' })
  readonly nombre_equipo!: string

  @IsNotEmpty({ message: 'La lista de jugadores es obligatoria' })
  @IsArray({ message: 'La lista de jugadores no es valida' })
  readonly jugadores!: string[]
}

