import createError from 'http-errors';
import { deleteSourceRepository } from '../../repository/source/deleteSource.repository';
import { DeleteSourceSchemaType } from '../../validators/source.schema';

export async function deleteSourceService({
  sourceId,
  userId,
}: DeleteSourceSchemaType) {
  try {
    await deleteSourceRepository({ sourceId, userId });

    return { success: true, msg: 'Source deleted successfully!' };
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }

    console.error('[Delete Source Error]', err);
    throw new createError.InternalServerError(
      'Unespected error deleting source: ' + (err as string)
    );
  }
}
