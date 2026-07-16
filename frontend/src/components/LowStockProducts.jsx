import { useEffect, useState } from "react";
import api from "../services/api";

function LowStockProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");

      const lowStock = response.data.filter(
        (product) => product.quantity < 10
      );

      setProducts(lowStock);
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
        height: "100%",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>
        ⚠ Low Stock Products
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
              background: "#dc2626",
            }}
          >
            <th style={{ padding: "10px" }}>Product</th>
            <th>Stock</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr
                key={product.id}
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid #444",
                }}
              >
                <td style={{ padding: "10px" }}>
                  {product.name}
                </td>

                <td
                  style={{
                    color:
                      product.quantity === 0
                        ? "#ef4444"
                        : "#facc15",
                    fontWeight: "bold",
                  }}
                >
                  {product.quantity}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="2"
                style={{
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                No Low Stock Products 🎉
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LowStockProducts;