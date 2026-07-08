import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

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
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "30px" }}>
          <h1 style={{ marginBottom: "20px" }}>📦 Products</h1>

          {/* Search + Add Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "25px",
            }}
          >
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "320px",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "15px",
              }}
            />

            <button
              onClick={() => navigate("/add-product")}
              style={{
                background: "#16a34a",
                color: "white",
                border: "none",
                padding: "12px 22px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ➕ Add Product
            </button>
          </div>

          {/* Product Table */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
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
                  <th style={{ padding: "12px" }}>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      style={{
                        textAlign: "center",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <td style={{ padding: "10px" }}>{product.id}</td>

                      <td>
                        {product.image ? (
                          <img
                            src={`http://127.0.0.1:8000/uploads/${product.image}`}
                            alt={product.name}
                            style={{
                              width: "70px",
                              height: "70px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        ) : (
                          <span>No Image</span>
                        )}
                      </td>

                      <td>{product.name}</td>

                      <td>{product.description}</td>

                      <td>{product.category}</td>

                      <td>₹{product.price}</td>

                      <td>{product.quantity}</td>

                      <td>
                        <button
                          onClick={() =>
                            navigate(`/edit-product/${product.id}`)
                          }
                          style={{
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            padding: "8px 14px",
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
                            padding: "8px 14px",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      style={{
                        textAlign: "center",
                        padding: "20px",
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
        </div>
      </div>
    </div>
  );
}

export default Products;