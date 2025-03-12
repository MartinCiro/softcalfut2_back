import { IsNotEmpty, IsNumber, IsString, MinLength, IsOptional } from 'class-validator';

export class CrearUsuarioDto {

    @IsOptional()
    @IsString({ message: 'El texto de apellido no es valido' })
    readonly apellidos!: string;

    @IsOptional()
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un número' })
    readonly id_estado!: number;

    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString({ message: 'El texto de nombre no es valido' })
    readonly nombres!: string
  
    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
    @IsString({ message: 'El texto en nombre de usuario no es valido' })
    readonly username!: string
  
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    readonly pass!: string
  
    @IsNumber({allowNaN: false, allowInfinity: false}, { message: 'Debe ser un número' })
    readonly id_rol!: number
  }

