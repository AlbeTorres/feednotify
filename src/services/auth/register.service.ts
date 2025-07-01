import bcryptjs from 'bcryptjs';
import createError from 'http-errors';
import { sendVerificationMail } from '../../email/senders/sendVerificationMail';
import { createUserRepository } from '../../repository/auth/createUser.repository';
import { getUserByEmailRepository } from '../../repository/auth/getUserByEmail.repository';
import { RegisterSchemaType } from '../../validators/auth.schema';
import { generateVerificationToken } from '../token/generateVerificationToken.service';

export async function registerService({
  name,
  password,
  email,
}: RegisterSchemaType) {
  try {
    // Verificar si el usuario ya existe

    const existingUser = await getUserByEmailRepository(
      email.toLocaleLowerCase()
    );

    if (existingUser) {
      throw new createError.Conflict('El usuario ya existe');
    }

    // Crear el usuario

    const user = await createUserRepository({
      name,
      email: email.toLocaleLowerCase(),
      password: bcryptjs.hashSync(password),
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

    return {
      success: true,
      msg: 'User registered successfully',
      user,
      status: 'Confirmation email sent',
    };
  } catch (err: unknown) {
    // —— Errores conocidos ——
    if (err instanceof createError.HttpError) {
      // Ya viene con status y mensaje adecuados
      throw err;
    }
    // —— Falla desconocida ——
    // Log interno útil para debugging (evitar mostrarlo al usuario)
    console.error('[Register Error]', err);
    throw new createError.InternalServerError(
      'Error inesperado al Registrar usuario'
    );
  }
}
