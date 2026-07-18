import "./StatCard.css";

function StatCard({ icon, title, value, color }) {
  return (
    <div className="stat-card">
      <div
        className="stat-icon"
        style={{
          background: `linear-gradient(135deg, ${color}, #ffffff22)`,
        }}
      >
        {icon}
      </div>

      <div className="stat-details">
        <h3>{title}</h3>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

export default StatCard;