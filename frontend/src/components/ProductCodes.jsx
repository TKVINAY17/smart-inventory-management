import { useState } from "react";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";

function ProductCodes({ product }) {
  const [showBarcode, setShowBarcode] = useState(false);
  const [showQR, setShowQR] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowBarcode(true)}
        style={{
          background: "#9333ea",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer",
          marginRight: "8px",
        }}
      >
        📦 Barcode
      </button>

      <button
        onClick={() => setShowQR(true)}
        style={{
          background: "#0ea5e9",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        📱 QR Code
      </button>

      {/* Barcode Modal */}
      {showBarcode && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2>Barcode</h2>

            <Barcode
              value={product.id.toString()}
              width={2}
              height={80}
            />

            <p>{product.name}</p>

            <button onClick={() => setShowBarcode(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQR && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2>QR Code</h2>

            <QRCode
              size={200}
              value={`
Name: ${product.name}
Category: ${product.category}
Price: ₹${product.price}
Quantity: ${product.quantity}
              `}
            />

            <button
              style={{ marginTop: "20px" }}
              onClick={() => setShowQR(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  textAlign: "center",
};

export default ProductCodes;