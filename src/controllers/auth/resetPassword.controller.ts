import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';
import { resetPasswordService } from '../../services/auth/resetPassword.service';
import { ResetPasswordSchema } from '../../validators/auth.schema';

export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, password } = req.body;

    const validatedFields = ResetPasswordSchema.safeParse({ token, password });

    if (!validatedFields.success) {
      throw new createError.BadRequest('Invalid input data');
    }

    const response = await resetPasswordService({ token, password });

    if (response.success) {
      res
        .status(200)
        .json({ success: true, message: 'Password reset successfully' });
    } else {
      throw new createError.InternalServerError('Failed to reset password.');
    }
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }
    if (err instanceof z.ZodError) {
      throw new createError.BadRequest('Internal validation error');
    }
  }
}
