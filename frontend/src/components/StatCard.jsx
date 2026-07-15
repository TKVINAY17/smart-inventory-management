function StatCard({ icon, title, value, color }) {
  return (
    <div
      style={{
        background: color,
        color: "white",
        borderRadius: "16px",
        padding: "25px",
       
        flex: "1",
        textAlign: "center",
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
      }}
    >
      <h1 style={{ fontSize: "42px", margin: 0 }}>
        {icon}
      </h1>

      <h3 style={{ marginTop: "15px" }}>
        {title}
      </h3>
<h1
  style={{
    marginTop: "15px",
    fontSize: "38px",
    lineHeight: "1.2",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }}
>
  {value}
</h1>
    </div>
  );
}   

export default StatCard;