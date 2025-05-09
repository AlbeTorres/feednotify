// src/types/express/index.d.ts
import { JwtPayload } from '../../interfaces/jwtPayload.interface'; // Ajusta la ruta

declare global {
  namespace Express {
    export interface Request {
      usuario?: JwtPayload; // Usa el nombre y tipo que definiste
    }
  }
}
