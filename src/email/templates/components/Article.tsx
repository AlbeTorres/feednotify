import { formatDate } from "../../../util/formatDate";
import { truncateText } from "../../../util/truncateText";


type Props = {
  href: string;
  title: string;
  content: string;
  guid: string;
  creator: string;
  categories: string[];
  date: string;
  image?: string | null;
};

export const Article = ({
  guid,
  href,
  title,
  creator,
  categories,
  content,
  image,
  date,
}: Props) => (
  <tr key={guid} style={{ backgroundColor: image ? '#' : '#f9f9f9' }}>
    <td style={{ paddingTop: '16px', paddingBottom: '16px' }}>
      {image && (
        <a
          href={href}
          style={{
            textDecoration: 'none',
            display: 'block',
            marginTop: '8px',
          }}
        >
          <img
            src={image}
            alt="Read more"
            style={{
              width: '25rem',
              height: '14rem',
              verticalAlign: 'middle',
              marginRight: '4px',
            }}
          />
        </a>
      )}
      <a
        href={href}
        style={{
          fontSize: '18px',
          fontWeight: '500',
          color: '#9333ea',
          textDecoration: 'none',
          display: 'block',
          marginBottom: '4px',
        }}
      >
        {title}
      </a>
      <p style={{ fontSize: '10px', color: '#666666', margin: '0 0 8px 0' }}>
        {creator && `By ${creator} • `}
        {formatDate(date)}
        {categories && categories.length > 0 && (
          <span style={{ lineClamp: 2 }}>
            {' '}
            • {truncateText(categories.join(', '))}
          </span>
        )}
      </p>
      <p
        style={{
          margin: '0',
          color: '#444444',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          lineClamp: 2,
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.4', // Ajusta según gusto
          height: '2.8em', // 1.4 * 2 líneas
        }}
      >
        {truncateText(content)}
      </p>
    </td>
  </tr>
);
