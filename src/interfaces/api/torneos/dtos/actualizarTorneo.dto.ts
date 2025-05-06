import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class ActualizarTorneoDto {
  @IsOptional()
  @IsString({ message: 'El nombre del torneo no es valido' })
  readonly nombre!: string

  @IsNotEmpty({ message: 'El identificador del torneo es obligatorio' })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'El identificador del torneo debe ser un número' })
  readonly id!: number
}
