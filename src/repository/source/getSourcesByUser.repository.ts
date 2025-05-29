import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

export async function getSourcesByUserRepository(userId: string) {
  try {
    const sources = await prisma.source.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, // Ordenar por fecha de creación descendente
    });

    return sources;
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error fetching sources');
    }
    throw new createError.InternalServerError(err as string);
  }
}
