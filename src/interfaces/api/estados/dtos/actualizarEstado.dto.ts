import { IsString, IsOptional, IsArray, IsNumber, IsNotEmpty } from 'class-validator';

export class ActualizarEstadoDto {
  @IsOptional()
  @IsString({ message: 'El texto de nombre no es valido' })
  readonly nombre!: string

  @IsOptional()
  @IsString({ message: 'El texto de descripcion no es valido' })
  readonly descripcion!: string;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un número' })
  readonly id!: number
}
