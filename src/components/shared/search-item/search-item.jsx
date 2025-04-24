import React from "react";
import { Link } from "react-router-dom";
import { Rating } from "@mui/material";
import "./search-item.scss";

const SearchItem = ({ id, image, modelName, brandName, pedalType, averageRating, ratingCount }) => {
    console.log("SearchItem props: ", {id, image, modelName, brandName, pedalType, averageRating});
    return (
        <div className="search-item">
            <Link to={`/pedals/${id}`}>
                <img className="search-item__image" src={image} alt={modelName} />
            </Link>
            <div className="search-item__info">
                <Link to={`/pedals/${id}`}>
                    <h5 className="search-item__model">{modelName}</h5>
                </Link>
                <p className="search-item__brand">{brandName}</p>
                <p className="search-item__type">{pedalType}</p>
                <div className="rating-display">
                    <Rating value={averageRating || 0} precision={0.1} readOnly />
                    <span>({ratingCount || 0})</span>
                </div>
            </div>
        </div>
    );
};

export default SearchItem;
