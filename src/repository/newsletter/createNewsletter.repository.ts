import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';
import { Source } from '../../interfaces';

type Props = {
  category: string;
  name: string;
  sources: Source[];
  userId: string;
};

export async function createNewsletterRepository({
  userId,
  category,
  name,
  sources,
}: Props) {
  try {
    const newNewsletter = await prisma.newsletter.create({
      data: {
        name,
        category,
        source: {
          connect: sources.map((s) => ({ id: s.sourceId })),
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
