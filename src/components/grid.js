import React from "react";
import "../style/grid.css";
import { useNavigate } from "react-router-dom";

export default function Grid(props) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    const cardId = e.target.id || e.target.parentElement.id;
    console.log(cardId);

    navigate(`./${cardId}`);
  };

  return (
    <div className="grid-container">
      <div className="card" id="card 1" onClick={handleClick}>
        <div className="card-icon">Icon 1</div>
        <div className="card-text">Card 1</div>
      </div>

      <div className="card" id="card 2" onClick={handleClick}>
        <div className="card-icon">Icon 2</div>
        <div className="card-text">Card 2</div>
      </div>

      <div className="card" id="card 3" onClick={handleClick}>
        <div className="card-icon">Icon 3</div>
        <div className="card-text">Card 3</div>
      </div>

      <div className="card" id="card 4" onClick={handleClick}>
        <div className="card-icon">Icon 4</div>
        <div className="card-text">Card 4</div>
      </div>

      <div className="card" id="card 5" onClick={handleClick}>
        <div className="card-icon">Icon 5</div>
        <div className="card-text">Card 5</div>
      </div>

      <div className="card" id="card 6" onClick={handleClick}>
        <div className="card-icon">Icon 6</div>
        <div className="card-text">Card 6</div>
      </div>
    </div>
  );
}
