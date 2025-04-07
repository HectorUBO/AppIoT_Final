import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'Juan Carlos Perez', description: 'Nombre del usuario', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Email del usuario', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'newpassword123', description: 'Contraseña del usuario', required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ example: '¿Cuál es tu comida favorita?', description: 'Pregunta de seguridad', required: false })
  @IsString()
  @IsOptional()
  securityQ?: string;

  @ApiProperty({ example: 'Pizza', description: 'Respuesta de seguridad', required: false })
  @IsString()
  @IsOptional()
  securityA?: string;
}