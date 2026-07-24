import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const menuItems = [
    {
      path: "/dashboard",
      icon: "🏠",
      label: "Dashboard",
    },
    {
      path: "/products",
      icon: "📦",
      label: "Products",
    },
    {
      path: "/add-product",
      icon: "➕",
      label: "Add Product",
    },
    {
      path: "/sales",
      icon: "🛒",
      label: "Sales",
    },
    {
      path: "/reports",
      icon: "📊",
      label: "Reports",
    },
    {
      path: "/suppliers",
      icon: "🏢",
      label: "Suppliers",
    },



{
  path: "/customers",
  icon: "👥",
  label: "Customers",
},


    {
  path: "/purchase-orders",
  icon: "📦",
  label: "Purchase Orders",
},
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}

      <div className="sidebar-header">
        <div className="logo-icon">📦</div>

        <div>
          <h2 className="logo">Smart Inventory</h2>
          <span className="logo-subtitle">
            Management System
          </span>
        </div>
      </div>

      {/* Navigation */}

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={
              location.pathname === item.path
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >
            <span className="menu-icon">
              {item.icon}
            </span>

            {item.label}
          </Link>
        ))}
      </div>

      {/* Logout */}

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