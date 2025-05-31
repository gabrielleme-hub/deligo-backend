import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsArray, Min, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ProductCategory {
  FOOD = 'FOOD',
  DRINK = 'DRINK',
  DESSERT = 'DESSERT',
  SNACK = 'SNACK',
}

export class CreateProductDto {
  @ApiProperty({ example: 'X-Burger', description: 'Nome do produto' })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 'Hambúrguer artesanal com queijo, alface, tomate e molho especial',
    description: 'Descrição detalhada do produto'
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    example: ['Pão', 'Hambúrguer', 'Queijo', 'Alface', 'Tomate', 'Molho especial'],
    description: 'Lista de ingredientes do produto',
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  ingredients: string[];

  @ApiProperty({ example: 25.90, description: 'Preço do produto' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ 
    example: ProductCategory.FOOD,
    description: 'Categoria do produto',
    enum: ProductCategory
  })
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiProperty({ 
    example: 'https://exemplo.com/xburger.jpg',
    description: 'URL da imagem do produto',
    required: false
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ 
    example: true,
    description: 'Indica se o produto está disponível',
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  available?: boolean;
} 