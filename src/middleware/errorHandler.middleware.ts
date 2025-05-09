import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

export default function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  // Si ya es un HttpError (400, 401, etc.), lo reutilizamos;
  // si no, creamos un 500 genérico.
  const httpError = createError.isHttpError(err)
    ? err
    : createError(500, 'Internal Server Error');

  // Log interno para debugging
  console.error('[Error Handler]', err);

  res.status(httpError.statusCode).json({
    status: 'error',
    message: httpError.message,
  });
}
