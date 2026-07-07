import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/products", {
        ...product,
        price: Number(product.price),
        quantity: Number(product.quantity),
      });

      alert("✅ Product Added Successfully!");

      navigate("/products");

    } catch (error) {
      console.error(error);
      alert("Failed to add product.");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "30px" }}>
          <h1>Add Product</h1>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              maxWidth: "400px",
            }}
          >
            <input
              name="name"
              placeholder="Product Name"
              onChange={handleChange}
            />

            <input
              name="description"
              placeholder="Description"
              onChange={handleChange}
            />

            <input
              name="category"
              placeholder="Category"
              onChange={handleChange}
            />

            <input
              name="price"
              type="number"
              placeholder="Price"
              onChange={handleChange}
            />

            <input
              name="quantity"
              type="number"
              placeholder="Quantity"
              onChange={handleChange}
            />

            <button type="submit">
              Add Product
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;