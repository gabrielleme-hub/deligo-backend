import { OrderItemDto } from './order-item.dto';

export class OrderDto {
  id: string;
  userId: string;
  totalAmount: number;
  paymentMethod: string;
  paymentDetails?: string;
  billingAddress?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItemDto[];
}