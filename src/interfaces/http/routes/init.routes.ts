import { Router } from 'express';

const router = Router();

// Basic health check
router.get('/hello-world', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Holi',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API health check
router.get('/api/hello-world', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hello World API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

export const initRoutes = router;
