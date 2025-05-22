import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  email: string;
  data: {
    password?: string;
  };
};

export async function resetPasswordRepository({ email, data }: Props) {
  try {
    await prisma.user.update({
      where: {
        email,
      },
      data,
    });
    return {
      success: true,
      msg: 'Password changed',
    };
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error de base de datos');
    }
    // Handle error
    console.error('[Reset Password Error]', err);
    throw new createError.InternalServerError('Error resetting user password');
  }
}
