import Product, { IProduct } from '../models/Product';
import mongoose from 'mongoose';

interface ProductFilter {
  category?: string;
  price?: {
    $gte?: number;
    $lte?: number;
  };

}

export default class ProductService {
  static async createProduct(productData: Partial<IProduct>, userId: string) {
    const product = new Product({
      ...productData,
      createdBy: userId
    });
    
    return await product.save();
  }
  
  static async getProducts(
    userId: string,
    page = 1,
    limit = 10,
    filters: {
      category?: string;
      minPrice?: number;
      maxPrice?: number;
    } = {}
  ) {
    const query: ProductFilter = {};
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = filters.minPrice;
      if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }
    
  
    const skip = (page - 1) * limit;
    
 
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments(query);
    
    return {
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    };
  }
  
  static async getProductById(productId: string, userId: string) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid product ID');
    }
    
    const product = await Product.findById(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    return product;
  }
  
  static async updateProduct(
    productId: string,
    userId: string,
    updateData: Partial<IProduct>
  ) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid product ID');
    }
    
    const product = await Product.findOneAndUpdate(
      { _id: productId, createdBy: userId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      throw new Error('Product not found or unauthorized');
    }
    
    return product;
  }
  
  static async deleteProduct(productId: string, userId: string) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid product ID');
    }
    
    const product = await Product.findOneAndDelete({
      _id: productId,
      createdBy: userId
    });
    
    if (!product) {
      throw new Error('Product not found or unauthorized');
    }
    
    return product;
  }

static async buyProductReduceStock(productId: string, userId: string, quantity: number = 1) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid product ID');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const product = await Product.findById(productId).session(session);

      if (!product) {
        throw new Error('Product not found');
      }

      if (product.stock < quantity) {
        throw new Error('Insufficient stock');
      }

      const totalPrice = product.price * quantity;
      product.stock -= quantity;
      await product.save({ session });

      
      await session.commitTransaction();
      session.endSession();

      return { product, totalPrice };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}




