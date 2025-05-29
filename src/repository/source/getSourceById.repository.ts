import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  sourceId: string;
  userId: string;
};

export async function getSourceByIdRepository({ sourceId, userId }: Props) {
  try {
    const sources = await prisma.source.findUnique({
      where: { id: sourceId, userId },
    });

    return sources;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error fetching sources');
    }
    throw new createError.InternalServerError(error as string);
  }
}
