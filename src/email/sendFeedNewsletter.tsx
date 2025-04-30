import { render } from '@react-email/render';
import { RssFeed, YoutubeFeed } from '../Interfaces';
import { createMailTransporter } from './createMailTransporter';
import { NewsletterTemplate } from './NewsLetterTemplate';

export const sendNewsLetterMail = (
  email: string,
  feed: { rss: RssFeed[]; youtube: YoutubeFeed[] },
  name: string
) => {
  const transporter = createMailTransporter();

  const html = render(<NewsletterTemplate name={name} feeds={feed} />);

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
