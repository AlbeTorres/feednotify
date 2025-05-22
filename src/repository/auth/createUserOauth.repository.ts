import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  name: string;
  email: string;
  image: string;
  provider: string;
  providerAccountId: string;
  type: string;
  expires_at: number;
  id_token: string;
  access_token?: string;
};

export async function createOauthUserRepository({
  email,
  name,
  image,
  provider,
  providerAccountId,
  type,
  expires_at,
  id_token,
  access_token,
}: Props) {
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        image,
        account: {
          create: {
            provider,
            providerAccountId,
            type,
            expires_at,
            id_token,
            access_token,
          },
        },
      },
    });

    return user;
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error creating OAuth user:');
    }
    throw new createError.InternalServerError(err as string);
  }
}
