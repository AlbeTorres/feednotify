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
    });

    return newsletter;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error fetching newsletter');
    }
    throw new createError.InternalServerError(error as string);
  }
}
