// src/middleware/auth.middleware.ts
import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.config'; // Asegúrate de que la ruta sea correcta
import { JwtPayload } from '../Interfaces/jwtPayload.interface';


export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 1. Obtener el token del encabezado de autorización
  const authHeader = req.headers.authorization;

  // 2. Verificar si el encabezado existe y tiene el formato correcto ("Bearer <token>")
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new createError.Unauthorized(
      'Acceso denegado. No se proporcionó token o el formato es incorrecto.'
    ); // Error genérico por seguridad
  }

  // 3. Extraer el token
  const token = authHeader.split(' ')[1]; // Obtiene la parte del token

  // 4. Verificar el token
  if (!token) {
    throw new createError.Unauthorized(
      'Acceso denegado. Token no encontrado después de "Bearer ".'
    );
  }

  try {
    // Verifica el token usando la clave secreta.
    // jwt.verify puede devolver un string, JwtPayload (si es un objeto) o un objeto JsonWebTokenError
    const decodedPayload = jwt.verify(token, JWT_SECRET) as JwtPayload; // Hacemos un type assertion

    // 5. Añadir el payload decodificado al objeto `req`
    // Esto permite que las rutas protegidas accedan a la información del usuario
    req.user = decodedPayload;

    // 6. Si todo es correcto, pasar al siguiente middleware o controlador de ruta
    next();
  } catch (error: unknown) {
    // Es buena práctica tipar 'error' como 'unknown' primero
    if (error instanceof jwt.TokenExpiredError) {
      console.error(error.message);
      throw new createError.Unauthorized(
        'Acceso denegado. El token ha expirado.'
      );
    }
    if (error instanceof jwt.JsonWebTokenError) {
      // Cubre NotBeforeError, etc.

      console.error(error.message);
      throw new createError.Unauthorized('Acceso denegado. Token inválido.');
    }
    // Otros errores
    console.error('Error en la verificación del token:', error);
    console.error(error instanceof Error ? error.message : 'Error desconocido');
    throw new createError.InternalServerError(
      'Error interno del servidor al validar el token.'
    );
  }
}
