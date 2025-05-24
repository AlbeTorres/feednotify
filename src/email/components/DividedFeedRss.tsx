import { Post, RssFeed } from '../../interfaces';
import { formatDate } from '../../util/arrayDivider';

export const DividedFeedRss = ({ id, name, posts }: RssFeed) => {
  return (
    <table
      key={id}
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      border={0}
      style={{ marginBottom: '2rem' }}
    >
      <tr>
        <td
          style={{ paddingBottom: '.8rem', borderBottom: '1px solid #e5e5e5' }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0' }}>
            {name}
          </h3>
        </td>
      </tr>

      {posts
        .reduce((rows, post, index) => {
          if (index % 2 === 0) rows.push([post]);
          else rows[rows.length - 1].push(post);
          return rows;
        }, [] as Post[][])
        .map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {row.map((post, index) => (
              <td
                key={index}
                style={{
                  padding: '.5rem .2rem',
                  verticalAlign: 'top', // 👈 asegura que los contenidos estén alineados al tope
                }}
              >
                <a
                  href={post.link}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                  }}
                >
                  <table
                    style={{
                      width: '100%',
                    }}
                  >
                    <tr>
                      {post.image && (
                        <td>
                          <img
                            src="https://placehold.co/400"
                            alt=""
                            width={40}
                          />
                        </td>
                      )}

                      <td>
                        <tr>
                          <td colSpan={2}>
                            <h4
                              style={{
                                textAlign: 'left',
                                margin: '0 0 8px 0',
                                fontSize: '.9rem',
                                fontWeight: '500',
                                color: '#9333ea',
                              }}
                            >
                              {post.title}
                            </h4>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              fontSize: '.65rem',
                              color: '#777',

                              whiteSpace: 'nowrap',
                            }}
                          >
                            🗓 {formatDate(post.pubDate)}
                          </td>
                          <td
                            style={{
                              fontSize: '.65rem',
                              color: '#777',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            👤 {post.creator}
                          </td>
                        </tr>
                      </td>
                    </tr>
                  </table>
                </a>
              </td>
            ))}
            {row.length === 1 && (
              <td
                style={{
                  padding: '16px 8px',
                  width: '50%',
                  verticalAlign: 'top',
                }}
              ></td>
            )}
          </tr>
        ))}
    </table>
  );
};
