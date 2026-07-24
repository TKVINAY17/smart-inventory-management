import { useEffect, useState } from "react";
import api from "../services/api";

function PurchaseOrderModal({ open, onClose, onSuccess }) {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [supplier, setSupplier] = useState("");
  const [items, setItems] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (open) {
      fetchSuppliers();
      fetchProducts();
    }
  }, [open]);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addItem = () => {
    if (!selectedProduct) {
      alert("Select a product.");
      return;
    }

    const product = products.find(
      (p) => p.id === Number(selectedProduct)
    );

    if (!product) return;

    setItems([
      ...items,
      {
        product_id: product.id,
        product_name: product.name,
        quantity: Number(quantity),
        unit_price: product.price,
      },
    ]);

    setSelectedProduct("");
    setQuantity(1);
  };

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );

  const savePurchaseOrder = async () => {
    if (!supplier) {
      alert("Select a supplier.");
      return;
    }

    if (items.length === 0) {
      alert("Add at least one product.");
      return;
    }

    const supplierData = suppliers.find(
      (s) => s.id === Number(supplier)
    );

    try {
      await api.post("/purchase-orders", {
        supplier_id: supplierData.id,
        supplier_name: supplierData.company_name,
        items,
      });

      alert("✅ Purchase Order Created");

      onSuccess();
      onClose();

      setItems([]);
      setSupplier("");
    } catch (err) {
      console.error(err);
      alert("Failed to create Purchase Order");
    }
  };

  if (!open) return null;

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
          width: "700px",
          background: "#1E293B",
          color: "white",
          borderRadius: "20px",
          padding: "30px",
        }}
      >
        <h2 style={{ marginBottom: 25 }}>
          📦 Create Purchase Order
        </h2>

        <select
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 20,
          }}
        >
          <option value="">Select Supplier</option>

          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.company_name}
            </option>
          ))}
        </select>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            style={{
              flex: 1,
              padding: 12,
            }}
          >
            <option value="">Select Product</option>

            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{
              width: "120px",
              padding: 12,
            }}
          />

          <button
            onClick={addItem}
            style={{
              background: "#16A34A",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>

        <table
          style={{
            width: "100%",
            color: "white",
          }}
        >
          <thead>
            <tr>
              <th align="left">Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.product_name}</td>

                <td align="center">
                  {item.quantity}
                </td>

                <td align="center">
                  ₹{item.unit_price}
                </td>

                <td align="center">
                  ₹{item.quantity * item.unit_price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2
          style={{
            marginTop: 25,
          }}
        >
          Total : ₹{total}
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 20,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "#DC2626",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={savePurchaseOrder}
            style={{
              background: "#16A34A",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Save Purchase Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default PurchaseOrderModal;