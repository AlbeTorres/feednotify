import {
  Body,
  Container,
  Heading,
  Html,
  Link,
  Section,
  Text,
} from '@react-email/components';
import { RssFeed, YoutubeFeed } from '../Interfaces';

type Props = {
  name: string;
  feeds: { rss: RssFeed[]; youtube: YoutubeFeed[] };
};

export const NewsletterTemplate = ({ name, feeds }: Props) => (
  <Html>
    <Body>
      <Container>
        <Heading>Hello {name}, here’s your update!</Heading>
        {feeds.rss.map((feed) => (
          <Section key={feed.id}>
            <Heading as="h2">{feed.name}</Heading>
            {feed.posts.map((item, i) => (
              <div key={i}>
                <Link href={item.link}>
                  <strong>{item.title}</strong>
                </Link>
                <Text>{item.content.slice(0, 200)}...</Text>
                <Text>
                  <small>{new Date(item.guid).toLocaleDateString()}</small>
                </Text>
              </div>
            ))}
          </Section>
        ))}
        {feeds.youtube.map((feed) => (
          <Section key={feed.id}>
            <Heading as="h2">{feed.name}</Heading>
            {feed.videos.map((item, i) => (
              <div key={i}>
                <Link href={item.link}>
                  <strong>{item.title}</strong>
                </Link>
                <Text>{item.description.slice(0, 200)}...</Text>
                <Text>
                  <small>
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </small>
                </Text>
              </div>
            ))}
          </Section>
        ))}
      </Container>
    </Body>
  </Html>
);
