import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import './Navbar.css';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/login"; // Redirect to login after logout
  };

  return (
    <header className="app-header">
      <div className="container">
        <NavLink to="/" className="logo">My Blog</NavLink>
        <nav className="main-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Trang chủ</NavLink>
          
          {isLoggedIn ? (
            <>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Tài khoản</NavLink>
              <button onClick={handleLogout} className="nav-button logout">Đăng xuất</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Đăng nhập</NavLink>
              <NavLink to="/register" className="nav-button register">Đăng ký</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
