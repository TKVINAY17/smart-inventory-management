import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../styles/dashboard.css";
import DashboardCharts from "../components/DashboardCharts";
import StatCard from "../components/StatCard";
import LowStockProducts from "../components/LowStockProducts";
import TopSellingProducts from "../components/TopSellingProducts";
import RecentSales from "../components/RecentSales";
import "../styles/dashboardLayout.css";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  const [stats, setStats] = useState({
    totalProducts: 0,
    inventoryValue: 0,
    lowStock: 0,
    totalSales: 0,
    revenue: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchDashboard();
    fetchSales();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard");
      setStats(response.data);
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  const fetchSales = async () => {
    try {
      const response = await api.get("/sales");
      setSales(response.data);
    } catch (error) {
      console.error("Sales Error:", error);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

        <div style={{ padding: "30px" }}>
          <h1
            style={{
              textAlign: "center",
              fontSize: "55px",
              marginBottom: "30px",
              color: "white",
            }}
          >
            Dashboard
          </h1>

          {/* Dashboard Cards */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <StatCard
              icon="📦"
              title="Total Products"
              value={stats.totalProducts}
              color="#2563eb"
            />

            <StatCard
              icon="💰"
              title="Inventory Value"
              value={`₹${stats.inventoryValue.toLocaleString()}`}
              color="#16a34a"
            />

            <StatCard
              icon="⚠️"
              title="Low Stock"
              value={stats.lowStock}
              color="#dc2626"
            />

            <StatCard
              icon="🛒"
              title="Total Sales"
              value={stats.totalSales}
              color="#9333ea"
            />
          </div>

          {/* Dashboard Charts */}

          <DashboardCharts />

          {/* Recent Sales + Low Stock */}

          <div className="dashboard-section two-column-grid">
            <RecentSales />
            <LowStockProducts />
          </div>

          {/* Top Selling Products */}

        <div
  style={{
    marginTop: "30px",
    background: "#1e293b",
    color: "white",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,.25)",
  }}
></div>
          <div
  style={{
    marginTop: "30px",
  }}
>
  <TopSellingProducts />
</div>

          {/* Recent Products */}

          <div
            style={{
              marginTop: "40px",
              background: "#1e293b",
              padding: "20px",
              borderRadius: "15px",
              color: "white",
              boxShadow: "0 5px 15px rgba(0,0,0,.25)",
            }}
          >
            <h2
              style={{
                marginBottom: "20px",
              }}
            >
              📦 Recent Products
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
                        borderBottom: "1px solid #334155",
                      }}
                    >
                      <td style={{ padding: "12px" }}>
                        {product.id}
                      </td>

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
                        padding: "25px",
                      }}
                    >
                      No Products Found
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