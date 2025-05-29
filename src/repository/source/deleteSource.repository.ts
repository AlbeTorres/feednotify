import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  id: string;
  userId: string;
};

export async function deleteSourceRepository({ id, userId }: Props) {
  try {
    await prisma.source.delete({
      where: { id, userId },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error deleting source');
    }
    throw new createError.InternalServerError(err as string);
  }
}
