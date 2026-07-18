import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    gst_number: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers");
      setSuppliers(res.data);
      setFilteredSuppliers(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load suppliers.");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const filtered = suppliers.filter((supplier) =>
      supplier.company_name.toLowerCase().includes(search.toLowerCase()) ||
      supplier.contact_person.toLowerCase().includes(search.toLowerCase()) ||
      supplier.phone.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredSuppliers(filtered);
  }, [search, suppliers]);

  const openAddModal = () => {
    setEditingSupplier(null);
    setFormData({
      company_name: "",
      contact_person: "",
      email: "",
      phone: "",
      address: "",
      gst_number: "",
    });
    setShowModal(true);
  };

  const openEditModal = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      company_name: supplier.company_name || "",
      contact_person: supplier.contact_person || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
      gst_number: supplier.gst_number || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingSupplier) {
        await api.put(`/suppliers/${editingSupplier.id}`, formData);
      } else {
        await api.post("/suppliers", formData);
      }
      setShowModal(false);
      fetchSuppliers();
    } catch (error) {
      console.error(error);
      alert("Failed to save supplier.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await api.delete(`/suppliers/${id}`);
      fetchSuppliers();
    } catch (error) {
      console.error(error);
      alert("Failed to delete supplier.");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: "30px",
          background:
            "linear-gradient(135deg, #eef2ff 0%, #f4f6f9 45%, #e0e7ff 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            gap: "20px",
          }}
        >
          <h2 style={{ margin: 0, whiteSpace: "nowrap" }}>🏢 Supplier Management</h2>

          <input
            type="text"
            placeholder="Search Supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "280px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          onClick={openAddModal}
          style={{
            background: "linear-gradient(135deg,#0f172a,#1e3a8a,#312e81)",
            color: "white",
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            marginBottom: "20px",
            cursor: "pointer",
          }}
        >
          ➕ Add Supplier
        </button>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "linear-gradient(180deg, #ffffff 0%, #f8faff 100%)",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(30, 58, 138, 0.12)",
          }}
        >
          <thead
            style={{
              background: "#2563eb",
              color: "white",
            }}
          >
            <tr>
              <th style={{ padding: "12px" }}>Company</th>
              <th>Contact</th>
              <th>Phone</th>
              <th>Email</th>
              <th>GST</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSuppliers.map((supplier) => (
              <tr
                key={supplier.id}
                style={{
                  borderBottom: "1px solid #ddd",
                }}
              >
                <td style={{ padding: "12px" }}>{supplier.company_name}</td>
                <td>{supplier.contact_person}</td>
                <td>{supplier.phone}</td>
                <td>{supplier.email}</td>
                <td>{supplier.gst_number}</td>
                <td>{supplier.address}</td>

                <td>
                  <button
                    onClick={() => openEditModal(supplier)}
                    style={{
                      background: "#16a34a",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "5px",
                      marginRight: "8px",
                      cursor: "pointer",
                    }}
                  >
                    ✏ Edit
                  </button>

                  <button
                    onClick={() => handleDelete(supplier.id)}
                    style={{
                      background: "#dc2626",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredSuppliers.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "linear-gradient(160deg, #ffffff 0%, #eef2ff 100%)",
              width: "500px",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 20px 50px rgba(15, 23, 42, 0.35)",
            }}
          >
            <h2>{editingSupplier ? "Edit Supplier" : "Add Supplier"}</h2>

            <input
              name="company_name"
              placeholder="Company Name"
              value={formData.company_name}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              name="contact_person"
              placeholder="Contact Person"
              value={formData.contact_person}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              name="gst_number"
              placeholder="GST Number"
              value={formData.gst_number}
              onChange={handleChange}
              style={inputStyle}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  background: "#6b7280",
                  color: "white",
                  borderRadius: "6px",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  background: "#2563eb",
                  color: "white",
                  borderRadius: "6px",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Suppliers;
