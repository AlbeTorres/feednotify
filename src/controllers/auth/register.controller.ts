import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';
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

    if (response.success) {
      res.status(200).json({ message: response.msg });
    } else {
      throw new createError.InternalServerError(
        'Error al registrar el usuario'
      );
    }
  } catch (err: unknown) {
    // —— Errores conocidos ——
    if (err instanceof createError.HttpError) {
      // Ya viene con status y mensaje adecuados
      throw err;
    }
    if (err instanceof z.ZodError) {
      // Nunca debería llegar aquí porque lo validamos antes, pero…
      throw new createError.BadRequest('Error de validación interno');
    }

    // —— Falla desconocida ——
    // Log interno útil para debugging (evitar mostrarlo al usuario)
    console.error('[Register Error]', err);
    throw new createError.InternalServerError(
      'Error inesperado al iniciar sesión'
    );
  }
}
