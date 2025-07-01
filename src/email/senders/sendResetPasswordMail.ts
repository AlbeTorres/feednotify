import { createMailTransporter } from '../createMail.transporter';

export const sendResetMail = (email: string, token: string, name: string) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: '"Albe de financeApp", <financeApp-pi.vercel.app>',
    to: email,
    subject: 'Reset password',
    html: `<p>Hello ${name}, reset your your password clicking the link below</p>
    <a href=${process.env.NEXT_PUBLIC_WEBSITE}/auth/reset-password?token=${token} >Reset password<a/>`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Reset Email sent');
    }
  });
};
