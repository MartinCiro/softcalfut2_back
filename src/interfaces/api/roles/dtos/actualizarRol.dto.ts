import { IsString, IsOptional, IsArray, IsNumber, IsNotEmpty } from 'class-validator';

export class ActualizarRolDto {
  @IsOptional()
  @IsString({ message: 'El texto de nombre no es valido' })
  readonly nombre!: string

  @IsOptional()
  @IsString({ message: 'El texto de descripcion no es valido' })
  readonly descripcion!: string;

  @IsOptional()
  @IsArray({ message: 'Debe ser una lista' })
  @IsNotEmpty({ message: 'Debe proporcionar al menos un permiso' })
  readonly permisos!: (string | number)[];

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un número' })
  readonly id!: number
}
