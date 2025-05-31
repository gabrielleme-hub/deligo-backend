import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto, PaymentMethod } from './dto/create-order.dto';
import { Product } from '../products/entities/product.entity';
import * as qrcode from 'qrcode';
import { OrderDto } from './dto/order.dto';
import { OrderItemDto } from './dto/order-item.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    // Validar produtos e calcular totais
    let totalAmount = 0;
    const products = [];

    for (const item of createOrderDto.items) {
      const product = await this.productsRepository.findOne({
        where: { id: item.productId }
      });

      if (!product) {
        throw new NotFoundException(`Produto ${item.productId} não encontrado`);
      }

      if (!product.available) {
        throw new BadRequestException(`Produto ${product.name} não está disponível`);
      }

      products.push({
        product,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: product.price * item.quantity
      });

      totalAmount += product.price * item.quantity;
    }

    // Criar o pedido
    const order = this.ordersRepository.create({
      userId,
      totalAmount,
      paymentMethod: createOrderDto.paymentMethod,
      status: 'PENDING'
    });

    // Processar pagamento baseado no método
    switch (createOrderDto.paymentMethod) {
      case PaymentMethod.PIX:
        const pixKey = '12345678900'; // Chave PIX fake
        const pixQRCode = await qrcode.toDataURL(pixKey);
        order.paymentDetails = pixQRCode;
        break;

      case PaymentMethod.CREDIT_CARD:
        if (!createOrderDto.creditCard) {
          throw new BadRequestException('Detalhes do cartão são obrigatórios');
        }
        // Validação fake do cartão
        if (!this.validateCreditCard(createOrderDto.creditCard)) {
          throw new BadRequestException('Cartão inválido');
        }
        order.paymentDetails = 'APPROVED';
        order.status = 'PAID';
        break;

      case PaymentMethod.BOLETO:
        if (!createOrderDto.billingAddress) {
          throw new BadRequestException('Endereço de cobrança é obrigatório para boleto');
        }
        const boletoNumber = this.generateBoletoNumber();
        order.paymentDetails = boletoNumber;
        order.billingAddress = JSON.stringify(createOrderDto.billingAddress);
        break;
    }

    // Salvar o pedido primeiro para obter o ID
    const savedOrder = await this.ordersRepository.save(order);

    // Criar os itens do pedido com o orderId
    const orderItems = products.map(item => 
      this.orderItemsRepository.create({
        orderId: savedOrder.id,
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      })
    );

    // Salvar os itens do pedido
    await this.orderItemsRepository.save(orderItems);

    // Retornar o pedido completo com os itens
    return this.findOne(savedOrder.id, userId);
  }

  private validateCreditCard(creditCard: any): boolean {
    // Validação fake do cartão
    const cardNumber = creditCard.cardNumber.replace(/\s/g, '');
    return cardNumber.length === 16 && 
           /^\d+$/.test(cardNumber) && 
           creditCard.cvv.length === 3;
  }

  private generateBoletoNumber(): string {
    // Gera um número de boleto fake
    return '34191.12345 67890.101112 13141.516171 8 12345678901234';
  }

  async findAll(userId: string): Promise<OrderDto[]> {
    // Busca todos os pedidos do usuário
    const orders = await this.ordersRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    // Para cada pedido, busca os itens relacionados
    const result: OrderDto[] = [];
    for (const order of orders) {
      const items = await this.orderItemsRepository.find({
        where: { orderId: order.id },
        relations: ['product'],
      });

      // Mapeia os itens para o DTO
      const itemsDto: OrderItemDto[] = items.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
        product: item.product,
      }));

      // Monta o pedido com os itens
      result.push({
        id: order.id,
        userId: order.userId,
        totalAmount: Number(order.totalAmount),
        paymentMethod: order.paymentMethod,
        paymentDetails: order.paymentDetails,
        billingAddress: order.billingAddress,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: itemsDto,
      });
    }
    return result;
  }

  async findOne(id: string, userId: string): Promise<OrderDto> {
    const order = await this.ordersRepository.findOne({
      where: { id, userId },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    const items = await this.orderItemsRepository.find({
      where: { orderId: order.id },
      relations: ['product'],
    });

    const itemsDto: OrderItemDto[] = items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
      product: item.product,
    }));

    return {
      id: order.id,
      userId: order.userId,
      totalAmount: Number(order.totalAmount),
      paymentMethod: order.paymentMethod,
      paymentDetails: order.paymentDetails,
      billingAddress: order.billingAddress,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: itemsDto,
    };
  }
}
