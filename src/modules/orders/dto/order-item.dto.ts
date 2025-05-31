import { Product } from '../../products/entities/product.entity';
import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';

@Entity()
export class OrderItemDto {
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  productId: string;

  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
