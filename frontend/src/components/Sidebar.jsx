import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <aside className="sidebar">

      <h2 className="logo">📦 Inventory</h2>

      <hr />

      <Link
        className={location.pathname === "/dashboard" ? "active" : ""}
        to="/dashboard"
      >
        🏠 Dashboard
      </Link>

      <Link
        className={location.pathname === "/products" ? "active" : ""}
        to="/products"
      >
        📦 Products
      </Link>

      <Link
        className={location.pathname === "/add-product" ? "active" : ""}
        to="/add-product"
      >
        ➕ Add Product
      </Link>

      <Link
        className={location.pathname === "/sales" ? "active" : ""}
        to="/sales"
      >
        🛒 Sales
      </Link>

      <button
        className="logout-btn"
        onClick={logout}
      >
        🚪 Logout
      </button>

    </aside>
  );
}

export default Sidebar;