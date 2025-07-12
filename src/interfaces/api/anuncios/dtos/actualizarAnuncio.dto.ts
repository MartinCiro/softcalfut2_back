import { IsString, IsOptional, IsBoolean, IsNotEmpty, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { ImageOrUrlValidator } from './image-or-url.validator';

export class ActualizarAnuncioDto {
  @IsOptional()
  @IsString({ message: 'El nombre del anuncio no es válido' })
  readonly nombre?: string;

  @IsOptional()
  @IsString({ message: 'El contenido del anuncio no es válido' })
  readonly contenido?: string;

  @IsOptional()
  @Validate(ImageOrUrlValidator)
  readonly imagenUrl?: Express.Multer.File | string;

  @IsOptional()
  @IsBoolean({ message: 'El estado del anuncio es inválido' })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  readonly estado?: boolean;

  @IsNotEmpty({ message: 'El identificador del anuncio es obligatorio' })
  @IsString({ message: 'El identificador del anuncio debe ser un texto' })
  @Transform(({ value }) => String(value))
  readonly id!: string;
}