import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CrearUsuarioDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString()
    readonly nombres!: string
  
    @IsNotEmpty({ message: 'El email es obligatorio' })
    @IsEmail({}, { message: 'Debe ser un email válido' })
    readonly email!: string
  
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    readonly pass!: string
  
    @IsNumber({}, { message: 'Debe ser un número' })
    readonly id_rol!: number
  }

