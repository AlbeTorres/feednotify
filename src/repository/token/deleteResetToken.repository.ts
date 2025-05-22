import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

export const deleteResetTokenRepository = async (id: string) => {
  try {
    await prisma.passwordResetToken.delete({
      where: { id },
    });

    return {
      success: true,
      msg: 'Reset Token deleted successfully',
    };
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error de base de datos');
    }
    console.error('Error deleting Reset Token:', err);
    throw new createError.InternalServerError(err as string);
  }
};
