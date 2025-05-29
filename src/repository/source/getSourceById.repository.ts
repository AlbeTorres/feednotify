import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  id: string;
  userId: string;
};

export async function getSourcesByUserRepository({ id, userId }: Props) {
  try {
    const sources = await prisma.source.findUnique({
      where: { id, userId },
    });

    return sources;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error fetching sources');
    }
    throw new createError.InternalServerError(error as string);
  }
}
