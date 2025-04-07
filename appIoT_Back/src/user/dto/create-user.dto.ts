import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Perez', description: 'Nombre del usuario' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Email del usuario' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty()
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