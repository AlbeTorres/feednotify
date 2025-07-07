import cors from 'cors';
import express from 'express';
import errorHandler from './middleware/errorHandler.middleware';
import routes from './routes';
import swaggerDocument from './documentation/swaggerDocument';

import './workers/weeklyNewsletter.worker';

// crear eL servidor
const app = express();

// ===== MIDDLEWARES GLOBALES =====
//habilitar cors
app.use(cors());
//Habilitar Express.json
app.use(express.json());
//Habilitar Express.urlencoded
app.use(express.urlencoded({ extended: true }));
//Api Documentation
app.use('/api-docs', swaggerDocument);

//rutas
app.use('/api', routes);

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// ===== MANEJO DE RUTAS NO ENCONTRADAS =====
// Debe ir ANTES del errorHandler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
    availableRoutes: ['GET /health', 'GET /api-docs'],
  });
});

app.use(errorHandler);

// puerto de la app
const PORT = process.env.PORT || 4000;

// arrancar la app
app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
