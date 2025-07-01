import { createMailTransporter } from '../createMail.transporter';

export const sendTwoFactorTokenMail = (
  email: string,
  token: string,
  name: string
) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: '"Albe de financeApp", <financeApp-pi.vercel.app>',
    to: email,
    subject: 'This is your two factor autentication token',
    html: `<p>Hello ${name}, This is your two factor autentication token, please don't share it with anyone</p>
    <p>${token}<p/>`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Two factor autentication token Email sent');
    }
  });
};
