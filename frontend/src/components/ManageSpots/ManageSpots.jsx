import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSpots } from '../../store/spots';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';
import './ManageSpots.css';

function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector(state => state.session.user);
  const spots = useSelector(state => 
    Object.values(state.spots.allSpots).filter(spot => 
      spot.ownerId === sessionUser?.id
    )
  );

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  return (
    <div className="manage-spots-container">
      <h1>Manage Spots</h1>
      <button 
        onClick={() => navigate('/spots/new')}
        className="create-spot-button"
      >
        Create a New Spot
      </button>

      <div className="spots-grid">
        {spots.map(spot => (
          <div key={spot.id} className="spot-card">
            <div 
              className="spot-image-container" 
              onClick={() => navigate(`/spots/${spot.id}`)}
            >
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
              <p className="spot-price"><span>${spot.price}</span> night</p>
              <div className="spot-actions">
                <button 
                  onClick={() => navigate(`/spots/${spot.id}/edit`)}
                  className="update-button"
                >
                  Update
                </button>
                <OpenModalButton 
                  buttonText="Delete"
                  modalComponent={<DeleteSpotModal spotId={spot.id} />}
                  className="delete-button"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageSpots;