import React from "react";

function PopupWithForm({
  popupName,
  title,
  children,
  buttonText,
  formId,
  formName,
  isOpen,
  onClose,
  onSubmit,
  resetForm,
}) {

  function handleClosePopup() {
    onClose();
    if(resetForm) {
      resetForm();
    }
  }

  return (
    <div
      className={`popup popup_type_${popupName} ${
        isOpen ? `popup_opened` : ""
      }`}
      onClick={onClose}
    >
      <div className="popup__container" onClick={(evt) => evt.stopPropagation()}>
        <button
          className="popup__close-button"
          type="button"
          onClick={handleClosePopup}
        ></button>
        <h2 className="popup__title">{title}</h2>
        <form
          action="URL"
          className="popup__form"
          id={formId}
          name={formName}
          noValidate
          onSubmit={onSubmit}
        >
          {children}
          <button className="popup__button" type="submit">
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
