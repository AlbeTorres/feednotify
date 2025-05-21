// src/types/express/index.d.ts
import { JwtPayload } from '../../interfaces/jwtPayload.interface'; // Ajusta la ruta

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload; // Usa el nombre y tipo que definiste
      client_name?: string; // Añadido para la API Key
    }
  }
}
