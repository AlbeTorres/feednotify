import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  name: string;
  email: string;
  image?: string;
  password: string;
};

export async function createUserRepository({
  email,
  name,
  image,
  password,
}: Props) {
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        image,
        password,
        account: {
          create: {
            provider: 'credentials',
            providerAccountId: email,
            type: 'credentials',
            expires_at: 0,
            id_token: '',
            access_token: '',
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return user;
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error creating user:');
    }
    throw new createError.InternalServerError(err as string);
  }
}
