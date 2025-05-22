import cryto from 'crypto';
import prisma from '../../config/prisma';
import { getTwoFactorTokenByEmail } from '../../repository/token/getTwoFactorTokenByEmail.repository';

export const generateTwoFactorToken = async (email: string) => {
  const token = cryto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // five minutes from now

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await prisma.twoFactorToken.delete({ where: { id: existingToken.id } });
  }

  const twoFactorToken = await prisma.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
};
