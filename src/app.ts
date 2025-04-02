  import express from 'express';
  import authRoutes from './routes/authRoutes';
  import productRoutes from './routes/productRoutes';
  import morgan from 'morgan';

  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('combined'));

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);

  // check endpoint
  app.get('/', (_req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'API is running',
    });
  });

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });


  export default app;


