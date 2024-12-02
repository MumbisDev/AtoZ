import { csrfFetch } from "./csrf";

// Action Types
const LOAD_SPOTS = "spots/LOAD_SPOTS";
const LOAD_SPOT_DETAILS = "spots/LOAD_SPOT_DETAILS";
const ADD_SPOT = "spots/ADD_SPOT";
const UPDATE_SPOT = "spots/UPDATE_SPOT";
const REMOVE_SPOT = "spots/REMOVE_SPOT";

// Action Creators

const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots,
});

const loadSpotDetails = (spot) => ({
  type: LOAD_SPOT_DETAILS,
  spot,
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

export const fetchSpots = () => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/spots");
    if (response.ok) {
      const data = await response.json();
      console.log("API Response:", data);
      dispatch(loadSpots(data.Spots || []));
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
      const data = await response.json();
      console.log("Spot data:", data);

      const previewResponse = await csrfFetch(`/api/spots`);
      if (previewResponse.ok) {
        const allSpots = await previewResponse.json();
        const spotWithPreview = allSpots.Spots.find(
          (s) => s.id === parseInt(spotId)
        );
        if (spotWithPreview) {
          data.spot.previewImage = spotWithPreview.previewImage;
        }
      }

      const ownerResponse = await csrfFetch(`/api/users/${data.spot.ownerId}`);
      if (ownerResponse.ok) {
        const ownerData = await ownerResponse.json();

        data.spot.Owner = ownerData;
      }

      dispatch(loadSpotDetails(data));
      return data;
    }
  } catch (error) {
    console.error("Error fetching spot details:", error);
    throw error;
  }
};

export const createSpot = (spotData) => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/spots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: spotData.address,
        city: spotData.city,
        state: spotData.state,
        country: spotData.country,
        lat: parseFloat(spotData.lat),
        lng: parseFloat(spotData.lng),
        name: spotData.name,
        description: spotData.description,
        price: parseFloat(spotData.price),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create spot");
    }

    const { spot } = await response.json();
    console.log("Created spot:", spot);

    if (spotData.images && spotData.images.length > 0) {
      console.log("Adding image for spot ID:", spot.id);
      const imageResponse = await csrfFetch(`/api/spots/${spot.id}/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: spotData.images[0],
          preview: true,
        }),
      });

      if (!imageResponse.ok) {
        console.error("Error adding image:", await imageResponse.json());
      } else {
        console.log("Successfully added image");
      }
    }

    dispatch(addSpot(spot));
    return spot;
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
