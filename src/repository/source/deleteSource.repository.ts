import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  sourceId: string;
  userId: string;
};

export async function deleteSourceRepository({ sourceId, userId }: Props) {
  try {
    await prisma.source.delete({
      where: { id: sourceId, userId },
    });

    return { success: true, msg: 'Source deleted successfully!' };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error deleting source');
    }
    throw new createError.InternalServerError(err as string);
  }
}
