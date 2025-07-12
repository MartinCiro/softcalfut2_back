import { IsNotEmpty, IsNumber, IsString, MinLength, IsOptional, IsDate, IsDateString } from 'class-validator';

export class ActualizarUsuarioDto {
    @IsOptional()
    @IsString({ message: 'El texto de nombre no es valido' })
    readonly nombres?: string
  
    @IsOptional()
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un número' })
    readonly id_rol?: number;
  
    @IsOptional()
    @IsString({ message: 'El texto de apellido no es valido' })
    readonly apellido?: string;
  
    @IsNotEmpty({ message: 'El numero de documento es obligatorio' })
    @IsString({ message: 'El texto en numero de documento no es valido' })
    readonly numero_documento!: string
  
    @IsOptional()
    @IsString({ message: 'El texto de correo no es valido' })
    readonly email?: string;
  
    @IsOptional()
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un número' })
    readonly estado_id?: number; 
    
    @IsOptional()
    @IsString({ message: 'El texto ingresado en la informacion del perfil no es valido' })
    readonly info_perfil?: string;
  
    @IsOptional()
    @IsString({ message: 'El texto en nombre de usuario no es valido' })
    readonly nom_user?: string;
    
    @IsOptional()
    @IsString({ message: 'El texto ingresado en el numero de contacto no es valido' })
    readonly numero_contacto?: string; 
  
    @IsOptional()
    @IsDateString()
    readonly fecha_nacimiento?: string;
}
