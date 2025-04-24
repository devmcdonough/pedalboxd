import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import "./header.scss";

const Header = () => {
  const { currentUser, signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <header className="header">
      <div className="header_logo">
        <Link to="/">
          <img
            src={process.env.PUBLIC_URL + '/images/Pedalboxd_Logo.svg'}
            alt="Pedalboxd Logo"
            className="header_logo-img"
          />
          Pedalboxd
        </Link>
      </div>

      {/* Normal navigation, visible on larger screens */}
      <nav className="header_nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/search">Search</Link></li>
          {currentUser && <li><Link to="/settings">Settings</Link></li>}
        </ul>
      </nav>

      {/* User info, visible on larger screens */}
      <div className="header_user">
        {currentUser ? (
          <>
            <span>{currentUser.displayName || currentUser.email}</span>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <Link to="/login">Sign In</Link>
        )}
      </div>

      {/* Mobile navigation, visible on small screens */}
      <div className="header_mobile">
        <MenuIcon 
          className="header_mobile_icon" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        />
        {isMobileMenuOpen && (
          <nav className="header_mobile_nav">
            <ul>
              <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
              <li><Link to="/search" onClick={() => setIsMobileMenuOpen(false)}>Search</Link></li>
              {currentUser && (
                <li>
                  <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>Settings</Link>
                </li>
              )}
              <li>
                {currentUser ? (
                  <button onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}>
                    Sign Out
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                )}
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
