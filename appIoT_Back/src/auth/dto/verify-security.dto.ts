import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifySecurityDto {
  @ApiProperty({ example: 'token jwt', description: 'Token generado por el sistema' })
  @IsNotEmpty()
  @IsString()
  tempToken: string;


  @ApiProperty({ example: 'Rojo', description: 'Respuesta de seguridad' })
  @IsNotEmpty()
  @IsString()
  answer: string;
}