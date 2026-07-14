import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Sales() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
  try {
    const response = await api.get("/products");

    console.log("Products API Response:", response.data);

    setProducts(response.data);

  } catch (error) {
    console.error("API Error:", error);
  }
};

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "30px" }}>
          <h1
            style={{
              color: "white",
              fontSize: "50px",
              marginBottom: "30px",
            }}
          >
            🛒 Sales
          </h1>

          <div
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "12px",
            }}
          >
            <h2 style={{ color: "white" }}>
              Available Products
            </h2>

            <table
              style={{
                width: "100%",
                color: "white",
                marginTop: "20px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#2563eb",
                  }}
                >
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Sell</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    style={{
                      textAlign: "center",
                      borderBottom: "1px solid #444",
                    }}
                  >
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>₹{product.price}</td>
                    <td>{product.quantity}</td>

                    <td>
                      <button
                        style={{
                          background: "#16a34a",
                          color: "white",
                          border: "none",
                          padding: "8px 15px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Sales;