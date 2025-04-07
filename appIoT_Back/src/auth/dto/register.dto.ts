import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'Juan Perez', description: 'Nombre del usuario' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'juan@example.com', description: 'Email del usuario' })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'Contraseña del usuario' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: '¿Cuál es tu color favorito?', description: 'Pregunta de seguridad' })
    @IsString()
    @IsNotEmpty()
    securityQ: string;

    @ApiProperty({ example: 'Azul', description: 'Respuesta de seguridad' })
    @IsString()
    @IsNotEmpty()
    securityA: string;
}