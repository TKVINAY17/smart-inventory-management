import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
const navigate = useNavigate();
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

    alert("Product deleted successfully!");

    fetchProducts();

  } catch (error) {
    console.error(error);
    alert("Failed to delete product.");
  }
};
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "30px" }}>
          <h1>📦 Products</h1>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
         <thead>
  <tr style={{ background: "#2563eb", color: "white" }}>
    <th>ID</th>
    <th>Name</th>
    <th>Description</th>
    <th>Category</th>
    <th>Price</th>
    <th>Quantity</th>
    <th>Actions</th>
  </tr>
</thead>

            <tbody>
  {products.map((product) => (
    <tr key={product.id} style={{ textAlign: "center" }}>
      <td>{product.id}</td>
      <td>{product.name}</td>
      <td>{product.description}</td>
      <td>{product.category}</td>
      <td>₹{product.price}</td>
      <td>{product.quantity}</td>

      <td>
        <button
  onClick={() => navigate(`/edit-product/${product.id}`)}
  style={{
    background: "#2563eb",
    color: "white",
    marginRight: "10px",
    padding: "5px 10px",
    border: "none",
    cursor: "pointer",
  }}
>
  Edit
</button>

        <button
          style={{
            background: "#dc2626",
            color: "white",
            padding: "5px 10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          
          <button
  onClick={() => deleteProduct(product.id)}
  style={{
    background: "#dc2626",
    color: "white",
    padding: "5px 10px",
    border: "none",
    cursor: "pointer",
  }}
>
  Delete
</button>
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Products;