import cors from 'cors';
import express from 'express';
import errorHandler from './middleware/errorHandler.middleware';
import routes from './routes';

// crear eL servidor
const app = express();

//habilitar cors
app.use(cors());

//Habilitar Express.json
app.use(express.json());
app.use(errorHandler);

//rutas
app.use('/api', routes);

// puerto de la app
const PORT = process.env.PORT || 4000;

// arrancar la app
app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
