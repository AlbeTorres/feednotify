import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';

type Props = {
  id: string;
  type: string;
  name: string;
  url: string;
  userId: string; // Aunque no se usa aquí, puede ser útil para futuras validaciones o auditorías
};

export async function updateSourceRepository({
  id,
  type,
  name,
  url,
  userId,
}: Props) {
  try {
    const source = await prisma.source.update({
      where: { id, userId }, // Asegurarse de que el usuario tiene permiso para actualizar esta fuente
      data: {
        name,
        type,
        url,
        updatedAt: new Date(), // Actualizar la fecha de modificación
      },
    });

    return source;
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error update source');
    }
    throw new createError.InternalServerError(err as string);
  }
}
