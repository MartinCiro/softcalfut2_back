import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class ActualizarAnuncioDto {
  @IsOptional()
  @IsString({ message: 'El nombre del anuncio no es valido' })
  readonly nombre!: string

  @IsOptional()
  @IsString({ message: 'El contenido del anuncio no es valido' })
  readonly contenido!: string

  @IsOptional()
  @IsString({ message: 'El contenido del anuncio no es valido' })
  readonly imagenUrl!: string

  @IsOptional()
  @IsBoolean({ message: 'El estado del anuncio es invalido' })
  readonly estado!: boolean

  @IsNotEmpty({ message: 'El identificador del anuncio es obligatorio' })
  @IsString({ message: 'El identificador del anuncio debe ser un texto' })
  readonly id!: string
}
