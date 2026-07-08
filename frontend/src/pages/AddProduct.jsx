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
    image: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageName = "";

      // Upload Image First
      if (selectedImage) {
        const formData = new FormData();

        formData.append("file", selectedImage);

        const uploadResponse = await api.post(
          "/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        imageName = uploadResponse.data.filename;
      }

      // Save Product
      await api.post("/products", {
        ...product,
        image: imageName,
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
          <h1>📦 Add Product</h1>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              maxWidth: "450px",
            }}
          >
            <input
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={handleChange}
            />

            <input
              name="description"
              placeholder="Description"
              value={product.description}
              onChange={handleChange}
            />

            <input
              name="category"
              placeholder="Category"
              value={product.category}
              onChange={handleChange}
            />

            <input
              name="price"
              type="number"
              placeholder="Price"
              value={product.price}
              onChange={handleChange}
            />

            <input
              name="quantity"
              type="number"
              placeholder="Quantity"
              value={product.quantity}
              onChange={handleChange}
            />

            <label>
              <strong>Product Image</strong>
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "180px",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  border: "2px solid #ddd",
                }}
              />
            )}

            <button
              type="submit"
              style={{
                background: "#2563eb",
                color: "white",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;