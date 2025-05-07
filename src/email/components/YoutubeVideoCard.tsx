import { YoutubeVideo } from '../../Interfaces';
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
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <tr>
        <td style={{ position: 'relative' }}>
          <div style={{ position: 'relative', height: '160px', width: '100%' }}>
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
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '0',
                    height: '0',
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    borderLeft: '12px solid #9333ea',
                    marginLeft: '4px',
                  }}
                ></div>
              </div>
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
              display: 'block',
              marginBottom: '4px',
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
            }}
          >
            {description}
          </p>
        </td>
      </tr>
    </table>
  </td>
);
