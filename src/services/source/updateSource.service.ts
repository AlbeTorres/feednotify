import createError from 'http-errors';
import { updateSourceRepository } from '../../repository/source/updateSource.repository';
import { UpdateSourceSchemaType } from '../../validators/source.schema';
export async function updateSourceService({
  name,
  sourceId,
  type,
  url,
  userId,
}: UpdateSourceSchemaType) {
  try {
    const updatedSource = await updateSourceRepository({
      sourceId,
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
    if (err instanceof createError.HttpError) {
      throw err;
    }
    console.error('[Update Source Error]', err);
    throw new createError.InternalServerError(
      'Unespected error updating source: ' + (err as string)
    );
  }
}
