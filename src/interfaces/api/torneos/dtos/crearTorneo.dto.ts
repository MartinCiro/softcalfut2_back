import { IsNotEmpty, IsString } from 'class-validator';

export class CrearTorneoDto {
  @IsNotEmpty({ message: 'El nombre del torneo es obligatorio' })
  @IsString({ message: 'El texto del nombre del torneo no es valido' })
  readonly nombre!: string
}

