import prisma from '../../config/prisma';

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  } catch (error) {
    console.error('Error fetching verification token by email:', error);
    return null;
  }
};
