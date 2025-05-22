import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  userId: string;
  data: {
    name?: string;
    email?: string;
    password?: string;
    emailVerified?: Date | null;
    role?: 'user' | 'admin';
    image?: string;
    isTwofactorEnabled?: boolean;
  };
};

export async function updateUserRepository({ userId, data }: Props) {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });
    return updatedUser;
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error de base de datos');
    }
    // Handle error
    console.error('[Update User Error]', err);
    throw new createError.InternalServerError('Error updating user');
  }
}
