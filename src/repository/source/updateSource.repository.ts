import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  sourceId: string;
  type: string;
  name: string;
  url: string;
  userId: string;
};

export async function updateSourceRepository({
  sourceId,
  type,
  name,
  url,
  userId,
}: Props) {
  try {
    const source = await prisma.source.update({
      where: { id: sourceId, userId },
      data: {
        name,
        type,
        url,
        updatedAt: new Date(),
      },
    });

    return source;
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error update source');
    }
    throw new createError.InternalServerError(err as string);
  }
}
