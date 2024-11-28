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
    const spot = useSelector(state => state.spots.singleSpot);
    const reviews = useSelector(state => Object.values(state.reviews.spot));
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const loadSpotData = async () => {
        try {
          const spotResponse = await dispatch(fetchSpotDetails(spotId));
          if (spotResponse) {
            await dispatch(fetchSpotReviews(spotId));
          }
        } catch (err) {
          console.error("Error loading spot details:", err);
          setError("Failed to load spot details");
        } finally {
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

      <div className="spot-images">
        {spot.SpotImages?.map((image, index) => (
          <img 
            key={image.id} 
            src={image.url} 
            alt={`${spot.name} ${index + 1}`}
            className={index === 0 ? 'main-image' : 'secondary-image'}
          />
        ))}
      </div>

      <div className="spot-info-container">
        <div className="spot-description">
          <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
          <p>{spot.description}</p>
        </div>

        <div className="spot-booking">
          <div className="price-rating">
            <div className="price">
              <span className="amount">${spot.price}</span> night
            </div>
            <div className="rating">
              <i className="fas fa-star"></i>
              {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'} · 
              {spot.numReviews} {spot.numReviews === 1 ? 'review' : 'reviews'}
            </div>
          </div>
          {/* Add booking button/form here if implementing bookings */}
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
        {sessionUser && !isOwner && !hasReviewed && (
          <OpenModalButton 
            buttonText="Write a Review"
            modalComponent={<CreateReviewModal spotId={spotId} />}
          />
        )}

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