import createError from 'http-errors';
import { getSourceByIdRepository } from '../../repository/source/getSourceById.repository';
import { GetSourceByIdSchemaType } from '../../validators/source.schema';

export async function getSourceByIdService({
  sourceId,
  userId,
}: GetSourceByIdSchemaType) {
  try {
    const response = await getSourceByIdRepository({ sourceId, userId });
    if (!response) {
      throw new createError.NotFound('Source not found');
    }

    return {
      source: response,
      success: true,
      msg: 'Source retrieved successfully!',
    };
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }

    console.error('[Get Source By Id Error]', err);
    throw new createError.InternalServerError(
      'Unespected error retreiving source: ' + (err as string)
    );
  }
}
