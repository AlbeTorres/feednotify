import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  newsletterId: string;
  userId: string;
};

export async function getNewsletterByIdRepository({
  newsletterId,
  userId,
}: Props) {
  try {
    const newsletter = await prisma.newsletter.findUnique({
      where: { id: newsletterId, userId },
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

    return newsletter;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error fetching newsletter');
    }
    throw new createError.InternalServerError(error as string);
  }
}
