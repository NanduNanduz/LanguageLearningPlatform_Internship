import React from "react";
import { Link } from "react-router-dom";
import "./CatCard.scss";

function CatCard({ card }) {
  return (
    <Link to={`/courses?cat=${encodeURIComponent(card.title)}`}>
      <div className="catCard">
        <img src={card.img} alt={card.title} />
        <span className="desc">{card.desc}</span>
        <span className="title">{card.title}</span>
      </div>
    </Link>
  );
}

export default CatCard;