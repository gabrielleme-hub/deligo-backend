import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductCategory } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, userType: string): Promise<Product> {
    if (userType !== 'admin') {
      throw new ForbiddenException('Apenas administradores podem criar produtos');
    }

    const newProduct = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(newProduct);
  }

  async findAll(filters?: {
    category?: ProductCategory;
    minPrice?: number;
    maxPrice?: number;
    isAvailable?: boolean;
  }): Promise<Product[]> {
    const queryBuilder = this.productsRepository.createQueryBuilder('product');

    if (filters) {
      if (filters.category) {
        queryBuilder.andWhere('product.category = :category', { category: filters.category });
      }
      if (filters.minPrice !== undefined) {
        queryBuilder.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
      }
      if (filters.maxPrice !== undefined) {
        queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
      }
      if (filters.isAvailable !== undefined) {
        queryBuilder.andWhere('product.isAvailable = :isAvailable', { isAvailable: filters.isAvailable });
      }
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, userType: string): Promise<Product> {
    if (userType !== 'admin') {
      throw new ForbiddenException('Apenas administradores podem atualizar produtos');
    }

    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: string, userType: string): Promise<void> {
    if (userType !== 'admin') {
      throw new ForbiddenException('Apenas administradores podem remover produtos');
    }

    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }
} 