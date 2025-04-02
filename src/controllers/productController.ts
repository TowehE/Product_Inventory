import { Request, Response } from 'express';
import ProductService from '../services/productService';


interface AuthenticatedRequest extends Request {
  userId?: string;
}

export default class ProductController {
  static async createProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const product = await ProductService.createProduct(req.body, req.userId!);
  
      res.status(201).json({
        message: 'Product created successfully',
        product
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  

  static async getProducts(req: AuthenticatedRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string;
      const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
      const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
      
      const result = await ProductService.getProducts(
        req.userId!,
        page,
        limit,
        { category, minPrice, maxPrice }
      );

      
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async getProductById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      const product = await ProductService.getProductById(productId, req.userId!);
      
      res.status(200).json({ product });
    } catch (error: any) {
      if (error.message === "Product not found") {
        res.status(404).json({ error: error.message });
        return;
      }
      
      if (error.message === "Invalid product ID") {
        res.status(400).json({ error: error.message });
        return;
      }
      
      res.status(500).json({ error: "Server error" });
    }
  }

  static async updateProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      const product = await ProductService.updateProduct(productId, req.userId!, req.body);
      
      res.status(200).json({
        message: "Product updated successfully",
        product
      });
    } catch (error: any) {
      if (error.message === "Product not found or unauthorized") {
        res.status(404).json({ error: "Product not found or unauthorized" });
        return;
      }
      
      if (error.message === "Invalid product ID") {
        res.status(400).json({ error: error.message });
        return;
      }
      
      res.status(500).json({ error: "Server error" });
    }
  }

  static async deleteProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      await ProductService.deleteProduct(productId, req.userId!);
      
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error: any) {
      if (error.message === "Product not found or unauthorized") {
        res.status(404).json({ error: "Product not found or unauthorized" });
        return;
      }
      
      if (error.message === "Invalid product ID") {
        res.status(400).json({ error: error.message });
        return;
      }
      
      res.status(500).json({ error: "Server error" });
    }
 
  }


static async buyProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { productId, quantity = 1 } = req.body; 

    if (!productId) {
      res.status(400).json({ error: "Product ID is required" });
      return;
    }

    if (quantity <= 0) {
      res.status(400).json({ error: "Quantity must be greater than zero" });
      return;
    }

    const result = await ProductService.buyProductReduceStock(productId, req.userId!, quantity); 

    res.status(200).json({
      message: "Product purchased successfully",
      product: result.product,
      purchaseDetails: {
        quantity: quantity,
        totalPrice: result.totalPrice
      }
    });
  } catch (error: any) {
    console.error("Buy product error:", error.message);

    if (error.message === "Product not found") {
      res.status(404).json({ error: error.message });
      return;
    }

    if (error.message === "Invalid product ID") {
      res.status(400).json({ error: error.message });
      return;
    }

    if (error.message === "Insufficient stock") {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: "Server error", details: error.message });
  }
}
}