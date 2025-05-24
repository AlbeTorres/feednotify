export const Introduction = ({ name }: { name: string }) => (
  <table width="100%" cellPadding="0" cellSpacing="0" border={0}>
    <tr>
      <td
        style={{
          backgroundColor: 'white',
          padding: '24px',
          borderBottom: '1px solid #e5e5e5',
        }}
      >
        <p style={{ margin: '0 0 16px 0' }}>Hello {name},</p>
        <p style={{ margin: '0 0 16px 0' }}>
          Here's your weekly roundup of the latest news, articles, and videos.
          Stay informed with the most interesting content from your favorite
          sources.
        </p>
      </td>
    </tr>
  </table>
);
