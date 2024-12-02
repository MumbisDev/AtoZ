import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSpots } from '../../store/spots';
import './SpotsList.css';

function SpotsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector(state => Object.values(state.spots.allSpots));

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  return (
    <div className="spots-grid">
      {spots.map(spot => (
        <div 
          key={spot.id} 
          className="spot-card"
          onClick={() => navigate(`/spots/${spot.id}`)}
          title={spot.name}
        >
          <div className="spot-image-container">
            <img 
              src={spot.previewImage} 
              alt={spot.name}
              className="spot-image"
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
            <p className="spot-price"><span>${Number(spot.price).toFixed(2)}</span> night</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SpotsList;