import prisma from '../../config/prisma';

export async function getTwoFactorTokenByToken(token: string) {
  try {
    const resetToken = await prisma.twoFactorToken.findFirst({
      where: { token },
    });

    return resetToken;
  } catch (error) {
    console.error('Error fetching two-factor token by token:', error);
    return null;
  }
}
