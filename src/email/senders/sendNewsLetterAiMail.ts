import { createMailTransporter } from '../createMail.transporter';

export const sendNewsLetterAIMail = async (
  email: string,
  feed: string,
  name: string,
  data?: Buffer // Cambié el tipo para ser más específico
) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: '"Albe de financeApp" <financeApp-pi.vercel.app>', // Corregí las comillas
    to: email,
    subject: 'Newsletter - Resumen de Feeds', // Cambié el subject que estaba incorrecto
    html: `
      <h2>Hola ${name}</h2>
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        ${feed}
      </div>
      <p><em>Encuentra el resumen completo en el archivo PDF adjunto.</em></p>
    `,
    // attachments: data
    //   ? [
    //       {
    //         filename: 'newsletter.pdf',
    //         content: data, // Usar directamente el Buffer del PDF
    //         contentType: 'application/pdf',
    //       },
    //     ]
    //   : [],
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending newsletter email:', error);
        reject(error);
      } else {
        console.log('Newsletter Email sent successfully:', info.messageId);
        resolve(info);
      }
    });
  });
};
