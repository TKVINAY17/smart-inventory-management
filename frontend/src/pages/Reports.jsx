import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import api from "../services/api";
import { exportReportPDF } from "../utils/exportReportPDF";
import { exportReportExcel } from "../utils/exportReportExcel";

function Reports() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchSales = async () => {
    try {
      const response = await api.get("/sales");
      console.log(response.data);
      setSales(response.data);
      setFilteredSales(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleFilter = () => {
    if (!fromDate || !toDate) {
      alert("Please select both dates.");
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    // Include the whole "to" day
    to.setHours(23, 59, 59, 999);

    const filtered = sales.filter((sale) => {
      // Change this field if your backend uses a different name
      const saleDate = new Date(sale.created_at);

      return saleDate >= from && saleDate <= to;
    });

    setFilteredSales(filtered);
  };

  const totalSales = filteredSales.length;

  const totalRevenue = filteredSales.reduce(
    (sum, sale) => sum + sale.total_price,
    0
  );

  const totalQuantity = filteredSales.reduce(
    (sum, sale) => sum + sale.quantity,
    0
  );

  const averageSale =
    totalSales > 0 ? (totalRevenue / totalSales).toFixed(2) : 0;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "30px" }}>
          <h1 style={{ color: "white", marginBottom: "30px" }}>
            📊 Sales Reports
          </h1>

          <div
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "30px",
              display: "flex",
              gap: "20px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <label style={{ color: "white" }}>📅 From Date</label>
              <br />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{
                  marginTop: "8px",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                }}
              />
            </div>

            <div>
              <label style={{ color: "white" }}>📅 To Date</label>
              <br />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{
                  marginTop: "8px",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                }}
              />
            </div>

            <button
              onClick={handleFilter}
              style={{
                marginTop: "24px",
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              🔍 Filter
            </button>

            <button
              onClick={() => {
                setFromDate("");
                setToDate("");
                setFilteredSales(sales);
              }}
              style={{
                marginTop: "24px",
                background: "#6b7280",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              🔄 Reset
            </button>

            <button
              onClick={() => exportReportPDF(filteredSales)}
              style={{
                marginTop: "24px",
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              📄 Export PDF
            </button>

            <button
              onClick={() => exportReportExcel(filteredSales)}
              style={{
                marginTop: "24px",
                background: "#16a34a",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              📊 Export Excel
            </button>
          </div>

          {/* Summary Cards */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.4fr 1fr 1.4fr",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <StatCard
              icon="🧾"
              title="Total Sales"
              value={totalSales}
              color="#2563eb"
            />

            <StatCard
              icon="💰"
              title="Total Revenue"
              value={`Rs. ${totalRevenue.toLocaleString()}`}
              color="#16a34a"
            />

            <StatCard
              icon="📦"
              title="Products Sold"
              value={totalQuantity}
              color="#9333ea"
            />

            <StatCard
              icon="📈"
              title="Average Sale"
              value={`Rs. ${Math.round(Number(averageSale)).toLocaleString()}`}
              color="#dc2626"
            />
          </div>

          {/* Sales Table */}

          <div
            style={{
              background: "#1e293b",
              color: "white",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ color: "white" }}>Sales History</h2>

              <input
                type="text"
                placeholder="🔍 Search Product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "10px",
                  width: "250px",
                  borderRadius: "8px",
                  border: "none",
                  outline: "none",
                }}
              />
            </div>

            <table
              style={{
                width: "100%",
                marginTop: "20px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ background: "#2563eb" }}>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {filteredSales
                  .filter((sale) =>
                    sale.product_name
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                  .map((sale) => (
                    <tr
                      key={sale.id}
                      style={{
                        textAlign: "center",
                        borderBottom: "1px solid #444",
                      }}
                    >
                      <td>{sale.id}</td>
                      <td>{sale.product_name}</td>
                      <td>{sale.quantity}</td>
                      <td>Rs. {sale.unit_price}</td>
                      <td>Rs. {sale.total_price}</td>
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

export default Reports;