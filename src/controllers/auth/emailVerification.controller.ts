import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';
import { emailVerificationService } from '../../services/auth/emailVerification.service';
import { EmailVerificationSchema } from '../../validators/auth.schema';

export async function emailVerification(req: Request, res: Response) {
  const { token } = req.body;
  const validatedFields = EmailVerificationSchema.safeParse({ token });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Invalid input data');
  }

  try {
    const response = await emailVerificationService({ token });

    if (response.success) {
      res.status(200).json({
        success: true,
        message: 'Successfully verified email',
      });
    } else {
      throw new createError.InternalServerError('Verification email failed');
    }
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }
    if (err instanceof z.ZodError) {
      throw new createError.BadRequest('Internal data validation error');
    }
  }
}
