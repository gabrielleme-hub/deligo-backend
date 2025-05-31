import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserType {
  ADMIN = 'admin',
  COMMON = 'common',
}

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Nome completo do usuário' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email do usuário' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Senha do usuário (mínimo 6 caracteres)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    example: UserType.COMMON, 
    description: 'Tipo do usuário (admin ou common)',
    enum: UserType,
    default: UserType.COMMON
  })
  @IsEnum(UserType)
  @IsNotEmpty()
  type: UserType;
} 