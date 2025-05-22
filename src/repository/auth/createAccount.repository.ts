import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  userId: string;
  provider: string;
  providerAccountId: string;
  type: string;
  expires_at: number;
  id_token: string;
  access_token?: string;
};

export async function createAccountRepository({
  userId,
  provider,
  providerAccountId,
  type,
  expires_at,
  id_token,
  access_token,
}: Props) {
  try {
    const account = await prisma.account.create({
      data: {
        userId: userId,
        provider,
        providerAccountId,
        type,
        expires_at,
        id_token,
        access_token,
      },
    });

    return account;
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError(
        'Error creating OAuth account:'
      );
    }
    throw new createError.InternalServerError(err as string);
  }
}
