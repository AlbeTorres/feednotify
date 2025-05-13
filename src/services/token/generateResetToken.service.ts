import { v4 as uuidv4 } from 'uuid';
import prisma from '../../config/prisma';
import { getResetTokenByEmail } from './getResetTokenByEmail.service';

export const generateResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // one hour from now

  const existingToken = await getResetTokenByEmail(email);

  if (existingToken) {
    await prisma.passwordResetToken.delete({ where: { id: existingToken.id } });
  }

  const resetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return resetToken;
};
