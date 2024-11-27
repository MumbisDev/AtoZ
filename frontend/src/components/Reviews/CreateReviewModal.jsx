import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { createReview } from '../../store/reviews';
import './CreateReviewModal.css';

function CreateReviewModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (rating < 1) {
      setErrors({ rating: 'Please select a star rating' });
      return;
    }
    if (review.length < 10) {
      setErrors({ review: 'Review must be at least 10 characters long' });
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(createReview(spotId, { review, stars: rating }));
      closeModal();
    } catch (error) {
      setErrors({ submit: error.message });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-modal">
      <h2>How was your stay?</h2>
      {errors.submit && <p className="error-message">{errors.submit}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="stars-container">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              className={`star-button ${star <= (hover || rating) ? 'filled' : 'empty'}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              <i className="fas fa-star"></i>
            </button>
          ))}
          <span>Stars</span>
        </div>
        {errors.rating && <p className="error-message">{errors.rating}</p>}

        <textarea
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          disabled={isSubmitting}
        />
        {errors.review && <p className="error-message">{errors.review}</p>}

        <button 
          type="submit" 
          disabled={isSubmitting || review.length < 10 || rating < 1}
          className="submit-review-button"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Your Review'}
        </button>
      </form>
    </div>
  );
}

export default CreateReviewModal;