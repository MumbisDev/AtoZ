import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createSpot, fetchSpotDetails, editSpot } from '../../store/spots';
import './SpotForm.css';

function SpotForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { spotId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    address: '',
    city: '',
    state: '',
    country: '',
    lat: '',
    lng: '',
    images: ['', '', '', '', '']
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (spotId) {
      dispatch(fetchSpotDetails(spotId)).then((response) => {
        if (response?.spot) {
          setFormData({
            name: response.spot.name,
            description: response.spot.description,
            price: response.spot.price,
            address: response.spot.address,
            city: response.spot.city,
            state: response.spot.state,
            country: response.spot.country,
            lat: response.spot.lat || '',
            lng: response.spot.lng || '',
            images: response.spot.previewImage ? 
              [response.spot.previewImage, '', '', '', ''] : 
              ['', '', '', '', '']
          });
        }
      });
    }
  }, [dispatch, spotId]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 30) {
      newErrors.description = 'Description needs 30 or more characters';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (Number(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!formData.lat) {
      newErrors.lat = 'Latitude is required';
    } else if (isNaN(formData.lat) || Number(formData.lat) < -90 || Number(formData.lat) > 90) {
      newErrors.lat = 'Latitude must be between -90 and 90';
    }

    if (!formData.lng) {
      newErrors.lng = 'Longitude is required';
    } else if (isNaN(formData.lng) || Number(formData.lng) < -180 || Number(formData.lng) > 180) {
      newErrors.lng = 'Longitude must be between -180 and 180';
    }

    if (!formData.images[0].trim()) {
      newErrors.images = 'At least one image is required';
    } else if (!formData.images[0].endsWith('.png') && 
               !formData.images[0].endsWith('.jpg') && 
               !formData.images[0].endsWith('.jpeg')) {
      newErrors.images = 'Image URL must end in .png, .jpg, or .jpeg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        images: formData.images.filter(url => url.trim())
      };

      let result;
      if (spotId) {
        result = await dispatch(editSpot(spotId, submitData));
      } else {
        result = await dispatch(createSpot(submitData));
      }

      if (result) {
        navigate(`/spots/${result.id || spotId}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: error.message || 'Failed to save spot' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  return (
    <div className="spot-form-container">
      <h1>{spotId ? 'Update your Spot' : 'Create a New Spot'}</h1>
      {errors.submit && <div className="error-message">{errors.submit}</div>}
      
      <form onSubmit={handleSubmit} className="spot-form">
        <div className="form-section">
          <h2>Where&apos;s your place located?</h2>
          <p>Guests will only get your exact address once they book a reservation.</p>
          
          <div className="form-group">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className={errors.address ? 'error' : ''}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className={errors.city ? 'error' : ''}
              />
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>

            <div className="form-group">
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className={errors.state ? 'error' : ''}
              />
              {errors.state && <span className="error-message">{errors.state}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                className={errors.country ? 'error' : ''}
              />
              {errors.country && <span className="error-message">{errors.country}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="number"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                placeholder="Latitude"
                step="any"
                className={errors.lat ? 'error' : ''}
              />
              {errors.lat && <span className="error-message">{errors.lat}</span>}
            </div>

            <div className="form-group">
              <input
                type="number"
                name="lng"
                value={formData.lng}
                onChange={handleChange}
                placeholder="Longitude"
                step="any"
                className={errors.lng ? 'error' : ''}
              />
              {errors.lng && <span className="error-message">{errors.lng}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Tell us about your place</h2>
          
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name of your place"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
        </div>

        <div className="form-section">
          <h2>Set your price</h2>
          <div className="form-group">
            <div className="price-input">
              <span className="currency">$</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price per night"
                min="0"
                step="0.01"
                className={errors.price ? 'error' : ''}
              />
            </div>
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>
        </div>

        <div className="form-section">
          <h2>Add photos</h2>
          <div className="form-group">
            <input
              type="url"
              value={formData.images[0]}
              onChange={(e) => handleImageChange(0, e.target.value)}
              placeholder="Preview Image URL (required)"
              className={errors.images ? 'error' : ''}
            />
            {errors.images && <span className="error-message">{errors.images}</span>}
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Spot'}
        </button>
      </form>
    </div>
  );
}

export default SpotForm;