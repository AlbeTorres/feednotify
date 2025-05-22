import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  email: string;
  data: {
    emailVerified?: Date | null;
  };
};

export async function emailVerificationRepository({ email, data }: Props) {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: email,
      },
      data,
    });
    return updatedUser;
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error de base de datos');
    }
    // Handle error
    console.error('[Email Verification Error]', err);
    throw new createError.InternalServerError('Error updating user');
  }
}
