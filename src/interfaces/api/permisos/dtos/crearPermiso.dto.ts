import { IsNotEmpty, IsNumber, IsString, MinLength, IsOptional } from 'class-validator';

export class CrearPermisoDto {

    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString({ message: 'El texto de nombre no es valido' })
    readonly nombre!: string

    @IsOptional()
    @IsString({ message: 'El texto de descripción no es valido' })
    readonly descripcion!: string;
  
  }

