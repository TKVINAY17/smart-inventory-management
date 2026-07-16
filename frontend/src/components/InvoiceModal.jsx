
import { generateInvoice } from "../utils/generateInvoice";
function InvoiceModal({
  open,
  onClose,
  sale,
}) {
  if (!open || !sale) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "white",
          width: "650px",
          padding: "30px",
          borderRadius: "12px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#2563eb",
          }}
        >
          SMART INVENTORY MANAGEMENT
        </h1>

        <hr />

        <p>
          <strong>Invoice ID:</strong> INV-{sale.id}
        </p>

        <p>
          <strong>Customer:</strong> Walk-in Customer
        </p>

        <p>
          <strong>Product:</strong> {sale.product_name}
        </p>

        <p>
          <strong>Quantity:</strong> {sale.quantity}
        </p>

        <p>
          <strong>Unit Price:</strong> ₹{sale.unit_price}
        </p>

        <p>
          <strong>Total:</strong> ₹{sale.total_price}
        </p>

        <hr />

        <h2
          style={{
            textAlign: "right",
          }}
        >
          Grand Total : ₹{sale.total_price}
        </h2>

        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    marginTop: "30px",
    gap: "15px",
  }}
>
         <button
  onClick={() => window.print()}
  style={{
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  🖨 Print
</button>

<button
  onClick={() => generateInvoice(sale)}
  style={{
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  📄 Download PDF
</button>

<button
  onClick={onClose}
  style={{
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  Close
</button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceModal;