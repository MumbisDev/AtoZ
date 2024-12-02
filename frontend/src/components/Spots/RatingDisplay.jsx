export default function RatingDisplay({ avgRating, numReviews }) {
    return (
      <div className="rating-display">
        <i className="fas fa-star"></i>&nbsp;
        {avgRating ? Number(avgRating).toFixed(1) : 'New'} 
        {numReviews > 0 && (
          <>&nbsp;·&nbsp;{numReviews} {numReviews === 1 ? 'review' : 'reviews'}</>
        )}
      </div>
    );
  }