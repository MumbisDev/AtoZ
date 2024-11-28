import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSpots } from '../../store/spots';
import './SpotsList.css';

function SpotsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector(state => Object.values(state.spots.allSpots));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSpots = async () => {
      try {
        setIsLoading(true);
        await dispatch(fetchSpots());
      } catch (err) {
        setError('Failed to load spots');
        console.error('Error loading spots:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSpots();
  }, [dispatch]);

  if (isLoading) return <div className="spots-loading">Loading...</div>;
  if (error) return <div className="spots-error">{error}</div>;
  if (!spots.length) return <div className="no-spots">No spots available</div>;

  return (
    <div className="spots-grid">
      {spots.map(spot => {
        if (!spot) return null; // Skip if spot is undefined
        
        return (
          <div 
            key={spot.id} 
            className="spot-card"
            onClick={() => navigate(`/spots/${spot.id}`)}
          >
            <div className="spot-image-container">
              <img 
                src={spot.previewImage} 
                alt={spot.name}
                className="spot-image"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
            </div>
            <div className="spot-info">
              <div className="spot-header">
                <h3>{spot.name}</h3>
                <div className="spot-rating">
                  <i className="fas fa-star"></i>
                  {spot.avgRating ? Number(spot.avgRating).toFixed(1) : 'New'}
                </div>
              </div>
              <p className="spot-location">{spot.city}, {spot.state}</p>
              <p className="spot-price"><span>${spot.price}</span> night</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SpotsList;