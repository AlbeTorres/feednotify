import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

export const deleteVerificationTokenRepository = async (id: string) => {
  try {
    await prisma.verificationToken.delete({
      where: { id },
    });

    return { success: true, msg: 'Token deleted successfully' };
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error de base de datos');
    }
    console.error('Error deleting verification Token:', err);
    throw new createError.InternalServerError(err as string);
  }
};
