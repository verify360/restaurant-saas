import React, { useState } from 'react';
import "../css/addRestaurant.css";
import { useNavigate } from 'react-router-dom';

const initialState = {
  name: '', city: '', area: '', location: '', contactNumber: '',
  averageCostForTwo: '', cuisine: [], types: [], offers: [],
  openingHours: {
    startTime: { value: '', amOrPm: 'AM' },
    endTime: { value: '', amOrPm: 'AM' },
  },
  website: '', extraDiscount: '', amenities: [], images: [], menu: [],
};

const AddRestaurant = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ ...initialState });
  const [error, setError] = useState(null);
  const [imageFileNames, setImageFileNames] = useState([]);
  const [menuFileNames, setMenuFileNames] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmenitiesChange = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setFormData((prevData) => ({
        ...prevData,
        amenities: [...prevData.amenities, name],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        amenities: prevData.amenities.filter((amenity) => amenity !== name),
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setFormData({ ...formData, images: files });
    const fileNames = Array.from(files).map((file) => ({ name: file.name, file }));
    setImageFileNames(fileNames);
  };

  const handleImageRemove = (index) => {
    const updatedImages = [...imageFileNames];
    updatedImages.splice(index, 1);
    setImageFileNames(updatedImages);
    const updatedFiles = updatedImages.map((item) => item.file);
    setFormData({ ...formData, images: updatedFiles });
  };

  const handleMenuChange = (e) => {
    const files = e.target.files;
    setFormData({ ...formData, menu: files });
    const fileNames = Array.from(files).map((file) => ({ name: file.name, file }));
    setMenuFileNames(fileNames);
  };

  const handleMenuRemove = (index) => {
    const updatedMenu = [...menuFileNames];
    updatedMenu.splice(index, 1);
    setMenuFileNames(updatedMenu);
    const updatedFiles = updatedMenu.map((item) => item.file);
    setFormData({ ...formData, menu: updatedFiles });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/add-restaurant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.status === 200) {
        window.alert("Restaurant Added Successfully.");
        setFormData({ ...initialState }); // Reset form after successful submission
        navigate("/owner-home");
      } else if (res.status === 402 || !data) {
        window.alert("Marked Fields Are Mandatory");
      } else {
        setError("Failed to add restaurant. Please try again."); // Handle other status codes here
      }
    } catch (error) {
      setError("Failed to add restaurant. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="main-content">

      <form onSubmit={handleFormSubmit}>
        <div className='info'><h2>Add Restaurant</h2></div>
        <div className="info">
          {/* Basic Information */}
          <div className="contents">
            <div className='subHeading'>Basic Information<span><small>(mandatory)</small></span></div>
            <div className="">
              <label>Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="">
              <label>City:</label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
            </div>
            <div className="">
              <label>Area:</label>
              <input type="text" name="area" value={formData.area} onChange={handleInputChange} required />
            </div>
            <div className="">
              <label>Location:</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} required />
            </div>
            <div className="">
              <label>Contact Number:</label>
              <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} required />
            </div>
          </div>

          {/* Restaurant Details */}

          <div className="contents">
            <div className='subHeading'>Restaurant Details</div>
            <div className="">
              <label>Opening Hours:</label>
              <div className="opening-hours-input">
                <input type="number" name="openingHours.startTime.value" value={formData.openingHours.startTime.value} onChange={handleInputChange} placeholder="Start Time" min="1" max="12" />
                <select name="openingHours.startTime.amOrPm" value={formData.openingHours.startTime.amOrPm} onChange={handleInputChange}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
                <span className="separator">-</span>
                <input type="number" name="openingHours.endTime.value" value={formData.openingHours.endTime.value} onChange={handleInputChange} placeholder="End Time" min="1" max="12" />
                <select name="openingHours.endTime.amOrPm" value={formData.openingHours.endTime.amOrPm} onChange={handleInputChange}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            <div className="">
              <label>Cuisine:<span><small>(required)</small></span></label>
              <input type="text" name="cuisine" value={formData.cuisine.join(',')} onChange={handleInputChange} />
              <small>Separate cuisines with commas (e.g., Chinese, Italian)</small>
            </div>
            <div className="">
              <label>Types:</label>
              <input type="text" name="types" value={formData.types.join(',')} onChange={handleInputChange} />
              <small>Separate types with commas (e.g., Fine Dining, 5 Star)</small>
            </div>
            <div className="">
              <label>Offers:</label>
              <input type="text" name="offers" value={formData.offers.join(',')} onChange={handleInputChange} />
              <small>Separate offers with commas (e.g., 10% Off, Happy Hour)</small>
            </div>
          </div>

          {/* Additional Details  */}
          <div className="contents">
            <div className='subHeading'>Additional Details<span><small>(not mandatory)</small></span></div>
            <div className="">
              <label>Website:</label>
              <input type="text" name="website" value={formData.website} onChange={handleInputChange} />
            </div>
            <div className="">
              <label>Average Cost for Two:</label>
              <input type="number" name="averageCostForTwo" value={formData.averageCostForTwo} onChange={handleInputChange} required />
            </div>
            <div className="">
              <label>Extra Discount:</label>
              <input type="number" name="extraDiscount" value={formData.extraDiscount} onChange={handleInputChange} />
            </div>
            <div className="">
              <label>Amenities:</label>
              <div className="amenities-input">
                <input type="checkbox" id="wifi" name="amenities" value="Wifi" checked={formData.amenities.includes('Wifi')} onChange={handleAmenitiesChange} />
                <label htmlFor="wifi">Wifi</label>

                <input type="checkbox" id="parking" name="amenities" value="Parking" checked={formData.amenities.includes('Parking')} onChange={handleAmenitiesChange} />
                <label htmlFor="parking">Parking</label>

                <input type="checkbox" id="ac" name="amenities" value="Air Conditioning" checked={formData.amenities.includes('Air Conditioning')} onChange={handleAmenitiesChange} />
                <label htmlFor="ac">Air Conditioning</label>

                <input type="checkbox" id="petsAllowed" name="amenities" value="Pets Allowed" checked={formData.amenities.includes('Pets Allowed')} onChange={handleAmenitiesChange} />
                <label htmlFor="petsAllowed">Pets Allowed</label>

                <input type="checkbox" id="outdoorSeating" name="amenities" value="Outdoor Seating" checked={formData.amenities.includes('Outdoor Seating')} onChange={handleAmenitiesChange} />
                <label htmlFor="outdoorSeating">Outdoor Seating</label>
              </div>
            </div>
          </div>

          {/* Images and Menu  */}

          <div className="contents">
            <div className='subHeading'>Images and Menu<span><small>(not mandatory)</small></span></div>
            <div className="">
              <label>Images:</label>
              <input type="file" name="images" accept="image/*" onChange={handleImageChange} multiple />
              <div>
                {imageFileNames.map((item, index) => (
                  <div key={index}>
                    <p>{item.name}</p>
                    <button onClick={() => handleImageRemove(index)}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="">
              <label>Menu:</label>
              <input type="file" name="menu" accept="image/*" onChange={handleMenuChange} multiple />
              <div>
                {menuFileNames.map((item, index) => (
                  <div key={index}>
                    <p>{item.name}</p>
                    <button onClick={() => handleMenuRemove(index)}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="info">
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Add Restaurant</button>
        </div>
      </form>
    </div>
  );


};

export default AddRestaurant;
