import ProductCodes from "../components/ProductCodes";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [restockProduct, setRestockProduct] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const importProducts = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/import-products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Products imported successfully!");

      fetchProducts();

      event.target.value = "";
    } catch (error) {
      console.error(error);
      alert("Import failed.");
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);

      alert("✅ Product deleted successfully!");

      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  };

  const filteredProducts = products.filter((product) =>
    (product.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleRestock = (product) => {
    setRestockProduct(product);
    setRestockQuantity("");
  };

  const generateQRCode = (productId) => {
  window.open(
    `http://127.0.0.1:8000/products/${productId}/qrcode`,
    "_blank"
  );
};

  const updateStock = async () => {
    const qty = Number(restockQuantity);

    if (!restockQuantity || isNaN(qty) || qty <= 0) {
      alert("Please enter a valid quantity greater than 0.");
      return;
    }

    try {
      await api.put(
        `/products/${restockProduct.id}/restock`,
        null,
        {
          params: {
            quantity: qty,
          },
        }
      );

      alert("✅ Stock Updated!");

      setRestockProduct(null);

      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to update stock.");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Hover + responsive styles (can't be done with inline style objects) */}
      <style>{`
        .product-row {
          transition: background-color 0.15s ease, transform 0.1s ease;
        }
        .product-row:hover {
          background-color: #334155;
        }
        .toolbar {
          flex-wrap: wrap;
        }
        @media (max-width: 900px) {
          .toolbar {
            flex-direction: column;
            align-items: stretch !important;
          }
          .toolbar input[type="text"] {
            width: 100% !important;
          }
          .toolbar-actions {
            justify-content: flex-end;
            flex-wrap: wrap;
          }
        }

        .btn {
          border: none;
          cursor: pointer;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: transform 0.12s ease, box-shadow 0.12s ease, opacity 0.12s ease;
        }
        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        }
        .btn:active {
          transform: translateY(0);
          box-shadow: none;
        }

        .btn-pill {
          padding: 12px 22px;
          border-radius: 999px;
          color: white;
        }
        .btn-export { background: #2563eb; }
        .btn-export:hover { background: #1d4ed8; }
        .btn-import { background: #f59e0b; }
        .btn-import:hover { background: #d97706; }
        .btn-add { background: #16a34a; }
        .btn-add:hover { background: #15803d; }

        .actions-cell {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: stretch;
          min-width: 130px;
        }
        .actions-row {
          display: flex;
          gap: 8px;
        }

        .btn-sm {
          padding: 8px 14px;
          border-radius: 8px;
          color: white;
          font-size: 14px;
          flex: 1;
        }
        .btn-edit-sm { background: #2563eb; }
        .btn-edit-sm:hover { background: #1d4ed8; }
        .btn-delete-sm { background: #dc2626; }
        .btn-delete-sm:hover { background: #b91c1c; }
        .btn-restock-sm { background: #16a34a; width: 100%; }
        .btn-restock-sm:hover { background: #15803d; }

        .btn-modal {
          padding: 10px 22px;
          border-radius: 8px;
          color: white;
        }
        .btn-modal-confirm { background: #16a34a; }
        .btn-modal-confirm:hover { background: #15803d; }
        .btn-modal-cancel { background: #dc2626; }
        .btn-modal-cancel:hover { background: #b91c1c; }
      `}</style>

      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "30px" }}>
          <h1
            style={{
              textAlign: "center",
              color: "white",
              fontSize: "60px",
              marginBottom: "30px",
            }}
          >
            📦 Products
          </h1>

          {/* Search + Buttons */}

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
              placeholder="🔍 Search products..."
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

            <div className="toolbar-actions" style={{ display: "flex", gap: "15px" }}>
              <input
                type="file"
                accept=".xlsx"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={importProducts}
              />

              <button
                className="btn btn-pill btn-export"
                onClick={() =>
                  window.open(
                    "http://127.0.0.1:8000/export-products",
                    "_blank"
                  )
                }
              >
                📤 Export Excel
              </button>

              <button
                className="btn btn-pill btn-import"
                onClick={() => fileInputRef.current.click()}
              >
                📥 Import Excel
              </button>

              <button
                className="btn btn-pill btn-add"
                onClick={() => navigate("/add-product")}
              >
                ➕ Add Product
              </button>
            </div>
          </div>

          {/* Product Table */}

          <div
            style={{
              background: "#1e293b",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.35)",
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
                    background: "#2563eb",
                    color: "white",
                  }}
                >
                  <th style={{ padding: "14px" }}>ID</th>
                  <th style={{ padding: "14px" }}>Image</th>
                  <th style={{ padding: "14px" }}>Name</th>
                  <th style={{ padding: "14px" }}>Description</th>
                  <th style={{ padding: "14px" }}>Category</th>
                  <th style={{ padding: "14px" }}>Price</th>
                  <th style={{ padding: "14px" }}>Quantity</th>
                  <th>Status</th>
                  <th style={{ padding: "14px" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="product-row"
                      style={{
                        textAlign: "center",
                        borderBottom: "1px solid #334155",
                        color: "white",
                        background:
                          product.quantity === 0
                            ? "#450a0a"
                            : product.quantity <= 5
                            ? "#4a2c00"
                            : "transparent",
                      }}
                    >
                      <td style={{ padding: "14px" }}>{product.id}</td>

                      <td style={{ padding: "14px" }}>
                        <img
                          src={
                            product.image
                              ? `http://127.0.0.1:8000/uploads/${product.image}`
                              : "https://via.placeholder.com/70x70?text=No+Image"
                          }
                          alt={product.name}
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                        />
                      </td>

                      <td style={{ padding: "14px" }}>{product.name}</td>
                      <td style={{ padding: "14px" }}>{product.description}</td>
                      <td style={{ padding: "14px" }}>{product.category}</td>
                      <td style={{ padding: "14px" }}>₹{product.price}</td>
                      <td style={{ padding: "14px" }}>{product.quantity}</td>

                      <td style={{ padding: "14px" }}>
                        {product.quantity === 0 ? (
                          <span
                            style={{
                              display: "inline-block",
                              minWidth: "120px",
                              padding: "8px 14px",
                              borderRadius: "20px",
                              fontWeight: "bold",
                              whiteSpace: "nowrap",
                              textAlign: "center",
                              background: "#dc2626",
                              color: "white",
                            }}
                          >
                            🔴 Out of Stock
                          </span>
                        ) : product.quantity <= 5 ? (
                          <span
                            style={{
                              display: "inline-block",
                              minWidth: "120px",
                              padding: "8px 14px",
                              borderRadius: "20px",
                              fontWeight: "bold",
                              whiteSpace: "nowrap",
                              textAlign: "center",
                              background: "#f97316",
                              color: "white",
                            }}
                          >
                            🟠 Critical
                          </span>
                        ) : product.quantity <= 10 ? (
                          <span
                            style={{
                              display: "inline-block",
                              minWidth: "120px",
                              padding: "8px 14px",
                              borderRadius: "20px",
                              fontWeight: "bold",
                              whiteSpace: "nowrap",
                              textAlign: "center",
                              background: "#eab308",
                              color: "black",
                            }}
                          >
                            🟡 Low Stock
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-block",
                              minWidth: "120px",
                              padding: "8px 14px",
                              borderRadius: "20px",
                              fontWeight: "bold",
                              whiteSpace: "nowrap",
                              textAlign: "center",
                              background: "#16a34a",
                              color: "white",
                            }}
                          >
                            🟢 In Stock
                          </span>
                        )}
                      </td>

                      <td style={{ padding: "14px" }}>
                        <div className="actions-cell">
                          <div className="actions-row">
                            <button
                              className="btn btn-sm btn-edit-sm"
                              onClick={() => navigate(`/edit-product/${product.id}`)}
                            >
                              ✏️ Edit
                            </button>

                            <button
                              className="btn btn-sm btn-delete-sm"
                              onClick={() => deleteProduct(product.id)}
                            >
                              🗑 Delete
                            </button>

                            <button onClick={() => generateQRCode(product.id)}>
  QR Code
</button>
                          </div>

                          <button
                            className="btn btn-sm btn-restock-sm"
                            onClick={() => handleRestock(product)}
                          >
                            📦 Restock
                          </button>

                          <ProductCodes product={product} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      style={{
                        textAlign: "center",
                        padding: "25px",
                        color: "#666",
                      }}
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* End Product Table */}

          {restockProduct && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.6)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  background: "white",
                  padding: "30px",
                  borderRadius: "15px",
                  width: "400px",
                }}
              >
                <h2>📦 Restock Product</h2>

                <p>
                  <strong>{restockProduct.name}</strong>
                </p>

                <p>Current Stock : {restockProduct.quantity}</p>

                <input
                  type="number"
                  min="1"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "15px",
                    marginBottom: "20px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    className="btn btn-modal btn-modal-confirm"
                    onClick={updateStock}
                  >
                    Update Stock
                  </button>

                  <button
                    className="btn btn-modal btn-modal-cancel"
                    onClick={() => setRestockProduct(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Products;