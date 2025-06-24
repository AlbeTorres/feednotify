import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  newsletterId: string;
  category: string;
  name: string;
  sources: string[];
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
          connect: sources.map((s) => ({ id: s })),
        },
        userId,
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

    return newNewsletter;
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error updating Newsletter');
    }
    throw new createError.InternalServerError(err as string);
  }
}
