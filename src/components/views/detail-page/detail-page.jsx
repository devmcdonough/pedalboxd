import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { db, firebase } from "../../../firebase";
import ReviewModal from "../review-modal/review-modal";
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CloseIcon from '@mui/icons-material/Close';
import './detail-page.scss';

const DetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);

  const [detail, setDetail] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5001/pedalboxd/us-central1/api";
  const detailUrl = `${API_BASE_URL}/pedals/${id}`;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(detailUrl);
        if (!response.ok) throw new Error("Error fetching details");
        const data = await response.json();
        setDetail(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [detailUrl]);

  useEffect(() => {
    const unsubscribe = db
      .collection("pedals")
      .doc(id)
      .collection("comments")
      .orderBy("Timestamp", "desc")
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(list);
      });
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (!currentUser) return;
    db.collection("users")
      .doc(currentUser.uid)
      .get()
      .then(doc => setIsFavorite(doc.exists && doc.data().favoritePedals?.includes(id)))
      .catch(err => console.error(err));
  }, [currentUser, id]);

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      alert("Please sign in to add favorites");
      return;
    }
    try {
      const userRef = db.collection("users").doc(currentUser.uid);
      if (isFavorite) {
        await userRef.update({ favoritePedals: firebase.firestore.FieldValue.arrayRemove(id) });
      } else {
        await userRef.update({ favoritePedals: firebase.firestore.FieldValue.arrayUnion(id) });
      }
      setIsFavorite(prev => !prev);
    } catch (err) {
      console.error(err);
      alert("Could not update favorites.");
    }
  };

  const handleDeleteReview = async reviewId => {
    try {
      await db.collection("pedals").doc(id).collection("comments").doc(reviewId).delete();
    } catch (err) {
      console.error(err);
      alert("Could not delete review.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  const specs = detail?.Specs || "";
  const isTooLong = specs.length > 300;
  const shortSpecs = isTooLong ? `${specs.slice(0, 300)}…` : specs;

  const userReview = currentUser
    ? reviews.find(r => r.User_ID === currentUser.uid)
    : null;

  return (
    <div className="detail-page">
      <div className="detail-main">
        <div className="detail-image">
          <img
            src={detail?.Image_URL || "https://placehold.co/400"}
            alt={detail?.Model || "product"}
          />
        </div>
        <div className="detail-info">
          <h1 className="product-model">{detail?.Model}</h1>
          <button className="favorites-btn" onClick={handleToggleFavorite}>
            {isFavorite ? (
              <><FavoriteIcon className="heart-icon favorited" /> Remove From Favorites</>
            ) : (
              <><FavoriteBorderIcon className="heart-icon" /> Add To Favorites</>
            )}
          </button>
          <p className="product-brand">{detail?.Brand}</p>
          <p className="product-type">{detail?.Type}</p>
          <div className="product-rating">
            <Rating
              name="read-only"
              value={detail?.averageRating || 0}
              precision={0.1}
              readOnly
            />
            <span>
              {detail?.averageRating?.toFixed(1) || "No Rating"} ({detail?.ratingCount || 0})
            </span>
          </div>

          <div className="product-description">
            <p>{isSpecsModalOpen ? specs : shortSpecs}</p>
            {isTooLong && !isSpecsModalOpen && (
              <button
                className="show-more-btn"
                onClick={() => setIsSpecsModalOpen(true)}
              >
                Show more
              </button>
            )}
          </div>

          {currentUser ? (
            userReview ? (
              <div className="review-controls">
                <button onClick={() => setIsReviewModalOpen(true)}>Edit Review</button>
                <button onClick={() => handleDeleteReview(userReview.id)}>Delete Review</button>
              </div>
            ) : (
              <button onClick={() => setIsReviewModalOpen(true)}>Leave a Review</button>
            )
          ) : (
            <p>Please sign in to leave a review</p>
          )}
        </div>
      </div>

      <div className="product-reviews">
        <h3>Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="review">
              <h4>{review.Username}</h4>
              <Rating name="read-only" value={review.Stars} readOnly precision={0.5} />
              <p>{review.Comment_Text}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet</p>
        )}
      </div>

      {isReviewModalOpen && (
        <ReviewModal
          isOpen
          onRequestClose={() => setIsReviewModalOpen(false)}
          pedalId={id}
          mode={userReview ? "edit" : "create"}
          existingReview={userReview}
        />
      )}

      {isSpecsModalOpen && (
        <div className="filter-modal-overlay" onClick={() => setIsSpecsModalOpen(false)}>
          <div className="filter-modal" onClick={e => e.stopPropagation()}>
            <div className="filter-modal__header">
              <h2>{detail?.Model}</h2>
              <CloseIcon className="close-modal" onClick={() => setIsSpecsModalOpen(false)} />
            </div>
            <pre className="filter-modal__body">{specs}</pre>
            <button className="apply-filters" onClick={() => setIsSpecsModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailPage;
