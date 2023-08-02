import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import logoImage from "../images/logo.svg";

function Header({ email, signOut }) {
  const location = useLocation();
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  function handleOpenMenu() {
    setIsMenuOpened((state) => !state);
  }

  function handleSignOut() {
    signOut();
    setIsMenuOpened(false);
  }

  return (
    <header className={`header ${isMenuOpened ? "header_opened" : ""}`}>
      <img src={logoImage} alt="логотип" className="header__logo" />
      {location.pathname === "/" && (
        <>
          <button
            className={`header__nav-button ${
              isMenuOpened ? "header__nav-button_active" : ""
            }`}
            aria-label="Открыть меню"
            onClick={handleOpenMenu}
          />
          <ul className={`header__nav ${isMenuOpened ? 'header__nav_active' : ''}`}>
            <p className="header__email">{email}</p>
            <li className="header__signout-button-container">
              <button
                onClick={handleSignOut}
                className="header__signout-button"
              >
                Выйти
              </button>
            </li>
          </ul>
        </>
      )}
      {location.pathname === "/sign-in" && (
        <Link to="/sign-up" className="header__link">
          Регистрация
        </Link>
      )}
      {location.pathname === "/sign-up" && (
        <Link to="/sign-in" className="header__link">
          Войти
        </Link>
      )}
    </header>
  );
}

export default Header;
