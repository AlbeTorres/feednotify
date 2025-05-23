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

//rutas
app.use('/api/', routes);

app.use(errorHandler);

// puerto de la app
const PORT = process.env.PORT || 4000;

// arrancar la app
app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
