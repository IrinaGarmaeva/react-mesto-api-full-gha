import React, { useState } from "react";
import { Link } from "react-router-dom";


function Register({ onRegister, isLoading }) {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });

  function handleSubmit(evt) {
    evt.preventDefault();
    onRegister(formValue.email, formValue.password);
  }

  function handleChange(evt) {
    const { name, value } = evt.target;

    setFormValue({
      ...formValue,
      [name]: value,
    });
  }

  return (
    <div className="register auth">
      <h2 className="auth__title">Регистрация</h2>
      <form onSubmit={handleSubmit} className="auth__form">
        <fieldset className="auth__fieldset">
          <input
            value={formValue.email}
            onChange={handleChange}
            name="email"
            type="email"
            className="auth__input"
            placeholder="Email"
            required
          ></input>
          <input
            value={formValue.password}
            onChange={handleChange}
            name="password"
            type="password"
            className="auth__input"
            placeholder="Пароль"
            required
          ></input>
        </fieldset>
        <button className="auth__button">{isLoading ? 'Регистрация ... ': 'Зарегистрироваться'}</button>
      </form>
      {/* <p className="auth__login"> */}
        <Link to="/sign-in" className="auth__login">
          Уже зарегистрированы? Войти
        </Link>
      {/* </p> */}
    </div>
  );
}

export default Register;
