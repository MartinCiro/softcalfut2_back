import { IsString, IsNotEmpty } from 'class-validator';

export class AuthDto {

  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  @IsString({ message: 'El texto en nombre de usuario no es valido' })
  readonly username!: string

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser un texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  enpass!: string;
}
