import createError from 'http-errors';
import { createBulkSourceRepository } from '../../repository/source/createBulkSource.repository';
import { CreateBulkSourceSchemaType } from '../../validators/source.schema';

export async function createBulkSourceService(
  sources: CreateBulkSourceSchemaType[],
  userId: string
): Promise<{
  newSources: {
    type: string;
    name: string;
    url: string;
    userId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  success: boolean;
  msg: string;
}> {
  try {
    const newSources = await createBulkSourceRepository(sources, userId);

    if (newSources.length === 0) {
      throw new createError.InternalServerError('No sources were created');
    }

    return {
      newSources,
      success: true,
      msg: 'Sources create successful!',
    };
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }

    console.error('[Update Source Error]', err);
    throw new createError.InternalServerError(
      'Unespected error creating source: ' + (err as string)
    );
  }
}
