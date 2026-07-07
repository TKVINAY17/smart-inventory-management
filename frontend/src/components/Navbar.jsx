import "../styles/navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>Smart Inventory Management</h2>

      <div className="navbar-right">
        <span className="user">👤 Vinay</span>
      </div>
    </nav>
  );
}

export default Navbar;