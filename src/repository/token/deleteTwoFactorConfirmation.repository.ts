import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

export const deleteTwoFactorConfirmationTokenRepository = async (
  id: string
) => {
  try {
    await prisma.twoFactorConfirmation.delete({
      where: { id },
    });

    return {
      success: true,
      msg: 'Two Factor Confirmation deleted successfully',
    };
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error de base de datos');
    }
    console.error('Error deleting Two Factor Confirmation:', err);
    throw new createError.InternalServerError(err as string);
  }
};
