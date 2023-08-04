import React, { useState } from "react";


function Login({ onLogin, isLoading }) {
  const [formValue, setFormValue] = useState({
    email: '',
    password: '',
  })

  function resetForm() {
    setFormValue({
      email: '',
      password: '',
    })
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onLogin(formValue.email, formValue.password);
    resetForm();
  }

  function handleChange(evt) {
    const {name, value} = evt.target;

    setFormValue({
      ...formValue,
      [name]: value
    })
  }

  return (
    <div className="login auth">
      <h2 className="auth__title">Вход</h2>
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
        <button className="auth__button">{isLoading ? 'Вход ...' : 'Войти'}</button>
      </form>
    </div>
  );
}

export default Login;
