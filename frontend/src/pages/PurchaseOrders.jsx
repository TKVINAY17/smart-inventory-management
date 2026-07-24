import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PurchaseOrderModal from "../components/PurchaseOrderModal";
import api from "../services/api";

function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/purchase-orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this Purchase Order?")) return;

    try {
      await api.delete(`/purchase-orders/${id}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const receivePO = async (id) => {
    try {
      await api.post(`/purchase-orders/${id}/receive`);
      alert("Goods received successfully.");
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Failed to receive goods.");
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.po_number.toLowerCase().includes(search.toLowerCase()) ||
    order.supplier_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <h1
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          📦 Purchase Orders
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Search Purchase Orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "350px",
              padding: "12px",
              borderRadius: "10px",
            }}
          />

          <button
            onClick={() => setShowModal(true)}
            style={{
              background: "#16A34A",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            ➕ New Purchase Order
          </button>
        </div>

        <div
          style={{
            background: "#1E293B",
            borderRadius: "20px",
            padding: "25px",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              color: "white",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "linear-gradient(90deg,#2563EB,#7C3AED)",
                }}
              >
                <th style={{ padding: 15 }}>PO Number</th>
                <th>Supplier</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #334155",
                  }}
                >
                  <td style={{ padding: 15 }}>
                    {order.po_number}
                  </td>

                  <td>{order.supplier_name}</td>

                  <td>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        color: "white",
                        background:
                          order.status === "Received"
                            ? "#22C55E"
                            : "#F59E0B",
                        fontWeight: "bold",
                        fontSize: "13px",
                      }}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td>
                    ₹
                    {Number(order.total_amount).toLocaleString()}
                  </td>

                  <td>
                    {order.status !== "Received" && (
                      <button
                        onClick={() => receivePO(order.id)}
                        style={{
                          background: "#2563EB",
                          color: "white",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          marginRight: "8px",
                        }}
                      >
                        📦 Receive
                      </button>
                    )}

                    <button
                      onClick={() => deleteOrder(order.id)}
                      style={{
                        background: "#DC2626",
                        color: "white",
                        border: "none",
                        padding: "8px 15px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No Purchase Orders Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <PurchaseOrderModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={fetchOrders}
        />
      </div>
    </div>
  );
}

export default PurchaseOrders;
