import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import InvoiceModal from "../components/InvoiceModal";

function Sales() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSale, setSelectedSale] = useState(null);
const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load products.");
    }
  };

  const fetchSales = async () => {
    try {
      const response = await api.get("/sales");
      setSales(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSale = async () => {
    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    if (Number(quantity) < 1) {
      alert("Please enter a valid quantity.");
      return;
    }

    try {
      const response = await api.post("/sales", {
  product_id: Number(selectedProduct),
  quantity: Number(quantity),
});

alert("✅ Sale completed successfully!");

setSelectedSale(response.data);
setShowInvoice(true);

      setSelectedProduct("");
      setQuantity(1);

      fetchProducts();
      fetchSales();

    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert("Sale failed.");
      }
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
              marginBottom: "30px",
            }}
          >
            🛒 Sales
          </h1>

          {/* Create Sale */}
          <div
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "12px",
              color: "white",
              maxWidth: "500px",
              marginBottom: "40px",
            }}
          >
            <h2>Create Sale</h2>

            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "15px",
                marginBottom: "15px",
              }}
            >
              <option value="">Select Product</option>

              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (Stock: {product.quantity})
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "20px",
              }}
            />

            <button
              onClick={handleSale}
              style={{
                width: "100%",
                background: "#16a34a",
                color: "white",
                border: "none",
                padding: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              💰 Sell Product
            </button>
          </div>

          {/* Sales History */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <h2 style={{ marginBottom: "20px" }}>
              📋 Sales History
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
                  <th>ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {sales.length > 0 ? (
                  sales.map((sale) => (
                    <tr
                      key={sale.id}
                      style={{
                        textAlign: "center",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <td>{sale.id}</td>
                      <td>{sale.product_name}</td>
                      <td>{sale.quantity}</td>
                      <td>₹{sale.unit_price}</td>
                      <td>₹{sale.total_price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        padding: "20px",
                        textAlign: "center",
                      }}
                    >
                      No sales found.
                    </td>
                  </tr>
                )}
                <InvoiceModal
  open={showInvoice}
  sale={selectedSale}
  onClose={() => setShowInvoice(false)}
/>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Sales;