import prisma from '../../config/prisma';

export const getResetTokenByToken = async (token: string) => {
  try {
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { token },
    });

    return resetToken;
  } catch (error) {
    console.error('Error fetching reset token by token:', error);
    return null;
  }
};
