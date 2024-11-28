import { csrfFetch } from "./csrf";

// Action Types
const LOAD_SPOT_REVIEWS = "reviews/LOAD_SPOT_REVIEWS";
const ADD_REVIEW = "reviews/ADD_REVIEW";
const REMOVE_REVIEW = "reviews/REMOVE_REVIEW";

// Action Creators
const loadSpotReviews = (reviews) => ({
  type: LOAD_SPOT_REVIEWS,
  reviews,
});

const addReview = (review) => ({
  type: ADD_REVIEW,
  review,
});

const removeReview = (reviewId) => ({
  type: REMOVE_REVIEW,
  reviewId,
});

// Thunk Action Creators
export const fetchSpotReviews = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
      const data = await response.json();
      console.log("Reviews API Response:", data); // Debug log
      dispatch(loadSpotReviews(data.Reviews || [])); // Ensure we're accessing the Reviews array
      return data.Reviews || [];
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

export const createReview = (spotId, reviewData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      body: JSON.stringify(reviewData),
    });

    if (response.ok) {
      const newReview = await response.json();
      dispatch(addReview(newReview));
      return newReview;
    }
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      dispatch(removeReview(reviewId));
      return true;
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

// Initial State
const initialState = {
  spot: {},
};

// Reducer
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOT_REVIEWS: {
      const spotReviews = {};
      // Make sure action.reviews is an array before using forEach
      if (Array.isArray(action.reviews)) {
        action.reviews.forEach((review) => {
          spotReviews[review.id] = review;
        });
      }
      return {
        ...state,
        spot: spotReviews,
      };
    }
    case ADD_REVIEW:
      return {
        ...state,
        spot: {
          ...state.spot,
          [action.review.id]: action.review,
        },
      };
    case REMOVE_REVIEW: {
      const newSpotReviews = { ...state.spot };
      delete newSpotReviews[action.reviewId];
      return {
        ...state,
        spot: newSpotReviews,
      };
    }
    default:
      return state;
  }
};

export default reviewsReducer;
