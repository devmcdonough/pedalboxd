import React, { useState, useContext, useRef, useEffect } from "react";
import Modal from "react-modal";
import Rating from "@mui/material/Rating";
import { AuthContext } from "../../../context/AuthContext";
import { db, firebase } from "../../../firebase";
import CloseIcon from '@mui/icons-material/Close';
import "./review-modal.scss";

Modal.setAppElement("#root");

const ReviewModal = ({ isOpen, onRequestClose, pedalId, mode, existingReview }) => {
  const { currentUser } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (mode === "edit" && existingReview) {
      setRating(existingReview.Stars);
      setComment(existingReview.Comment_Text);
    } else {
      setRating(0);
      setComment("");
    }
  }, [mode, existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError("Please sign in to leave a review");
      return;
    }
    if (rating === 0) {
      setError("Please leave a rating");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "edit" && existingReview) {
        await db
          .collection("pedals")
          .doc(pedalId)
          .collection("comments")
          .doc(existingReview.id)
          .update({
            Comment_Text: comment,
            Stars: rating,
            Timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
      } else {
        await db
          .collection("pedals")
          .doc(pedalId)
          .collection("comments")
          .add({
            Comment_Text: comment,
            Stars: rating,
            User_ID: currentUser.uid,
            Username: currentUser.displayName,
            Timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
      }
      onRequestClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Error submitting review");
    }
    setSubmitting(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={() => {
        if (closeButtonRef.current) {
          closeButtonRef.current.focus();
        }
      }}
      onRequestClose={onRequestClose}
      contentLabel="Leave a review"
      className="review-modal"
      overlayClassName="review-modal-overlay"
      // We unset react-modal's default inset so our CSS takes over.
      style={{ content: { inset: "unset" } }}
    >
      {/* Header container with fixed height */}
      <div className="review-modal-header">
        <h2>Leave a Review</h2>
        <button
          onClick={onRequestClose}
          className="close-button"
          ref={closeButtonRef}
          aria-label="Close review modal"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="review-modal-content">
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="rating-section">
            <label>Rating:</label>
            <Rating
              name="review-rating"
              value={rating}
              precision={0.5}
              onChange={(event, newValue) => setRating(newValue)}
            />
          </div>
          <div className="comment-section">
            <label>Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave your review here"
              rows={4}
            />
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default ReviewModal;
