import React, { useEffect } from "react";
import PopupWithForm from "./PopupWithForm";


function AddPlacePopup({ isOpen, onClose, onAddPlace, isLoading }) {
  const[name, setName] = React.useState('');
  const[link, setLink] = React.useState('');

  useEffect(() => {
    setName('')
    setLink('')
  }, [isOpen])

  function handleSubmit(evt) {
    evt.preventDefault();

    onAddPlace({
      name: name,
      link: link,
    })
  }

  function handleChangeName(evt) {
    setName(evt.target.value)
  }

  function handleChangeLink(evt) {
    setLink(evt.target.value)
  }

  return (
    <PopupWithForm
          popupName={"add-place"}
          title={"Новое место"}
          buttonText={isLoading ? "Сохранение..." : "Создать"}
          formId={""}
          formName={"place-form"}
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          children={
            <fieldset className="popup__fieldset">
              <label className="popup__field">
                <input
                  value={name}
                  name="name"
                  type="text"
                  className="popup__input popup__input_el_place-name"
                  placeholder="Название"
                  minLength="2"
                  maxLength="30"
                  required
                  onChange={handleChangeName}
                />
                <span className="popup__input-error card-name-error"></span>
              </label>
              <label className="popup__field">
                <input
                  value={link}
                  name="link"
                  type="url"
                  className="popup__input popup__input_el_place-link"
                  placeholder="Ссылка на картинку"
                  required
                  onChange={handleChangeLink}
                />
                <span className="popup__input-error card-link-error"></span>
              </label>
            </fieldset>
          }
        />
  )
}

export default AddPlacePopup
