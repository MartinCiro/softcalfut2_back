import { isEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @isEmail({}, { message: 'El correo electrónico no es válido' })
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
    id!: string;

  @IsString({ message: 'La contraseña debe ser un texto' })
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    enpass!: string;
}
