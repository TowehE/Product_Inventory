import express from "express";
import {authenticate, requireRole} from '../middleware/authMiddleware';
import ProductController from "../controllers/productController";
import { validate } from "../middleware/validationMiddleware";
import { productValidation } from "../utils/validationSchemas";

const router = express.Router();

// Admin routes
router.post( "/",  authenticate,  requireRole(['admin']), validate(productValidation.create),ProductController.createProduct);
router.put( "/:id",  authenticate, requireRole(['admin']), validate(productValidation.update),ProductController.updateProduct);
router.delete( "/:id", authenticate, requireRole(['admin']), ProductController.deleteProduct);



// Routes for both admin and users
router.get("/", authenticate, ProductController.getProducts);
router.get("/:id", authenticate, ProductController.getProductById);
router.post("/buy", authenticate, ProductController.buyProduct);


export default router;
