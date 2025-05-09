// src/middleware/auth.middleware.ts
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../Interfaces/jwtPayload.interface';
import { JWT_SECRET } from '../config/jwt.config'; // Asegúrate de que la ruta sea correcta

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  // 1. Obtener el token del encabezado de autorización
  const authHeader = req.headers.authorization;

  // 2. Verificar si el encabezado existe y tiene el formato correcto ("Bearer <token>")
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message:
        'Acceso denegado. No se proporcionó token o el formato es incorrecto.',
    });
  }

  // 3. Extraer el token
  const token = authHeader.split(' ')[1]; // Obtiene la parte del token

  // 4. Verificar el token
  if (!token) {
    return res.status(401).json({
      message: 'Acceso denegado. Token no encontrado después de "Bearer ".',
    });
  }

  try {
    // Verifica el token usando la clave secreta.
    // jwt.verify puede devolver un string, JwtPayload (si es un objeto) o un objeto JsonWebTokenError
    const decodedPayload = jwt.verify(token, JWT_SECRET) as JwtPayload; // Hacemos un type assertion

    // 5. Añadir el payload decodificado al objeto `req`
    // Esto permite que las rutas protegidas accedan a la información del usuario
    req.usuario = decodedPayload;

    // 6. Si todo es correcto, pasar al siguiente middleware o controlador de ruta
    next();
  } catch (error: unknown) {
    // Es buena práctica tipar 'error' como 'unknown' primero
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: 'Acceso denegado. El token ha expirado.',
        error: error.message,
      });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      // Cubre NotBeforeError, etc.
      return res.status(401).json({
        message: 'Acceso denegado. Token inválido.',
        error: error.message,
      });
    }
    // Otros errores
    console.error('Error en la verificación del token:', error);
    return res.status(500).json({
      message: 'Error interno del servidor al validar el token.',
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};
