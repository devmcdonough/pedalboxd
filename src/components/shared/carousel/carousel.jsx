import React from "react";
import { useNavigate } from "react-router-dom";
import "./carousel.scss";

const Carousel = ({ title, items, filterKey }) => {
  const navigate = useNavigate();

  const handleClick = (item) => {
    navigate("/search", { state: { [filterKey]: item.name } });
  };

  return (
    <section className="carousel">
      <h2 className="carousel_title">{title}</h2>
      <div className="carousel_container">
        {items.map((item) => (
          <div
            key={item.name}
            className="carousel_item_wrapper"
            onClick={() => handleClick(item)}
          >
            <div className="carousel_item">
              <img
                src={item.image}
                alt={`${item.name} placeholder`}
                className="carousel_item_image"
              />
            </div>
            <div className="carousel_item_text">{item.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Carousel;
