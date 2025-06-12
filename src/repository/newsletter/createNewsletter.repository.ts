import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';
import { Source } from '../../interfaces';

type Props = {
  type: string;
  name: string;
  sources: Source[];
  userId: string;
};

export async function createNewsletterRepository({
  userId,
  type,
  name,
  sources,
}: Props) {
  try {
    const newNewsletter = await prisma.newsletter.create({
      data: {
        name,
        type,
        source: {
          connect: sources.map((s) => ({ id: s.id })),
        },
        userId,
      },
    });

    return newNewsletter;
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error creating Newsletter');
    }
    throw new createError.InternalServerError(err as string);
  }
}
