import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  userId: string;
  provider: string;
  providerAccountId?: string;
};

export async function getAccountByRepository({
  userId,
  provider,
  providerAccountId,
}: Props) {
  try {
    const account = await prisma.account.findFirst({
      where: {
        userId,
        provider,
        providerAccountId,
      },
    });

    return account;
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError(
        'Error getting OAuth account by userId and provider'
      );
    }
    throw new createError.InternalServerError(err as string);
  }
}
