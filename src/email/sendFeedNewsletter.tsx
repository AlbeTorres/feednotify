import { render } from '@react-email/render';
import { RssFeed, YoutubeFeed } from '../Interfaces';
import { createMailTransporter } from './createMail.transporter';
import NewsletterTemplate from './NewsLetterTemplate';

export const sendNewsLetterMail = async (
  email: string,
  feed: { rss: RssFeed[]; youtube: YoutubeFeed[] },
  name: string
) => {
  const transporter = createMailTransporter();

  const html = await render(<NewsletterTemplate name={name} data={feed} />);

  const mailOptions = {
    from: '"Albe de financeApp", <financeApp-pi.vercel.app>',
    to: email,
    subject: 'Reset password',
    html: `<!DOCTYPE html>${html}>`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('NewsLetter Email sent');
    }
  });
};
