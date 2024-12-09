import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSpotDetails } from '../../store/spots';
import { fetchSpotReviews, deleteReview } from '../../store/reviews';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import CreateReviewModal from '../Reviews/CreateReviewModal';
import './SpotDetails.css';

export default function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const spotData = useSelector(state => state.spots.singleSpot);
  const spot = spotData?.spot;
  const reviews = useSelector(state => Object.values(state.reviews.spot));
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [hostInfo, setHostInfo] = useState(null);

  useEffect(() => {
    setIsLoaded(false);
    setError(null);
    setHostInfo(null); 

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

  useEffect(() => {
    const fetchOwnerInfo = async () => {
      if (spot?.ownerId) {
        try {
          const response = await fetch(`/api/users/${spot.ownerId}`);
          if (response.ok) {
            const userData = await response.json();
            setHostInfo(userData);
          }
        } catch (err) {
          console.error("Error fetching host info:", err);
        }
      }
    };

    fetchOwnerInfo();
  }, [spot?.ownerId]); 
  if (!isLoaded) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!spot) return <div>Spot not found</div>;


  const isOwner = sessionUser && sessionUser.id === spot.ownerId;
  const hasReviewed = sessionUser && reviews.some(review => review.userId === sessionUser.id);

  const getHostInfo = () => {
    if (spot.Owner?.user?.firstName) {
      return `${spot.Owner.user.firstName} ${spot.Owner.user.lastName}`;
    }
    if (hostInfo?.firstName) {
      return `${hostInfo.firstName} ${hostInfo.lastName}`;
    }
    return 'Loading host information...';
  };
  
  console.log('Reviews length:', reviews.length);
console.log('Session user:', sessionUser);
console.log('Is owner:', isOwner);

const getRatingText = () => {
  if (reviews.length > 0) {
    const avgRating = reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length;
    return `${avgRating.toFixed(1)} · ${reviews.length} ${reviews.length === 1 ? 'Review' : 'Reviews'}`;
  } else {
    if (sessionUser && !isOwner) {
      return 'Be the first to post a review!';
    }
    return 'New';
  }
};

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
            Hosted by {getHostInfo()}
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
              {reviews.length > 0 ? (
            ` ${(reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length).toFixed(1)}`
          ) : ' New'} · {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </div>
          </div>

          <button 
    className="reserve-button"
    onClick={() => alert('Feature coming soon!')}
    disabled={isOwner}
  >
    Reserve
  </button>
</div>
      </div>

      {/* Reviews section */}
      
      <div className="reviews-section">
  <div className="reviews-header">
    <h2>
      <i className="fas fa-star"></i>
      {' ' + getRatingText()}
    </h2>
    {sessionUser && !isOwner && !hasReviewed && (
      <OpenModalButton 
        buttonText="Write a Review"
        modalComponent={<CreateReviewModal spotId={spotId} />}
      />
    )}
  </div>

  {reviews.length > 0 ? (
    <div className="reviews-list">
      {[...reviews]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <h3>{review.User?.firstName}</h3>
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
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
  ) : (
    sessionUser && !isOwner && (
      <p className="no-reviews-message">Be the first to post a review!</p>
    )
  )}
</div>
</div>
  );
}