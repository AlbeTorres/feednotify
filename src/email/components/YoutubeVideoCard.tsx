import { YoutubeVideo } from '../../interfaces';
import { formatDate } from '../../util/arrayDivider';

export const YoutubeVideoCard = ({
  link,
  thumbnail,
  title,
  publishedAt,
  description,
}: YoutubeVideo) => (
  <td key={link} width="50%" style={{ padding: '16px 8px' }}>
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      border={0}
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #ddd',
        // boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <tr>
        <td>
          <div style={{ height: '160px', width: '100%' }}>
            <a href={link} style={{ textDecoration: 'none' }}>
              <img
                src={thumbnail || 'https://via.placeholder.com/300x160'}
                alt={title}
                width="100%"
                height="160"
                style={{
                  objectFit: 'cover',
                  display: 'block',
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px',
                }}
              />
            </a>
          </div>
        </td>
      </tr>
      <tr>
        <td style={{ padding: '16px' }}>
          <a
            href={link}
            style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#9333ea',
              textDecoration: 'none',
              marginBottom: '4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.4', // Ajusta según gusto
              height: '2.8em', // 1.4 * 2 líneas
            }}
          >
            {title}
          </a>
          <p
            style={{ fontSize: '14px', color: '#666666', margin: '0 0 8px 0' }}
          >
            {formatDate(publishedAt)}
          </p>
          <p
            style={{
              fontSize: '14px',
              margin: '0',
              color: '#444444',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.4', // Ajusta según gusto
              height: '2.8em', // 1.4 * 2 líneas
            }}
          >
            {description}
          </p>
        </td>
      </tr>
    </table>
  </td>
);
