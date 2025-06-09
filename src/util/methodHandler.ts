import { Request, Response } from 'express';

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT' | 'OPTIONS';

export function methodNotAllowed(allowed: Method[]) {
  return (_: Request, res: Response) => {
    res.set('Allow', allowed.join(', '));
    res.status(405).json({
      status: 'error',
      message: 'Method Not Allowed',
      availableMethods: allowed,
    });
  };
}
