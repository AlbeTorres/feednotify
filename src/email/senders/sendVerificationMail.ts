import { createMailTransporter } from '../createMail.transporter';

export const sendVerificationMail = (
  email: string,
  token: string,
  name: string
) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: '"Albe de financeApp", <financeApp-pi.vercel.app>',
    to: email,
    subject: 'Confirm your email',
    html: `<p>Hello ${name}, verify your account clicking the link below</p>
    <a href=${process.env.NEXT_PUBLIC_WEBSITE}/auth/new-verification?token=${token} >Verify your account<a/>`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Verification Email sent');
    }
  });
};
