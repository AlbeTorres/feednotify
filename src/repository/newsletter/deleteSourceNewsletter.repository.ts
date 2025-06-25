import { Prisma } from '@prisma/client';
import prisma from '../../config/prisma';
import createError from 'http-errors';

type Props = {
  newsletterId: string;
  sources: string[];
  userId: string;
};

export async function deleteSourceNewsletterRepository({
  newsletterId,
  sources,
  userId,
}: Props) {
  try {
    const updatedNewsletter = await prisma.newsletter.update({
      where: { id: newsletterId, userId },
      data: {
        source: {
          disconnect: sources.map((s) => ({ id: s })),
        },
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        category: true,
        name: true,
        source: {
          select: {
            id: true,
            name: true,
            type: true,
            url: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return updatedNewsletter;
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError(
        'Error deleting source from Newsletter'
      );
    }
    throw new createError.InternalServerError(err as string);
  }
}
