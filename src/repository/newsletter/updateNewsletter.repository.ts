import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';
import { Source } from '../../interfaces';

type Props = {
  newsletterId: string;
  category: string;
  name: string;
  sources: Source[];
  userId: string;
};

export async function updateNewsletterRepository({
  newsletterId,
  userId,
  category,
  name,
  sources,
}: Props) {
  try {
    const newNewsletter = await prisma.newsletter.update({
      where: { id: newsletterId, userId },
      data: {
        name,
        category,
        source: {
          connect: sources.map((s) => ({ id: s.id })),
        },
        userId,
      },
    });

    return newNewsletter;
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error updating Newsletter');
    }
    throw new createError.InternalServerError(err as string);
  }
}
