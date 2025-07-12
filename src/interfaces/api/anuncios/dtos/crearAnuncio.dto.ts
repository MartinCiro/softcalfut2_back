import { IsNotEmpty, IsString, IsOptional, Validate } from 'class-validator';
import { IsFile } from 'nestjs-form-data';
import { Express } from 'express';
import { ImageOrUrlValidator } from './image-or-url.validator';

export class CrearAnuncioDto {
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio' })
  @IsString({ message: 'El texto del nombre de la categoría no es válido' })
  readonly nombre!: string;

  @IsNotEmpty({ message: 'El anuncio no puede estar vacío' })
  @IsString({ message: 'El texto ingresado en contenido no es válido' })
  readonly contenido!: string;

  @IsOptional()
  @IsFile({ message: 'Debe proporcionar un archivo de imagen válido' })
  readonly imagenUrl?: Express.Multer.File;

  @Validate(ImageOrUrlValidator)
  readonly _imageCheck?: never; // Campo virtual para la validación
}