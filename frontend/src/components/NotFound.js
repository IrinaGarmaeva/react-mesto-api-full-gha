import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound__block">
        <h1 className="notfound__title">Ой!</h1>
        <p className="notfound__subtitle">Страница не найдена</p>
        <Link to='/' className="notfound__button">На Главную</Link>
      </div>
    </div>
  );
}

export default NotFound;
