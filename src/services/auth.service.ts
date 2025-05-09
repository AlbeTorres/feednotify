import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import jwt, { JsonWebTokenError, SignOptions } from 'jsonwebtoken';
import * as z from 'zod';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/jwt.config.js';
import { JwtPayload } from '../Interfaces/jwtPayload.interface.js';
import prisma from '../lib/prisma.js';
import { LoginDto } from '../validators/auth.schema.js';

export async function Login({
  email,
  password,
}: z.infer<typeof LoginDto>): Promise<{ token: string; user: JwtPayload }> {
  const validatedFields = LoginDto.safeParse({ email, password });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Datos de entrada inválidos'); // Error genérico por seguridad
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.email || !user.password) {
      throw new createError.Unauthorized(
        'Credenciales no válidas: Usuario no encontrado.'
      ); // Error genérico por seguridad
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new createError.Unauthorized('Credenciales no válidas.');

    const signOptions: SignOptions = {
      expiresIn: Number(JWT_EXPIRES_IN), // Tiempo de expiración del token
    };

    // Crear el payload para el JWT
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Firmar el token
    const token = jwt.sign(payload, JWT_SECRET, signOptions);

    return { token, user: payload };
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
    if (err instanceof JsonWebTokenError) {
      throw new createError.InternalServerError('Error al generar token');
    }

    // —— Falla desconocida ——
    // Log interno útil para debugging (evitar mostrarlo al usuario)
    console.error('[Login Error]', err);
    throw new createError.InternalServerError(
      'Error inesperado al iniciar sesión'
    );
  }
}

// if (!user.emailVerified) {
//   const verificationToken = await generateVerificationToken(user.email)
//   sendVerificationMail(user.email, verificationToken!.token, user!.name || '')
//   throw new Error('Email no verificado. Se ha enviado un correo de verificación.'); // Error genérico por seguridad
// }

// if (user.isTwofactorEnabled && user.email) {
//   if (code) {
//     const twoFactorToken = await getTwoFactorTokenByEmail(user.email)

//     if (!twoFactorToken || twoFactorToken.token !== code)
//       throw new Error('Código de autenticación inválido.'); // Error genérico por seguridad

//     const hasExpired = new Date(twoFactorToken.expires) < new Date()

//     if (hasExpired) throw new Error('El código ha expirado.'); // Error genérico por seguridad

//     const existingConfirmation = await getTwofactorConfirmationByUserId(user.id)

//     if (existingConfirmation) {
//       await prisma.twoFactorConfirmation.delete({
//         where: {
//           id: existingConfirmation.id,
//         },
//       })
//     }

//     await prisma.twoFactorConfirmation.create({
//       data: {
//         userId: user.id,
//       },
//     })
//   } else {
//     const twoFactorToken = await generateTwoFactorToken(user.email)
//     sendTwoFactorTokenMail(user.email, twoFactorToken.token, user.name || '')
//     throw new Error('Se ha enviado un código de autenticación a tu correo electrónico.'); // Error genérico por seguridad
//   }
// }

//   // Simula la búsqueda de un usuario por nombre de usuario o email
//   private async findUserByUsernameOrEmail(usernameOrEmail: string): Promise<User | undefined> {
//     // En una aplicación real, harías una consulta a tu base de datos:
//     // ej. return await UserModel.findOne({ $or: [{ username }, { email }] });
//     const lowerCaseInput = usernameOrEmail.toLowerCase();
//     return usersDB.find(
//       (user) => user.username.toLowerCase() === lowerCaseInput || user.email.toLowerCase() === lowerCaseInput
//     );
//   }

//   public async login(loginDto: LoginDto): Promise<{ token: string; user: JwtPayload }> {
//     const { usernameOrEmail, password } = loginDto;

//     const user = await this.findUserByUsernameOrEmail(usernameOrEmail);

//     if (!user) {
//       throw new Error('Credenciales inválidas: Usuario no encontrado.'); // Error genérico por seguridad
//     }

//     const isPasswordMatching = await bcrypt.compare(password, user.passwordHash);

//     if (!isPasswordMatching) {
//       throw new Error('Credenciales inválidas: Contraseña incorrecta.'); // Error genérico
//     }

//     // Crear el payload para el JWT
//     const payload: JwtPayload = {
//       id: user.id,
//       username: user.username,
//       roles: user.roles,
//     };

//     // Firmar el token
//     const token = jwt.sign(payload, JWT_SECRET, {
//       expiresIn: JWT_EXPIRES_IN,
//     });

//     return { token, user: payload };
//   }

//   // Podrías añadir un método register aquí también
//   public async register( /* ... userData ... */) {
//     // 1. Validar datos
//     // 2. Comprobar si el usuario ya existe
//     // 3. Hashear la contraseña (bcrypt.hash)
//     // 4. Guardar el usuario en la BD
//     // 5. Opcionalmente, generar un token y loguearlo directamente
//     // throw new Error('Método de registro no implementado');
//     console.log("Registrar usuario - Lógica pendiente");
//     // Ejemplo básico de cómo usar createTestUser para registrar desde fuera (si es necesario)
//     // Por ahora, puedes llamar a createTestUser directamente en tu app.ts para tener usuarios de prueba.
//   }
// }
