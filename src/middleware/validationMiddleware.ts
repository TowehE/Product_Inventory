import { Request, Response, NextFunction } from 'express';
import { userValidation, productValidation, cartValidation } from '../utils/validationSchemas';
import { Schema } from "joi"


export const validateUserRegistration = (
  req: Request, 
  res: Response, 
  next: NextFunction
): Response | void => {
  const { error } = userValidation.register.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};


export const validateUserLogin = (
  req: Request, 
  res: Response, 
  next: NextFunction
): Response | void => {
  const { error } = userValidation.login.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateProductCreate = (
  req: Request, 
  res: Response, 
  next: NextFunction
): Response | void => {
  const { error } = productValidation.create.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateProductUpdate = (
  req: Request, 
  res: Response, 
  next: NextFunction
): Response | void => {
  const { error } = productValidation.update.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();

};



export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
    next();
  };
};

