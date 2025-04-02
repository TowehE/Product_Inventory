import Joi from 'joi';

export const userValidation = {
  register: Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin').default('user')
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

export const productValidation = {
  create: Joi.object({
    name: Joi.string().trim().min(3).max(100).required(),
    description: Joi.string().trim().max(500),
    price: Joi.number().positive().precision(2).required(),
    category: Joi.string().trim().min(2).max(50).required(),
    stock: Joi.number().integer().min(0).default(0)
  }),
  update: Joi.object({
    name: Joi.string().trim().min(3).max(100),
    description: Joi.string().trim().max(500),
    price: Joi.number().positive().precision(2),
    category: Joi.string().trim().min(2).max(50),
    stock: Joi.number().integer().min(0)
  }).min(1)
};

export const cartValidation = {
  addToCart: Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
  }),
  
  updateQuantity: Joi.object({
    quantity: Joi.number().integer().min(1).required(),
  }),
};
