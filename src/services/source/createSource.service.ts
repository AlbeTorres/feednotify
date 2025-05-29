import createError from 'http-errors';
import { createSourceRepository } from '../../repository/source/createSource.repository';
import { CreateSourceSchemaType } from '../../validators/source.schema';

export async function createSourceService(
  { type, name, url }: CreateSourceSchemaType,
  userId: string
) {
  try {
    // Llamar al repositorio para crear la fuente
    const newSource = await createSourceRepository({
      type: type,
      name: name,
      url: url,
      userId: userId,
    });

    if (!newSource) {
      throw new createError.InternalServerError('Error creating source');
    }

    return {
      newSource,
      success: true,
      msg: 'Source create successful!',
    };
  } catch (err: unknown) {
    // —— Errores conocidos ——
    if (err instanceof createError.HttpError) {
      // Ya viene con status y mensaje adecuados
      throw err;
    }

    // —— Falla desconocida ——
    // Log interno útil para debugging (evitar mostrarlo al usuario)
    console.error('[Update Source Error]', err);
    throw new createError.InternalServerError(
      'Unespected error creating source: ' + (err as string)
    );
  }
}
