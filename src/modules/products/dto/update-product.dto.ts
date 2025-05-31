import {
  IsString,
  IsNumber,
  IsEnum,
  Min,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductCategory } from './create-product.dto';

export class UpdateProductDto {
  @ApiProperty({
    example: 'X-Burger Especial',
    description: 'Nome do produto',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Hambúrguer com queijo, alface, tomate e bacon',
    description: 'Descrição do produto',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 29.9,
    description: 'Preço do produto',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: ProductCategory.FOOD,
    description: 'Categoria do produto',
    enum: ProductCategory,
    required: false,
  })
  @IsEnum(ProductCategory)
  @IsOptional()
  category?: ProductCategory;

  @ApiProperty({
    example: 'https://exemplo.com/imagem-nova.jpg',
    description: 'URL da imagem do produto',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    example: false,
    description: 'Produto disponível para venda',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
