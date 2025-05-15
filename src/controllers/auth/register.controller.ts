import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import createError from 'http-errors';
import { JsonWebTokenError } from 'jsonwebtoken';
import { registerService } from '../../services/auth/register.service';
import { RegisterSchema } from '../../validators/auth.schema';

export async function register(req: Request, res: Response) {
  const { name, email, password, role } = req.body;
  const validatedFields = RegisterSchema.safeParse({
    email,
    password,
    name,
    role,
  });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Datos de entrada inválidos'); // Error genérico por seguridad
  }

  try {
    const response = await registerService({ name, email, password, role });

    res.status(200).json(response);
  } catch (err: unknown) {
    // —— Errores conocidos ——
    if (err instanceof createError.HttpError) {
      // Ya viene con status y mensaje adecuados
      throw err;
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // P2025 sería “registro no encontrado”, aunque en login ya lo cubrimos
      throw new createError.InternalServerError('Error de base de datos');
    }
    if (err instanceof JsonWebTokenError) {
      throw new createError.InternalServerError('Error al generar token');
    }

    // —— Falla desconocida ——
    // Log interno útil para debugging (evitar mostrarlo al usuario)
    console.error('[Login Error]', err);
    throw new createError.InternalServerError(
      'Error inesperado al iniciar sesión'
    );
  }
}
