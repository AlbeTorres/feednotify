import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  client_name: string;
  userId: string;
  scopes: ('write' | 'read')[];
  hashed_key: string;
  createdAt: Date;
};

export const generateApiKeyRepository = async ({
  client_name,
  userId,
  scopes,
  hashed_key,
  createdAt,
}: Props) => {
  try {
    await prisma.apiKey.create({
      data: {
        client_name,
        userId,
        scopes,
        hashed_key,
        createdAt,
      },
    });

    return {
      success: true,
      msg: 'Apikey generated successfully',
    };
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error de base de datos');
    }
    console.error('Error generating Apikey:', err);
    throw new createError.InternalServerError(err as string);
  }
};
