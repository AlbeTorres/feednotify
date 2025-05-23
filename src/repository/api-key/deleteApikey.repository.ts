import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

export const deleteApiKeyRepository = async (id: string) => {
  try {
    await prisma.apiKey.delete({
      where: { id },
    });

    return {
      success: true,
      msg: 'Apikey deleted successfully',
    };
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error de base de datos');
    }
    console.error('Error deleting apikey:', err);
    throw new createError.InternalServerError(err as string);
  }
};
