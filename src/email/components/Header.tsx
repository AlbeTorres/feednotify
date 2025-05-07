
type Props={
    currentDate: string;
}

export const Header = ({currentDate}:Props) => (
    <table width="100%" cellPadding="0" cellSpacing="0" border={0}>
    <tr>
      <td
        style={{
          background: "linear-gradient(to right, #9333ea, #ec4899)",
          padding: "24px",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "28px", fontWeight: "bold", margin: "0 0 8px 0" }}>Weekly Tech Digest</h1>
        <p style={{ margin: "0", opacity: "0.8" }}>{currentDate}</p>
      </td>
    </tr>
  </table>
)