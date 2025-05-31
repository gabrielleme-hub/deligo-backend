import { IsString, IsNumber, IsEnum, IsOptional, IsArray, ValidateNested, ArrayMinSize, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum PaymentMethod {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  BOLETO = 'BOLETO'
}

export class OrderItemDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID do produto' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantidade do produto' })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreditCardDto {
  @ApiProperty({ example: '4532 1234 5678 9012', description: 'Número do cartão' })
  @IsString()
  cardNumber: string;

  @ApiProperty({ example: '12/25', description: 'Data de validade' })
  @IsString()
  expiryDate: string;

  @ApiProperty({ example: '123', description: 'Código de segurança' })
  @IsString()
  cvv: string;

  @ApiProperty({ example: 'João Silva', description: 'Nome no cartão' })
  @IsString()
  cardholderName: string;
}

export class BillingAddressDto {
  @ApiProperty({ example: 'Rua das Flores, 123', description: 'Endereço completo' })
  @IsString()
  street: string;

  @ApiProperty({ example: 'Apto 45', description: 'Complemento' })
  @IsString()
  @IsOptional()
  complement?: string;

  @ApiProperty({ example: 'Centro', description: 'Bairro' })
  @IsString()
  neighborhood: string;

  @ApiProperty({ example: 'São Paulo', description: 'Cidade' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'SP', description: 'Estado' })
  @IsString()
  state: string;

  @ApiProperty({ example: '01234-567', description: 'CEP' })
  @IsString()
  zipCode: string;
}

export class CreateOrderDto {
  @ApiProperty({ 
    type: [OrderItemDto],
    description: 'Lista de itens do pedido'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ 
    enum: PaymentMethod,
    description: 'Método de pagamento'
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ 
    type: CreditCardDto,
    description: 'Detalhes do cartão de crédito (apenas se paymentMethod for CREDIT_CARD)',
    required: false
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreditCardDto)
  creditCard?: CreditCardDto;

  @ApiProperty({ 
    type: BillingAddressDto,
    description: 'Endereço de cobrança (obrigatório para BOLETO)',
    required: false
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BillingAddressDto)
  billingAddress?: BillingAddressDto;
} 