import { useEffect, useState } from "react";
import api from "../services/api";

function InventoryAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await api.get("/products");

      const lowStock = response.data.filter(
        (product) => product.quantity <= 10
      );

      setAlerts(lowStock);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        background: "#1e293b",
        color: "white",
        borderRadius: "15px",
        padding: "20px",
        boxShadow: "0 5px 15px rgba(0,0,0,.25)",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>
        🔔 Inventory Alerts
      </h2>

      {alerts.length === 0 ? (
        <p style={{ color: "#22c55e" }}>
          ✅ All products are sufficiently stocked.
        </p>
      ) : (
        alerts.map((product) => (
          <div
            key={product.id}
            style={{
              marginBottom: "15px",
              paddingBottom: "12px",
              borderBottom: "1px solid #374151",
            }}
          >
            <strong>{product.name}</strong>

            <div
              style={{
                marginTop: "6px",
                fontSize: "15px",
              }}
            >
              {product.quantity === 0 ? (
                <span style={{ color: "#ef4444" }}>
                  🔴 Out of Stock
                </span>
              ) : product.quantity <= 5 ? (
                <span style={{ color: "#f97316" }}>
                  🟠 Only {product.quantity} left
                </span>
              ) : (
                <span style={{ color: "#facc15" }}>
                  🟡 Low Stock ({product.quantity})
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default InventoryAlerts;