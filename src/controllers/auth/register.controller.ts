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
    throw new createError.BadRequest('Inavlid input data'); // Error genérico por seguridad
  }

  try {
    const response = await registerService({ name, email, password, role });

    if (response.success) {
      res.status(200).json(response);
    } else {
      throw new createError.InternalServerError('Error registering user');
    }
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }
    if (err instanceof z.ZodError) {
      throw new createError.BadRequest('Internal validation error');
    }

    console.error('[Register Error]', err);
    throw new createError.InternalServerError(
      'An unexpected error occurred while registering the user.'
    );
  }
}
