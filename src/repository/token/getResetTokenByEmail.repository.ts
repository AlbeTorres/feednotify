import prisma from '../../config/prisma';

export const getResetTokenByEmail = async (email: string) => {
  try {
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { email },
    });

    return resetToken;
  } catch (error) {
    console.error('Error fetching reset token by email:', error);
    return null;
  }
};
