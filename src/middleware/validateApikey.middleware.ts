import * as crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import prisma from '../config/prisma';

export default async function validateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const receivedKey = req.headers['x-api-key'];
  if (!receivedKey || typeof receivedKey !== 'string') {
    throw new createError.Unauthorized('API key missing');
  }

  const hashedApiKey = crypto
    .createHash('sha256')
    .update(receivedKey)
    .digest('hex');

  const key = await prisma.apiKey.findUnique({
    where: { hashed_key: hashedApiKey, isActive: true },
  });
  //   const key = await prisma.ApiKey.findOne({ api_key: apiKey, is_active: true });
  if (!key) throw new createError.Forbidden('Invalid API key');

  const method = req.method;

  let requiredScope = '';

  switch (method) {
    case 'GET':
      requiredScope = 'read';
      break;
    case 'POST':
    case 'PUT':
    case 'PATCH':
    case 'DELETE':
      requiredScope = 'write';
      break;
    default:
      throw new createError.MethodNotAllowed('Method not allowed');
  }

  if (key.scopes && !key.scopes.includes(requiredScope)) {
    throw new createError.Forbidden(
      `API key does not have access to ${method} method`
    );
  }
  // Opcional: actualiza uso
  await prisma.apiKey.update({
    where: { id: key.id },
    data: { lastUsed: new Date(), requests_count: key.requests_count + 1 },
  });

  req.client_name = key.client_name;
  next();
}
