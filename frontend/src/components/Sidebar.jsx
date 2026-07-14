import { Link } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      <h2>📦 Inventory</h2>

      <hr />

      <Link to="/dashboard">🏠 Dashboard</Link>

      <Link to="/products">📦 Products</Link>

      <Link to="/add-product">➕ Add Product</Link>

      <Link to="/sales">🛒 Sales</Link>

    </aside>
  );
}

export default Sidebar;

<Link to="/sales">
  🛒 Sales
</Link>