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
    image: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");

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

        if (selectedProduct.image) {
          setPreview(
            `http://127.0.0.1:8000/uploads/${selectedProduct.image}`
          );
        }
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      let imageName = product.image;

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

      await api.put(`/products/${id}`, {
        ...product,
        image: imageName,
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
          <h1
            style={{
              color: "white",
              marginBottom: "25px",
              fontSize: "40px",
            }}
          >
            ✏️ Edit Product
          </h1>

          <form
            onSubmit={handleUpdate}
            style={{
              background: "#1e293b",
              padding: "30px",
              borderRadius: "12px",
              width: "450px",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <input
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Product Name"
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <input
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Description"
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <input
              name="category"
              value={product.category}
              onChange={handleChange}
              placeholder="Category"
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Price"
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <label
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              Product Image
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
                  border: "2px solid white",
                }}
              />
            )}

            <button
              type="submit"
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              💾 Update Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;