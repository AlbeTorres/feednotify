import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

export async function getNewsletterByUserRepository(userId: string) {
  try {
    const newsletters = await prisma.newsletter.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
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

    return newsletters;
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error fetching newsletters');
    }
    throw new createError.InternalServerError(err as string);
  }
}
