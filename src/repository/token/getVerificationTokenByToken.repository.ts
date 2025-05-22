import prisma from '../../config/prisma';

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { token },
    });

    return verificationToken;
  } catch (error) {
    console.error('Error fetching verification token by token:', error);
    return null;
  }
};
