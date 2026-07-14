import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../styles/dashboard.css";
import DashboardCharts from "../components/DashboardCharts";

function Dashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Dashboard Statistics
  const totalProducts = products.length;

  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const lowStock = products.filter(
    (product) => product.quantity < 10
  ).length;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
     <div className="dashboard-content">
        {/* Navbar */}
        <Navbar />

        {/* Dashboard Body */}
        <div style={{ padding: "30px" }}>
          <h1
            style={{
              textAlign: "center",
              fontSize: "60px",
              marginBottom: "30px",
            }}
          >
            Dashboard
          </h1>

          {/* Dashboard Cards */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Total Products */}
            <div
              style={{
                background: "#2563eb",
                color: "white",
                padding: "25px",
                borderRadius: "12px",
                width: "250px",
                textAlign: "center",
              }}
            >
              <h2>📦</h2>
              <h3>Total Products</h3>
              <h1>{totalProducts}</h1>
            </div>

            {/* Inventory Value */}
            <div
              style={{
                background: "#16a34a",
                color: "white",
                padding: "25px",
                borderRadius: "12px",
                width: "250px",
                textAlign: "center",
              }}
            >
              <h2>💰</h2>
              <h3>Inventory Value</h3>
              <h1>₹{inventoryValue.toLocaleString()}</h1>
            </div>

            {/* Low Stock */}
            <div
              style={{
                background: "#dc2626",
                color: "white",
                padding: "25px",
                borderRadius: "12px",
                width: "250px",
                textAlign: "center",
              }}
            >
              <h2>⚠️</h2>
              <h3>Low Stock</h3>
              <h1>{lowStock}</h1>
            </div>
          </div>

<DashboardCharts />
          {/* Recent Products */}
          <div
            style={{
              marginTop: "50px",
              background: "white",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              Recent Products
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
                    color: "white",
                  }}
                >
                  <th style={{ padding: "12px" }}>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>

              <tbody>
                {products.length > 0 ? (
                  products.slice(0, 5).map((product) => (
                    <tr
                      key={product.id}
                      style={{
                        textAlign: "center",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <td style={{ padding: "10px" }}>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>{product.category}</td>
                      <td>₹{product.price}</td>
                      <td>{product.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                      }}
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;