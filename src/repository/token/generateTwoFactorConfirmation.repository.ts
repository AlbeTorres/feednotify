import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

export const generateTwoFactorConfirmation = async (userId: string) => {
  try {
    await prisma.twoFactorConfirmation.create({
      data: {
        userId,
      },
    });
    return {
      success: true,
      msg: 'Two Factor Confirmation generated successfully',
    };
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error de base de datos');
    }
    console.error('Error generating Two Factor Confirmation:', err);
    throw new createError.InternalServerError(err as string);
  }
};
