import { IsString, IsOptional, IsInt, IsNumber, IsNotEmpty } from 'class-validator';

export class ActualizarPermisoDto {
  @IsOptional()
  @IsString({ message: 'El texto de descripción no es valido' })
  readonly descripcion!: string;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un número' })
  readonly estado!: number;

  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El texto de nombre no es valido' })
  readonly nombre!: string

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un número' })
  readonly id!: number
}
