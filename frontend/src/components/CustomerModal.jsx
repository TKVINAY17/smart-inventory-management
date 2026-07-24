import { useEffect, useState } from "react";
import api from "../services/api";

function CustomerModal({ customer, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    gst_number: "",
  });

  useEffect(() => {
    if (customer) {
      setForm(customer);
    }
  }, [customer]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveCustomer = async () => {
    if (!form.name.trim()) {
      alert("Customer name is required.");
      return;
    }

    try {
      if (customer) {
        await api.put(`/customers/${customer.id}`, form);
        alert("✅ Customer updated successfully!");
      } else {
        await api.post("/customers", form);
        alert("✅ Customer added successfully!");
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to save customer.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          width: "550px",
          background: "white",
          borderRadius: "15px",
          padding: "30px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          {customer ? "✏️ Edit Customer" : "➕ Add Customer"}
        </h2>

        <input
          name="name"
          placeholder="Customer Name"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="gst_number"
          placeholder="GST Number"
          value={form.gst_number}
          onChange={handleChange}
          style={inputStyle}
        />

        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          style={{
            ...inputStyle,
            height: "90px",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={saveCustomer}
            style={{
              background: "#16a34a",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {customer ? "Update Customer" : "Save Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "15px",
  boxSizing: "border-box",
};

export default CustomerModal;