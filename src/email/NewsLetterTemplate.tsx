import { RssFeed, YoutubeFeed, YoutubeVideo } from '../interfaces';
import { Article } from './components/Article';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Introduction } from './components/Intoduction';
import { YoutubeVideoCard } from './components/YoutubeVideoCard';

interface FeedData {
  rss: RssFeed[];
  youtube: YoutubeFeed[];
}

type Props = {
  name: string;
  data: FeedData;
};

export function NewsletterTemplate({ name, data }: Props) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      border={0}
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        color: '#333333',
      }}
    >
      <tr>
        <td>
          {/* Header */}
          <Header currentDate={currentDate} />

          {/* Introduction */}
          <Introduction name={name} />

          {/* RSS Feeds Section */}
          <table width="100%" cellPadding="0" cellSpacing="0" border={0}>
            <tr>
              <td style={{ backgroundColor: 'white', padding: '24px' }}>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    margin: '0 0 16px 0',
                    color: '#9333ea',
                  }}
                >
                  Latest Articles
                </h2>

                {data.rss.map((feed) => (
                  <table
                    key={feed.id}
                    width="100%"
                    cellPadding="0"
                    cellSpacing="0"
                    border={0}
                    style={{ marginBottom: '32px' }}
                  >
                    <tr>
                      <td
                        style={{
                          paddingBottom: '12px',
                          borderBottom: '1px solid #e5e5e5',
                        }}
                      >
                        <h3
                          style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            margin: '0',
                          }}
                        >
                          {feed.name}
                        </h3>
                      </td>
                    </tr>

                    {feed.posts.map((post) => (
                      <Article
                        key={post.guid}
                        {...post}
                        href={post.link}
                        date={post.pubDate}
                      />
                    ))}
                  </table>
                ))}
              </td>
            </tr>
          </table>

          {/* YouTube Videos Section */}
          <table width="100%" cellPadding="0" cellSpacing="0" border={0}>
            <tr>
              <td style={{ backgroundColor: '#f9f9f9', padding: '24px' }}>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    margin: '0 0 16px 0',
                    color: '#9333ea',
                  }}
                >
                  Featured Videos
                </h2>

                {data.youtube.map((channel) => (
                  <table
                    key={channel.id}
                    width="100%"
                    cellPadding="0"
                    cellSpacing="0"
                    border={0}
                    style={{ marginBottom: '32px' }}
                  >
                    <tr>
                      <td
                        style={{
                          paddingBottom: '12px',
                          borderBottom: '1px solid #e5e5e5',
                        }}
                      >
                        <h3
                          style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            margin: '0',
                          }}
                        >
                          {channel.name}
                        </h3>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <table
                          width="100%"
                          cellPadding="0"
                          cellSpacing="0"
                          border={0}
                        >
                          {/* For each row of videos (2 per row) */}
                          {channel.videos
                            .reduce((rows, video, index) => {
                              if (index % 2 === 0) rows.push([video]);
                              else rows[rows.length - 1].push(video);
                              return rows;
                            }, [] as YoutubeVideo[][])
                            .map((row, rowIndex) => (
                              <tr key={`row-${rowIndex}`}>
                                {row.map((video) => (
                                  <YoutubeVideoCard
                                    key={video.channelId}
                                    {...video}
                                  />
                                ))}
                                {row.length === 1 && (
                                  <td
                                    width="50%"
                                    style={{ padding: '16px 8px' }}
                                  ></td>
                                )}
                              </tr>
                            ))}
                        </table>
                      </td>
                    </tr>
                  </table>
                ))}
              </td>
            </tr>
          </table>

          {/* Footer */}
          <Footer />
        </td>
      </tr>
    </table>
  );
}

export default NewsletterTemplate;
