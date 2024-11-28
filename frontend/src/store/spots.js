import { csrfFetch } from "./csrf";

// Action Types
const LOAD_SPOTS = "spots/LOAD_SPOTS";
const LOAD_SPOT_DETAILS = "spots/LOAD_SPOT_DETAILS";
const ADD_SPOT = "spots/ADD_SPOT";
const UPDATE_SPOT = "spots/UPDATE_SPOT";
const REMOVE_SPOT = "spots/REMOVE_SPOT";
const LOAD_SPOT_IMAGES = "spots/LOAD_SPOT_IMAGES";

// Action Creators
const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots,
});

const loadSpotDetails = (spot) => ({
  type: LOAD_SPOT_DETAILS,
  spot,
});

const loadSpotImages = (images) => ({
  type: LOAD_SPOT_IMAGES,
  images,
});

const addSpot = (spot) => ({
  type: ADD_SPOT,
  spot,
});

const updateSpot = (spot) => ({
  type: UPDATE_SPOT,
  spot,
});

const removeSpot = (spotId) => ({
  type: REMOVE_SPOT,
  spotId,
});

// Thunk Action Creators
export const fetchSpots = () => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/spots");
    if (response.ok) {
      const data = await response.json();
      console.log("API Response:", data); // Debug log
      dispatch(loadSpots(data.Spots || [])); // Ensure we're accessing the Spots array
      return data.Spots || [];
    }
  } catch (error) {
    console.error("Error fetching spots:", error);
    return [];
  }
};

export const fetchSpotDetails = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (response.ok) {
      const spot = await response.json();
      console.log("Fetched spot details:", spot); // Debug log
      dispatch(loadSpotDetails(spot));
      return spot;
    }
  } catch (error) {
    console.error("Error fetching spot details:", error);
    throw error;
  }
};

export const fetchSpotImages = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/images`);
    if (response.ok) {
      const data = await response.json();
      dispatch(loadSpotImages(data));
      return data;
    }
  } catch (error) {
    console.error("Error fetching spot images:", error);
  }
};

export const createSpot = (spotData) => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/spots", {
      method: "POST",
      body: JSON.stringify(spotData),
    });

    if (response.ok) {
      const newSpot = await response.json();
      dispatch(addSpot(newSpot));
      return newSpot;
    }
  } catch (error) {
    console.error("Error creating spot:", error);
    throw error;
  }
};

export const editSpot = (spotId, spotData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    body: JSON.stringify(spotData),
  });

  if (response.ok) {
    const updatedSpot = await response.json();
    dispatch(updateSpot(updatedSpot));
    return updatedSpot;
  }
};

export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(removeSpot(spotId));
    return true;
  }
};

// Initial State
const initialState = {
  allSpots: {},
  singleSpot: null,
};

// Reducer
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const allSpots = {};
      // Make sure action.spots is an array before using forEach
      if (Array.isArray(action.spots)) {
        action.spots.forEach((spot) => {
          allSpots[spot.id] = spot;
        });
      }
      return {
        ...state,
        allSpots,
      };
    }
    case LOAD_SPOT_DETAILS:
      return {
        ...state,
        singleSpot: action.spot,
      };
    case LOAD_SPOT_IMAGES:
      return {
        ...state,
        singleSpot: {
          ...state.singleSpot,
          spot: {
            ...state.singleSpot.spot,
            previewImage: action.images.find((img) => img.preview)?.url,
          },
        },
      };
    case ADD_SPOT:
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.spot.id]: action.spot,
        },
      };
    case UPDATE_SPOT:
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.spot.id]: action.spot,
        },
        singleSpot: action.spot,
      };
    case REMOVE_SPOT: {
      const newAllSpots = { ...state.allSpots };
      delete newAllSpots[action.spotId];
      return {
        ...state,
        allSpots: newAllSpots,
        singleSpot: null,
      };
    }
    default:
      return state;
  }
};

export default spotsReducer;
