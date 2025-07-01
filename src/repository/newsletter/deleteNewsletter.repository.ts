import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  newsletterId: string;
  userId: string;
};

export async function deleteNewsletterRepository({
  newsletterId,
  userId,
}: Props) {
  try {
    await prisma.newsletter.delete({
      where: { id: newsletterId, userId },
    });

    return { success: true, msg: 'Newsletter deleted successfully!' };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error deleting newsletter');
    }
    throw new createError.InternalServerError(err as string);
  }
}
