import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteSpot } from '../../store/spots';
import './DeleteSpotModal.css';

function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    await dispatch(deleteSpot(spotId));
    closeModal();
  };

  return (
    <div className="delete-spot-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot?</p>
      <div className="button-container">
        <button onClick={handleDelete} className="yes-button">
          Yes (Delete Spot)
        </button>
        <button onClick={closeModal} className="no-button">
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
}

export default DeleteSpotModal;