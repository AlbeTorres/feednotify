import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';
import { loginService } from '../../services/auth/login.service';
import { LoginSchema } from '../../validators/auth.schema';

export async function login(req: Request, res: Response) {
  const { email, password, code } = req.body;

  const validatedFields = LoginSchema.safeParse({ email, password, code });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Invalid Entry Data'); // Error genérico por seguridad
  }

  try {
    const response = await loginService({ email, password, code });

    switch (response.state) {
      case 'unverificated_email':
        res
          .status(202)
          .json({ success: false, state: response.state, msg: response.msg });
        break;
      case 'two_factor_token_send':
        res.status(202).json({
          success: false,
          state: response.state,
          msg: response.msg,
        });
        break;
      case 'success':
        res.status(200).json(response);
        break;
      default:
        break;
    }
  } catch (err: unknown) {
    // —— Errores conocidos ——
    if (err instanceof createError.HttpError) {
      // Ya viene con status y mensaje adecuados
      throw err;
    }
    if (err instanceof z.ZodError) {
      // Nunca debería llegar aquí porque lo validamos antes, pero…
      throw new createError.BadRequest('Internal Validation Error');
    }
  }
}
