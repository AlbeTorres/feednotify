import { createMailTransporter } from '../createMail.transporter';

export const sendNewsLetterAIMail = async (
  email: string,
  feed: string,
  name: string
) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: '"Albe de financeApp", <financeApp-pi.vercel.app>',
    to: email,
    subject: 'Reset password',
    html: `<p>Hello ${name}</p>
    <p>${feed}<p/>`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('NewsLetter Email sent');
    }
  });
};
