import { useEffect, useState } from "react";
import api from "../services/api";

function RecentSales() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await api.get("/sales");
      setSales(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        background: "#1e293b",
        padding: "20px",
        borderRadius: "15px",
        color: "white",
        boxShadow: "0 5px 15px rgba(0,0,0,.25)",
        height: "100%",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>
        🛒 Recent Sales
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#2563eb",
            }}
          >
            <th style={{ padding: "10px" }}>Product</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {sales.length > 0 ? (
            sales.slice(0, 5).map((sale) => (
              <tr
                key={sale.id}
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid #444",
                }}
              >
                <td style={{ padding: "10px" }}>
                  {sale.product_name}
                </td>

                <td>{sale.quantity}</td>

                <td>₹{sale.total_price}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="3"
                style={{
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                No Sales Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RecentSales;