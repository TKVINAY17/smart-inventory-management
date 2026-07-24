import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CustomerModal from "../components/CustomerModal";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const deleteCustomer = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/customers/${id}`);
      alert("✅ Customer deleted successfully!");
      fetchCustomers();
    } catch (error) {
      console.error(error);
      alert("Failed to delete customer.");
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    (customer.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalCustomers = customers.length;

  const totalCities = new Set(customers.map((customer) => customer.city)).size;

  const gstCustomers = customers.filter((customer) => customer.gst_number).length;

  const newCustomers = customers.slice(-5).length;

  return (
    <div style={{ display: "flex" }}>
      <style>{`
        .customer-row{
          transition:background-color .15s ease,transform .1s ease;
        }

        .customer-row:hover{
          background:#334155;
        }

        .toolbar{
          flex-wrap:wrap;
        }

        @media(max-width:900px){

          .toolbar{
            flex-direction:column;
            align-items:stretch!important;
          }

          .toolbar input{
            width:100%!important;
          }

          .toolbar-actions{
            justify-content:flex-end;
            flex-wrap:wrap;
          }

        }

        .btn{
          border:none;
          cursor:pointer;
          font-weight:600;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          transition:.2s;
        }

        .btn:hover{
          transform:translateY(-1px);
        }

        .btn-pill{
          padding:12px 22px;
          border-radius:999px;
          color:white;
        }

        .btn-add{
          background:#16a34a;
        }

        .btn-add:hover{
          background:#15803d;
        }

        .btn-edit{
          background:#2563eb;
          color:white;
          padding:8px 14px;
          border:none;
          border-radius:8px;
          cursor:pointer;
          margin-right:8px;
        }

        .btn-delete{
          background:#dc2626;
          color:white;
          padding:8px 14px;
          border:none;
          border-radius:8px;
          cursor:pointer;
        }

      `}</style>

      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <h1
          style={{
            color: "white",
            fontSize: "42px",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          👥 Customers
        </h1>

        {/* Statistics */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginBottom: "30px",
            padding: "0 15px",
          }}
        >
          <StatCard
            title="Total Customers"
            value={totalCustomers}
            color="#2563eb"
            icon="👥"
          />

          <StatCard
            title="Cities"
            value={totalCities}
            color="#16a34a"
            icon="🏙️"
          />

          <StatCard
            title="GST Customers"
            value={gstCustomers}
            color="#f59e0b"
            icon="🧾"
          />

          <StatCard
            title="New Customers"
            value={newCustomers}
            color="#7c3aed"
            icon="⭐"
          />
        </div>

        {/* Toolbar */}

        <div
          className="toolbar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            gap: "15px",
          }}
        >
          <input
            type="text"
            placeholder="🔍 Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "420px",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />

          <div className="toolbar-actions">
            <button
              className="btn btn-pill btn-add"
              onClick={() => {
                setSelectedCustomer(null);
                setShowModal(true);
              }}
            >
              ➕ Add Customer
            </button>
          </div>
        </div>

        {/* Customer Table */}

        <div
          style={{
            background: "#1E293B",
            borderRadius: "20px",
            padding: "25px",
            boxShadow: "0 20px 40px rgba(0,0,0,.35)",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "linear-gradient(90deg,#2563EB,#7C3AED)",
                  color: "white",
                }}
              >
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>City</th>
                <th>GST</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="customer-row"
                    style={{
                      textAlign: "center",
                      borderBottom: "1px solid #334155",
                      color: "white",
                      background: "#1E293B",
                    }}
                  >
                    <td style={{ padding: "14px" }}>{customer.id}</td>

                    <td style={{ padding: "14px" }}>
                      <strong>{customer.name}</strong>
                    </td>

                    <td style={{ padding: "14px" }}>{customer.phone || "-"}</td>

                    <td style={{ padding: "14px" }}>{customer.email || "-"}</td>

                    <td style={{ padding: "14px" }}>{customer.city || "-"}</td>

                    <td style={{ padding: "14px" }}>
                      {customer.gst_number || "-"}
                    </td>

                    <td style={{ padding: "14px" }}>
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowModal(true);
                        }}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => deleteCustomer(customer.id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      padding: "30px",
                      textAlign: "center",
                      color: "#94A3B8",
                    }}
                  >
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <CustomerModal
            customer={selectedCustomer}
            onClose={() => {
              setShowModal(false);
              setSelectedCustomer(null);
            }}
            onSuccess={() => {
              setShowModal(false);
              setSelectedCustomer(null);
              fetchCustomers();
            }}
          />
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <div
      style={{
        background: "#1E293B",
        borderRadius: "16px",
        padding: "20px",
        color: "white",
        borderLeft: `6px solid ${color}`,
        boxShadow: "0 8px 20px rgba(0,0,0,.25)",
      }}
    >
      <div
        style={{
          fontSize: "32px",
          marginBottom: "10px",
        }}
      >
        {icon}
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: "28px",
        }}
      >
        {value}
      </h2>

      <p
        style={{
          marginTop: "8px",
          color: "#CBD5E1",
        }}
      >
        {title}
      </p>
    </div>
  );
}

export default Customers;