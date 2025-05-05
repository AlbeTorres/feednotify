import cors from 'cors';
import express from 'express';
import newsletterRoutes from './routes/newsletter';
import updatesRoutes from './routes/updates';

// crear eL servidor
const app = express();

//habilitar cors
app.use(cors());

//Habilitar Express.json
app.use(express.json());

app.use('/api/updates', updatesRoutes);
app.use('/api/newsletter', newsletterRoutes);

// puerto de la app
const PORT = process.env.PORT || 4000;

// arrancar la app
app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
