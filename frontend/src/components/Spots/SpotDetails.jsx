import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSpotDetails } from '../../store/spots';
import { fetchSpotReviews, deleteReview } from '../../store/reviews';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import CreateReviewModal from '../Reviews/CreateReviewModal';
import './SpotDetails.css';

// Move component to separate function declaration
export default function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const spotData = useSelector(state => state.spots.singleSpot);
  const spot = spotData?.spot;
  const reviews = useSelector(state => Object.values(state.reviews.spot));
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const host = spot?.Owner?.user;

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

  return (
    <div className="spot-details">
      <h1>{spot.name}</h1>
      <div className="spot-location">
        {spot.city}, {spot.state}, {spot.country}
      </div>

      <div className="spot-images">
        {spot.previewImage ? (
          <img
            src={spot.previewImage}
            alt={spot.name}
            className="main-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        ) : (
          <div className="no-images">No images available</div>
        )}
      </div>

      <div className="spot-info-container">
        <div className="spot-description">
          <h2 className="host-info">
            {host ? (
              `Hosted by ${host.firstName} ${host.lastName}`
            ) : (
              'Loading host information...'
            )}
          </h2>
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

      <div className="reviews-section">
        <h2>
          <i className="fas fa-star"></i>
          {reviews.length > 0 ? (
            ` ${(reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length).toFixed(1)}`
          ) : ' New'} · {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
        </h2>
        
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