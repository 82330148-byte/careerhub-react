import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="site-header">
      <nav className="navbar container">
        <NavLink to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          Career<span>Hub</span>
        </NavLink>
        <button className="menu-button" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">☰</button>
        <div className={`navbar-links ${menuOpen ? "show-menu" : ""}`}>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/jobs" onClick={() => setMenuOpen(false)}>Jobs</NavLink>
          {user && <NavLink to="/saved" onClick={() => setMenuOpen(false)}>Saved</NavLink>}
          {user && <NavLink to="/applications" onClick={() => setMenuOpen(false)}>Applications</NavLink>}
          {user && <NavLink to="/profile" onClick={() => setMenuOpen(false)}>Profile</NavLink>}
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
          {user?.role === "admin" && <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</NavLink>}
          {!user ? (
            <>
              <NavLink to="/login" className="nav-login" onClick={() => setMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" className="nav-register" onClick={() => setMenuOpen(false)}>Register</NavLink>
            </>
          ) : (
            <button className="nav-logout" onClick={handleLogout}>Logout ({user.full_name.split(" ")[0]})</button>
          )}
        </div>
      </nav>
    </header>
  );
}
export default Navbar;
