import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';
import { resetPasswordEmailSenderService } from '../../services/auth/resetPasswordEmailSender.service';
import { ResetPasswordEmailSenderSchema } from '../../validators/auth.schema';

export async function resetPasswordEmailSender(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const validatedFields = ResetPasswordEmailSenderSchema.safeParse({ email });

    if (!validatedFields.success) {
      throw new createError.BadRequest('Invalid input data');
    }

    const response = await resetPasswordEmailSenderService({ email });

    if (response.success) {
      res
        .status(200)
        .json({ success: true, message: 'Reset password email sent' });
    } else {
      throw new createError.InternalServerError(
        'Error sending reset password email'
      );
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
