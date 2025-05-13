import { Prisma } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import createError from 'http-errors';
import * as z from 'zod';
import prisma from '../../config/prisma.js';
import { sendVerificationMail } from '../../email/sendVerificationMail.js';
import {
  RegisterSchema,
  RegisterSchemaType,
} from '../../validators/auth.schema.js';
import { generateVerificationToken } from '../token/generateVerificationToken.service.js';

export async function Register({
  name,
  password,
  email,
  role,
}: RegisterSchemaType) {
  const validatedFields = RegisterSchema.safeParse({
    email,
    password,
    name,
    role,
  });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Datos de entrada inválidos'); // Error genérico por seguridad
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLocaleLowerCase() },
    });

    if (existingUser) {
      throw new createError.Conflict('El usuario ya existe');
    }

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLocaleLowerCase(),
        password: bcryptjs.hashSync(password),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user || !user.email) {
      throw new createError.InternalServerError('Error al crear el usuario');
    }

    // Enviar correo de confirmación
    const verificationToken = await generateVerificationToken(user.email);
    sendVerificationMail(
      user.email,
      verificationToken!.token,
      user!.name || ''
    );

    return { msg: 'Usuario creado', user, status: 'Confirmation email sent' };
  } catch (err: unknown) {
    // —— Errores conocidos ——
    if (err instanceof createError.HttpError) {
      // Ya viene con status y mensaje adecuados
      throw err;
    }
    if (err instanceof z.ZodError) {
      // Nunca debería llegar aquí porque lo validamos antes, pero…
      throw new createError.BadRequest('Error de validación interno');
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // P2025 sería “registro no encontrado”, aunque en login ya lo cubrimos
      throw new createError.InternalServerError('Error de base de datos');
    }
    // —— Falla desconocida ——
    // Log interno útil para debugging (evitar mostrarlo al usuario)
    console.error('[Register Error]', err);
    throw new createError.InternalServerError(
      'Error inesperado al Registrar usuario'
    );
  }
}
