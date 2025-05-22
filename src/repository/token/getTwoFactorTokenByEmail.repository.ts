import prisma from '../../config/prisma';

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const resetToken = await prisma.twoFactorToken.findFirst({
      where: { email },
    });

    return resetToken;
  } catch (error) {
    console.error('Error fetching two-factor token by email:', error);
    return null;
  }
};
