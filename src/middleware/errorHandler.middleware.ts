import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

export default function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  const httpError = createError.isHttpError(err)
    ? err
    : createError(500, 'Internal Server Error');

  console.error('[Error Handler]', err);

  res.status(httpError.statusCode).json({
    status: 'error',
    code: httpError.statusCode,
    message: httpError.message,
  });
}
