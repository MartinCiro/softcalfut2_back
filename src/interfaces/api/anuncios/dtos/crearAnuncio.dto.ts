import { IsNotEmpty, IsString } from 'class-validator';

export class CrearAnuncioDto {
  @IsNotEmpty({ message: 'El nombre de la categoria es obligatorio' })
  @IsString({ message: 'El texto del nombre de la categoria no es valido' })
  readonly nombre!: string

  @IsNotEmpty({ message: 'El anuncion no puede estar vacio' })
  @IsString({ message: 'El texto ingresado en contenido no es valido' })
  readonly contenido!: string

  @IsNotEmpty({ message: 'La url de la imagen es obligatoria' })
  @IsString({ message: 'El texto de la url de la imagen no es valido' })
  readonly imagenUrl!: string
}

