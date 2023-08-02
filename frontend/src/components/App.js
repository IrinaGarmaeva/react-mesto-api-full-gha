import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import api from "../utils/api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmPopup from "./ConfirmPopup";
import Register from "./Register";
import Login from "./Login";
import NotFound from "./NotFound";
import InfoTooltip from "./InfoTooltip";
import { ProtectedRoute } from "./ProtectedRoute";
import * as auth from "../auth";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [deletedCard, setDeletedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn) {
      Promise.all([api.getUserData(), api.getInitialCards()])
        .then(([userData, cards]) => {
          setCurrentUser({
            ...userData,
            name: userData.name,
            about: userData.about,
            avatar: userData.avatar,
          });
          setCards(cards.reverse());
        })
        .catch((error) => console.log(`Error: ${error.status}`));
    }
  }, [isLoggedIn]);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
    setIsLoading(false);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleDeleteButtonClick(card) {
    setIsConfirmPopupOpen(true);
    setDeletedCard(card);
    setIsLoading(false);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    (isLiked ? api.deleteLike(card._id) : api.putLike(card._id))
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((error) => console.log(`Error: ${error.status}`));
  }

  function handleCardDelete(card) {
    setIsLoading(true);
    api
      .deleteCard(card._id)
      .then((res) => {
        setCards((newCardData) =>
          newCardData.filter((c) => c._id !== card._id)
        );
      })
      .then(() => closeAllPopups())
      .catch((error) => console.log(`Error: ${error.status}`));
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmPopupOpen(false);
    setSelectedCard(null);
    setDeletedCard(null);
    setIsLoading(false);
    setIsInfoTooltipOpen(false);
  }

  function handleUpdateUser({ name, about }) {
    setIsLoading(true);
    api
      .editUserData({ newName: name, newAbout: about })
      .then((res) => {
        setCurrentUser({
          ...res,
          name: res.name,
          about: res.about,
        });
      })
      .then(() => closeAllPopups())
      .catch((error) => console.log(`Error: ${error.status}`));
  }

  function handleUpdateAvatar({ avatar }) {
    setIsLoading(true);
    api
      .setUserAvatar({ link: avatar })
      .then((res) => {
        setCurrentUser({
          ...res,
          avatar: res.avatar,
        });
      })
      .then(() => closeAllPopups())
      .catch((error) => console.log(`Error: ${error.status}`));
  }

  function handleAddNewCard({ values, resetForm }) {
    setIsLoading(true);
    api
      .addNewCard({ newName: values.name, newLink: values.link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        resetForm();
        closeAllPopups();
      })
      .catch((error) => console.log(`Error: ${error.status}`));
  }
  function checkToken() {
      auth
        .getToken()
        .then((res) => {
          if (!res) {
            return;
          }
          if (res.status !== 401) {
            setIsLoggedIn(true);
            setUserEmail(res.email);
            navigate(location.pathname);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoggedIn(false);
        });
    // }
  }

  useEffect(() => {
    checkToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleRegister(email, password) {
    setIsLoading(true);
    auth
      .register(email, password)
      .then(() => {
        setIsInfoTooltipOpen(true);
        setIsRegister(true);
        navigate("/sign-in", { replace: true });
      })
      .catch((err) => {
        console.log(err);
        setIsInfoTooltipOpen(true);
        setIsRegister(false);
      });
  }

  function handleLogin(email, password) {
    if (!email || !password) {
      return;
    }
    setIsLoading(true);
    auth
      .authorize(email, password)
      .then((data) => {
        setIsLoggedIn(true);
        setUserEmail(email);
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function signOut() {
    auth.logOut()
    .then(() => {
      setUserEmail("");
      setIsLoggedIn(false);
      navigate("/sign-in", { replace: true });
    })
    .catch((err) => console.log(err))
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <div className="page">
          <Header email={userEmail} signOut={signOut} />
          <Routes>
            <Route
              path="/sign-up"
              element={
                isLoggedIn ? (
                  <Navigate to="/" replace />
                ) : (
                  <Register onRegister={handleRegister} isLoading={isLoading}/>
                )
              }
            />
            <Route
              path="/sign-in"
              element={
                isLoggedIn ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login onLogin={handleLogin} isLoading={isLoading}/>
                )
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute
                  element={
                    <>
                      <Main
                        cards={cards}
                        onEditProfile={handleEditProfileClick}
                        onAddPlace={handleAddPlaceClick}
                        onEditAvatar={handleEditAvatarClick}
                        onCardClick={handleCardClick}
                        onCardLike={handleCardLike}
                        onDeleteButtonClick={handleDeleteButtonClick}
                      />
                      <Footer />
                    </>
                  }
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route path='/*' element={<NotFound />} />
          </Routes>
          <InfoTooltip
            onClose={closeAllPopups}
            isRegister={isRegister}
            isOpen={isInfoTooltipOpen}
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddNewCard}
            isLoading={isLoading}
          />
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          <ConfirmPopup
            isOpen={isConfirmPopupOpen}
            onClose={closeAllPopups}
            onDeleteCard={handleCardDelete}
            card={deletedCard}
            isLoading={isLoading}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            isLoading={isLoading}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
