import { useEffect, useState } from "react";
import api from "../services/api";

function TopSellingProducts() {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await api.get("/sales");

      const sales = response.data;

      const totals = {};

      sales.forEach((sale) => {
        if (!totals[sale.product_name]) {
          totals[sale.product_name] = 0;
        }

        totals[sale.product_name] += sale.quantity;
      });

      const sorted = Object.entries(totals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      setTopProducts(sorted);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        background: "#1e293b",
        color: "white",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 5px 15px rgba(0,0,0,.25)",
      }}
    >
      <h2>🏆 Top Selling Products</h2>

      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#16a34a",
            }}
          >
            <th style={{ padding: "10px" }}>Product</th>
            <th>Sold</th>
          </tr>
        </thead>

        <tbody>
          {topProducts.map(([name, qty]) => (
            <tr
              key={name}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #444",
              }}
            >
              <td style={{ padding: "10px" }}>
                {name}
              </td>

              <td>{qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TopSellingProducts;