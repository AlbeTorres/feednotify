import createError from 'http-errors';
import { updateSourceRepository } from '../../repository/source/updateSource.repository';
import { UpdateSourceSchemaType } from '../../validators/source.schema';
export async function updateSourceService(
  { name, id, type, url }: UpdateSourceSchemaType,
  userId: string
) {
  try {
    // Llamar al repositorio para actualizar la fuente
    const updatedSource = await updateSourceRepository({
      id,
      type,
      name,
      url,
      userId,
    });

    if (!updatedSource) {
      throw new createError.InternalServerError('Error updating source');
    }

    return {
      updatedSource,
      success: true,
      msg: 'Source update successful!',
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
      'Unespected error updating source: ' + (err as string)
    );
  }
}
