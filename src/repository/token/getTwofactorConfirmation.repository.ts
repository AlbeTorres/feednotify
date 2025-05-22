import prisma from '../../config/prisma';

export const getTwofactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique(
      {
        where: {
          userId,
        },
      }
    );

    return twoFactorConfirmation;
  } catch (error) {
    console.error('Error fetching two-factor confirmation:', error);
    throw new Error('Error fetching two-factor confirmation');
  }
};
