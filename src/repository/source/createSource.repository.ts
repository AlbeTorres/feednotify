import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  type: string;
  name: string;
  url: string;
  userId: string;
};

export async function createSourceRepository({
  userId,
  type,
  name,
  url,
}: Props) {
  try {
    const newSource = await prisma.source.create({
      data: {
        name,
        type,
        url,
        userId,
      },
    });

    return newSource;
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error creating OAuth user:');
    }
    throw new createError.InternalServerError(err as string);
  }
}
