import { formatDate } from '../../util/arrayDivider';

type Props = {
  href: string;
  title: string;
  content: string;
  guid: string;
  creator: string;
  categories: string[];
  date: string;
};

export const Article = ({
  guid,
  href,
  title,
  creator,
  categories,
  content,
  date,
}: Props) => (
  <tr key={guid}>
    <td style={{ paddingTop: '16px', paddingBottom: '16px' }}>
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
      <p style={{ fontSize: '14px', color: '#666666', margin: '0 0 8px 0' }}>
        {creator && `By ${creator} • `}
        {formatDate(date)}
        {categories && categories.length > 0 && (
          <span> • {categories.join(', ')}</span>
        )}
      </p>
      <p style={{ margin: '0', color: '#444444' }}>{content}</p>
    </td>
  </tr>
);
