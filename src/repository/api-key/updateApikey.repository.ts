import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  apiKeyId: string;
  scopes?: ('write' | 'read')[];
  isActive: boolean;
};

export async function updateApiKeyRepository({
  apiKeyId,
  scopes,
  isActive,
}: Props) {
  try {
    const user = await prisma.apiKey.update({
      where: { id: apiKeyId },
      data: {
        isActive,
        scopes,
      },
    });

    return user;
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Database error occurred');
    }
    console.error('Error fetching user:', err);
    throw new createError.InternalServerError(err as string);
  }
}
