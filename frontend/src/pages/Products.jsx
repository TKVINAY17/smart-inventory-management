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
    product.name.toLowerCase().includes(search.toLowerCase())
  );

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
                onClick={() =>
                  window.open(
                    "http://127.0.0.1:8000/export-products",
                    "_blank"
                  )
                }
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "12px 22px",
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                📤 Export Excel
              </button>

              <button
                onClick={() => fileInputRef.current.click()}
                style={{
                  background: "#f59e0b",
                  color: "white",
                  border: "none",
                  padding: "12px 22px",
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                📥 Import Excel
              </button>

              <button
                onClick={() => navigate("/add-product")}
                style={{
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  padding: "12px 22px",
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
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
                        <button
                          onClick={() => navigate(`/edit-product/${product.id}`)}
                          style={{
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            marginRight: "8px",
                            cursor: "pointer",
                          }}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() => deleteProduct(product.id)}
                          style={{
                            background: "#dc2626",
                            color: "white",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            marginRight: "8px",
                            cursor: "pointer",
                          }}
                        >
                          🗑 Delete
                        </button>

                        <ProductCodes product={product} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
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
        </div>
      </div>
    </div>
  );
}
export default Products;
