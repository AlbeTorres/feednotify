

import { RssFeed } from '../../../Interfaces';
import { Article } from './Article';
export const SimpleFeed = ({ id, image, name, posts }: RssFeed) => {
  return (
    <table
      key={id}
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
          {image && (
            <img
              width="60"
              height="40"
              src={image}
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
            {name}
          </h3>
        </td>
      </tr>

      {posts.map((post) => (
        <Article
          image={post.image}
          key={post.guid}
          {...post}
          href={post.link}
          date={post.pubDate}
        />
      ))}
    </table>
  );
};
