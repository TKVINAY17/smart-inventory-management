import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await api.get("/products");

      const selectedProduct = response.data.find(
        (item) => item.id === Number(id)
      );

      if (selectedProduct) {
        setProduct(selectedProduct);
      }

    } catch (error) {
      console.error(error);
      alert("Failed to load product.");
    }
  };

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/products/${id}`, {
        ...product,
        price: Number(product.price),
        quantity: Number(product.quantity),
      });

      alert("✅ Product Updated Successfully!");

      navigate("/products");

    } catch (error) {
      console.error(error);
      alert("Update Failed.");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "30px" }}>
          <h1>Edit Product</h1>

          <form
            onSubmit={handleUpdate}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              width: "400px",
            }}
          >
            <input
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Product Name"
            />

            <input
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Description"
            />

            <input
              name="category"
              value={product.category}
              onChange={handleChange}
              placeholder="Category"
            />

            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Price"
            />

            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              placeholder="Quantity"
            />

            <button type="submit">
              Update Product
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default EditProduct;