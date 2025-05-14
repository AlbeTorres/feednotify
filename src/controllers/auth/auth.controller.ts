import { Request, Response } from 'express';
import { loginService } from '../../services/auth/login.service';
import { registerService } from '../../services/auth/register.service';

export async function login(req: Request, res: Response) {
  const { email, password, code } = req.body;

  const response = await loginService({ email, password, code });

  res.status(200).json(response);
}

export async function register(req: Request, res: Response) {
  const { name, email, password, role } = req.body;

  const response = await registerService({ name, email, password, role });

  res.status(201).json(response);
}
