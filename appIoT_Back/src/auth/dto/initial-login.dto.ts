import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InitialLoginDto {
    @ApiProperty({ example: 'juan@example.com', description: 'Email del usuario' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'Contraseña del usuario' })
    @IsString()
    @IsNotEmpty()
    password: string;
}