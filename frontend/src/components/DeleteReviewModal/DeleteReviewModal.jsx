import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReview } from '../../store/reviews';
import './DeleteReviewModal.css';

function DeleteReviewModal({ reviewId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    await dispatch(deleteReview(reviewId));
    closeModal();
  };

  return (
    <div className="delete-review-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this review?</p>
      <div className="button-container">
        <button onClick={handleDelete} className="yes-button">
          Yes (Delete Review)
        </button>
        <button onClick={closeModal} className="no-button">
          No (Keep Review)
        </button>
      </div>
    </div>
  );
}

export default DeleteReviewModal;