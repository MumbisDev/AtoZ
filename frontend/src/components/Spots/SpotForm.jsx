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
    images: ['', '', '', '', ''] // Array for up to 5 images
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (spotId) {
      dispatch(fetchSpotDetails(spotId)).then(fetchedSpot => {
        if (fetchedSpot) {
          setFormData({
            name: fetchedSpot.name,
            description: fetchedSpot.description,
            price: fetchedSpot.price,
            address: fetchedSpot.address,
            city: fetchedSpot.city,
            state: fetchedSpot.state,
            country: fetchedSpot.country,
            lat: fetchedSpot.lat || '',
            lng: fetchedSpot.lng || '',
            images: fetchedSpot.SpotImages ? 
              [...fetchedSpot.SpotImages.map(img => img.url), 
               ...Array(5 - fetchedSpot.SpotImages.length).fill('')] : 
              ['', '', '', '', '']
          });
        }
      });
    }
  }, [dispatch, spotId]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.images[0]) newErrors.images = 'At least one image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      lat: parseFloat(formData.lat) || 0,
      lng: parseFloat(formData.lng) || 0
    };

    // Create the spot data object
    const spotData = {
      address: submitData.address,
      city: submitData.city,
      state: submitData.state,
      country: submitData.country,
      lat: submitData.lat,
      lng: submitData.lng,
      name: submitData.name,
      description: submitData.description,
      price: submitData.price
    };

    // Separate the images
    const images = formData.images.filter(url => url).map(url => ({
      url,
      preview: true // You might want to add logic to determine which is the preview image
    }));

    try {
      if (spotId) {
        console.log("Updating spot with data:", spotData);
        await dispatch(editSpot(spotId, spotData));
        navigate(`/spots/${spotId}`);
      } else {
        console.log("Creating new spot with data:", { ...spotData, images });
        const newSpot = await dispatch(createSpot({ ...spotData, images }));
        if (newSpot.errors) {
          setErrors(newSpot.errors);
          return;
        }
        navigate(`/spots/${newSpot.id}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ 
        submit: error.message || 'An error occurred while submitting the form' 
      });
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
      <h1>{spotId ? 'Edit Spot' : 'Create a New Spot'}</h1>
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
                className={errors.price ? 'error' : ''}
              />
            </div>
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>
        </div>

        <div className="form-section">
          <h2>Add photos of your place</h2>
          <p>Submit at least one photo to publish your spot.</p>
          
          {formData.images.map((url, index) => (
            <div key={index} className="form-group">
              <input
                type="url"
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder={index === 0 ? "Preview Image URL (required)" : `Image URL ${index + 1} (optional)`}
                className={index === 0 && errors.images ? 'error' : ''}
              />
              {index === 0 && errors.images && <span className="error-message">{errors.images}</span>}
            </div>
          ))}
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Saving...' : (spotId ? 'Save Changes' : 'Create Spot')}
        </button>
      </form>
    </div>
  );
}



export default SpotForm;