import React from "react";
import successImage from "../images/successRegistration.png";
import failImage from "../images/failRegistration.png";

function InfoTooltip({ isRegister, onClose, isOpen }) {
  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`} onClick={onClose}>
      <div className="popup__register-container">
        <button
          className="popup__close-button"
          type="button"
          onClick={onClose}
        ></button>
        <img
          src={isRegister ? successImage : failImage}
          className="popup__register-image"
          alt="картинка регистрации"
        />
        <h2 className="popup__text">
          {isRegister
            ? "Вы успешно зарегистрировались!"
            : "Что-то пошло не так! Попробуйте ещё раз."
            }
        </h2>
      </div>
    </div>
  );
}

export default InfoTooltip;
