export const Footer = () =>  <table width="100%" cellPadding="0" cellSpacing="0" border={0}>
<tr>
  <td
    style={{
      backgroundColor: "#333333",
      padding: "24px",
      borderBottomLeftRadius: "8px",
      borderBottomRightRadius: "8px",
      textAlign: "center",
      color: "white",
    }}
  >
    <p style={{ margin: "0 0 16px 0" }}>Thank you for subscribing to our newsletter!</p>
    <p style={{ fontSize: "14px", color: "#bbbbbb", margin: "0 0 8px 0" }}>
      If you have any questions or feedback, please reply to this email.
    </p>
    <table width="100%" cellPadding="0" cellSpacing="0" border={0}>
      <tr>
        <td align="center" style={{ padding: "16px 0" }}>
          <a href="#" style={{ color: "white", textDecoration: "none", margin: "0 8px" }}>
            Twitter
          </a>
          <a href="#" style={{ color: "white", textDecoration: "none", margin: "0 8px" }}>
            LinkedIn
          </a>
          <a href="#" style={{ color: "white", textDecoration: "none", margin: "0 8px" }}>
            Facebook
          </a>
        </td>
      </tr>
    </table>
    <p style={{ fontSize: "12px", color: "#777777", margin: "0" }}>
      To unsubscribe from this newsletter,{" "}
      <a href="#" style={{ color: "#bbbbbb", textDecoration: "underline" }}>
        click here
      </a>
      .
    </p>
  </td>
</tr>
</table>