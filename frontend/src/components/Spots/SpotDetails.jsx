import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSpotDetails, deleteSpot } from '../../store/spots';
import { fetchSpotReviews, deleteReview } from '../../store/reviews';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import CreateReviewModal from '../Reviews/CreateReviewModal';
import './SpotDetails.css';

function SpotDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { spotId } = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const spotData = useSelector(state => state.spots.singleSpot);
  const spot = spotData?.spot || spotData; // Handle both nested and direct data
  const reviews = useSelector(state => Object.values(state.reviews.spot));
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSpotData = async () => {
      try {
        await dispatch(fetchSpotDetails(spotId));
        await dispatch(fetchSpotReviews(spotId));
        setIsLoaded(true);
      } catch (err) {
        console.error("Error loading spot details:", err);
        setError("Failed to load spot details");
        setIsLoaded(true);
      }
    };
    
    loadSpotData();
  }, [dispatch, spotId]);

  if (!isLoaded) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!spot) return <div>Spot not found</div>;

  const isOwner = sessionUser && sessionUser.id === spot.ownerId;
  const hasReviewed = sessionUser && reviews.some(review => review.userId === sessionUser.id);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this spot?')) {
      await dispatch(deleteSpot(spotId));
      navigate('/');
    }
  };

  const handleEdit = () => {
    navigate(`/spots/${spotId}/edit`);
  };

  return (
    <div className="spot-details">
      <h1>{spot.name}</h1>
      <div className="spot-location">
        {spot.city}, {spot.state}, {spot.country}
      </div>

      <div className="spot-info-container">
        <div className="spot-description">
          {/* If Owner exists, show the host info */}
          {spot.Owner && (
            <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
          )}
          <p>{spot.description}</p>
        </div>

        <div className="spot-booking">
          <div className="price-rating">
            <div className="price">
              <span className="amount">${Number(spot.price).toFixed(2)}</span> night
            </div>
            <div className="rating">
              <i className="fas fa-star"></i>
              {spot.avgRating ? Number(spot.avgRating).toFixed(1) : 'New'} · 
              {spot.numReviews || 0} {(spot.numReviews || 0) === 1 ? 'review' : 'reviews'}
            </div>
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="owner-actions">
          <button onClick={handleEdit} className="edit-button">Edit Spot</button>
          <button onClick={handleDelete} className="delete-button">Delete Spot</button>
        </div>
      )}

      <div className="reviews-section">
        <h2>Reviews</h2>
        <div className="reviews-header">
          <div className="rating-summary">
            <i className="fas fa-star"></i>
            {spot.avgRating ? Number(spot.avgRating).toFixed(1) : 'New'} · 
            {spot.numReviews || 0} {(spot.numReviews || 0) === 1 ? 'review' : 'reviews'}
          </div>
          
          {sessionUser && !isOwner && !hasReviewed && (
            <OpenModalButton 
              buttonText="Write a Review"
              modalComponent={<CreateReviewModal spotId={spotId} />}
            />
          )}
        </div>

        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <h3>{review.User?.firstName}</h3>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p>{review.review}</p>
              {sessionUser?.id === review.userId && (
                <button 
                  onClick={() => dispatch(deleteReview(review.id))}
                  className="delete-review"
                >
                  Delete Review
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SpotDetails;