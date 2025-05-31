import { BaseEntity } from '../../../common/interfaces/base.interface';
import { ProductCategory } from '../dto/create-product.dto';

export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl?: string;
  isAvailable: boolean;
}
