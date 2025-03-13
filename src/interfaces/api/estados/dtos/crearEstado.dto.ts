import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class CrearEstadoDto {

  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El texto de nombre no es valido' })
  readonly nombre!: string

  @IsOptional()
  @IsString({ message: 'El texto de descripcion no es valido' })
  readonly descripcion!: string;
}

