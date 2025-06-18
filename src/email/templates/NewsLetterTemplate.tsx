
import { RssFeed, YoutubeFeed, YoutubeVideo } from '../../Interfaces';
import { DividedFeedRss } from './components/DividedFeedRss';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Introduction } from './components/Intoduction';
import { SimpleFeed } from './components/SimpleFeed';
import { YoutubeVideoCard } from './components/YoutubeVideoCard';

interface FeedData {
  rss: RssFeed[];
  youtube: YoutubeFeed[];
}

type Props = {
  userName: string;
  data: FeedData;
};

export function NewsletterTemplate({ userName, data }: Props) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // const featuredFeed = data.rss[0];
  // const { id, name, posts, url, lastRead } = featuredFeed;
  // const rssFeeds = data.rss.filter((feed) => feed.id !== featuredFeed.id);
  const rssFeeds = data.rss;

  return (
    <>
      {/* CSS para mejorar la compatibilidad móvil */}
      <style>{`
        @media only screen and (max-width: 600px) {
          .mobile-column {
            width: 50% !important;
            display: table-cell !important;
          }
          .mobile-full {
            width: 100% !important;
          }
          .mobile-padding {
            padding: 8px !important;
          }
        }
      `}</style>

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
            <Introduction name={userName} />

            {/* RSS Feeds Section */}
            <table width="100%" cellPadding="0" cellSpacing="0" border={0}>
              <tr>
                <td
                  style={{ backgroundColor: 'white', padding: '24px' }}
                  className="mobile-padding"
                >
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

                  {/* <DividedFeedRss
                    id={id}
                    name={name}
                    posts={posts}
                    url={url}
                    lastRead={lastRead}
                    image={featuredFeed.image}
                  /> */}

                  {rssFeeds.map((feed) => {
                    if (
                      feed.posts[0].image ||
                      feed.posts[1].image ||
                      feed.posts[2].image
                    ) {
                      return (
                        <SimpleFeed
                          id={feed.id}
                          name={feed.name}
                          posts={feed.posts}
                          url={feed.url}
                          lastRead={feed.lastRead}
                          image={feed.image}
                        />
                      );
                    }
                    return (
                      <DividedFeedRss
                        id={feed.id}
                        name={feed.name}
                        posts={feed.posts}
                        url={feed.url}
                        lastRead={feed.lastRead}
                        image={feed.image}
                      />
                    );
                  })}

                  {/* {rssFeeds.map((feed) => (
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
                          {feed.image && (
                            <img
                              width="60"
                              height="40"
                              src={feed.image}
                              alt={name}
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                marginRight: '8px',
                              }}
                            />
                          )}
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
                          image={post.image}
                          key={post.guid}
                          {...post}
                          href={post.link}
                          date={post.pubDate}
                        />
                      ))}
                    </table>
                  ))} */}
                </td>
              </tr>
            </table>

            {/* YouTube Videos Section */}
            <table width="100%" cellPadding="0" cellSpacing="0" border={0}>
              <tr>
                <td
                  style={{ backgroundColor: '#f9f9f9', padding: '24px' }}
                  className="mobile-padding"
                >
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
                                      className="mobile-column"
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
    </>
  );
}

export default NewsletterTemplate;
