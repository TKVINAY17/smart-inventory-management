import "../styles/navbar.css";
import { useEffect, useState } from "react";

function Navbar() {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setDateTime(
        now.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="navbar">

      <div className="navbar-left">
        <h2>📦 Smart Inventory Management</h2>
      </div>

      <div className="navbar-center">
        <input
          type="text"
          placeholder="🔍 Search Products..."
        />
      </div>

      <div className="navbar-right">

        <span className="notification">
          🔔
        </span>

        <span className="datetime">
          📅 {dateTime}
        </span>

        <div className="user-profile">
          <div className="avatar">
            👤
          </div>

          <span>Vinay</span>
        </div>

      </div>

    </nav>
  );
}

export default Navbar;