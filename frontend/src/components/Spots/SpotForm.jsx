import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpot } from '../../store/spots';
import './SpotForm.css';

function SpotForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    address: '',
    city: '',
    state: '',
    country: '',
    lat: 0,
    lng: 0,
    images: [''] // Just one image for now
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.images[0]) newErrors.images = 'Preview image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Clean and prepare data
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        lat: parseFloat(formData.lat) || 0,
        lng: parseFloat(formData.lng) || 0,
        images: formData.images.filter(url => url.trim()) // Remove empty strings
      };

      console.log("Submitting data:", submitData); // Debug log

      const newSpot = await dispatch(createSpot(submitData));
      navigate(`/spots/${newSpot.id}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ submit: 'Failed to create spot. Please try again.' });
      }
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
      <h1>Create a New Spot</h1>
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