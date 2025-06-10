import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  type: string;
  name: string;
  url: string;
}[];

export async function createBulkSourceRepository(
  sources: Props,
  userId: string
) {
  try {
    const newSources = await prisma.$transaction(
      sources.map(({ type, name, url }) =>
        prisma.source.create({
          data: {
            name,
            type,
            url,
            userId,
          },
        })
      )
    );

    return newSources;
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error creating sources:');
    }
    throw new createError.InternalServerError(err as string);
  }
}
