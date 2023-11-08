import React, { useEffect, useState } from 'react';
import "../css/addRestaurant.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

const initialState = {
  name: '', city: '', area: '', location: '', contactNumber: '',
  averageCostForTwo: '', cuisine: [], types: [], offers: [],
  openingHours: {
    startTime: '',
    endTime: '',
  },
  website: '', extraDiscount: [], amenities: [], images: [], menu: [],
};

const AddRestaurant = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ ...initialState });
  const [error, setError] = useState(null);
  const [imageFileNames, setImageFileNames] = useState([]);
  const [menuFileNames, setMenuFileNames] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("openingHours.")) {
      // Handle opening hours fields
      const openingHoursField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        openingHours: {
          ...prevData.openingHours,
          [openingHoursField]: value,
        },
      }));
    } else {
      // Handle other fields
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };


  const [amenities, setAmenities] = useState({
    wifi: false,
    parking: false,
    ac: false,
    petsAllowed: false,
    outdoorSeating: false,
  });

  const handleAmenitiesChange = (e) => {
    const { name, checked } = e.target;
    setAmenities((prevAmenities) => ({
      ...prevAmenities,
      [name]: checked,
    }));
  };

  useEffect(() => {
    const selectedAmenities = Object.entries(amenities)
      .filter(([_, isSelected]) => isSelected)
      .map(([amenity]) => amenity);
    setFormData((prevData) => ({
      ...prevData,
      amenities: selectedAmenities,
    }));
  }, [amenities]);

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

  function truncateFileName(fileName, maxLength = 15) {
    if (fileName.length <= maxLength) {
      return fileName;
    } else {
      // Truncate the file name and add ellipsis (...) at the end
      return fileName.substring(0, maxLength - 3) + '...';
    }
  }

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
        setFormData({ ...initialState });
        navigate("/owner-home");
      } else if (res.status === 402 || !data) {
        window.alert("Marked Fields Are Mandatory");
      } else if (res.status === 403) {
        window.alert("Unauthorized Access.");
      } else {
        setError("Failed to add restaurant. Please try again.");
      }
    } catch (error) {
      setError("Failed to add restaurant. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="main-content">

      <form onSubmit={handleFormSubmit}>
        <div className='infos'>
          <h2>Register Your Restaurant</h2>
        </div>
        <div className="info">
          {/* Basic Information */}
          <div className="contents">
            <div className='subHeading'>Basic Information<span><small>(mandatory)</small></span></div>
            <div className="resItem">
              <label>Name:</label>
              <input className='resInput' type="text" name="name" placeholder='Rahul Sharma' value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="resItem">
              <label>City:</label>
              <input className='resInput' type="text" name="city" placeholder='Kolkata,Delhi,Mumbai,Chennai,etc.' value={formData.city} onChange={handleInputChange} required />
            </div>
            <div className="resItem">
              <label>Area:</label>
              <input className='resInput' type="text" name="area" placeholder='North Kolkata,South Delhi,etc.' value={formData.area} onChange={handleInputChange} required />
            </div>
            <div className="resItem">
              <label>Location:</label>
              <input className='resInput' type="text" name="location" placeholder='Exact Location of the Restaurant.' value={formData.location} onChange={handleInputChange} required />
            </div>
            <div className="resItem">
              <label>Contact Number:</label>
              <input className='resInput' type="text" name="contactNumber" placeholder='+91 98x69x25x4' value={formData.contactNumber} onChange={handleInputChange} required />
            </div>
          </div>
        </div>

        {/* Restaurant Details */}

        <div className="info">
          <div className="contents">
            <div className='subHeading'>Restaurant Details<span><small>(mandatory)</small></span></div>
            <div className="resItem">
              <div className="">
                <label>Opening Hours:</label>
                <input className='resHours' type="text" name="openingHours.startTime" value={formData.openingHours.startTime} onChange={handleInputChange} placeholder="Start Time e.g: 4 PM" required />
                <span className="separator"> -- </span>
                <input className='resHours' type="text" name="openingHours.endTime" value={formData.openingHours.endTime} onChange={handleInputChange} placeholder="End Time e.g: 11 PM" required />
              </div>
            </div>
            <div className="resItem">
              <label>Cuisine:</label>
              <input className='resInput' type="text" name="cuisine" placeholder='Separate by commas (e.g., Chinese, Italian, French,etc.)' value={formData.cuisine.join(',')} onChange={(e) => setFormData({ ...formData, cuisine: e.target.value.split(',') })} required />
            </div>
            <div className="resItem">
              <label>Types:</label>
              <input className='resInput' type="text" name="types" placeholder='Separate by commas (e.g., Fine Dining, 5 Star,etc.)' value={formData.types.join(',')} onChange={(e) => setFormData({ ...formData, types: e.target.value.split(',') })} required />
            </div>
            <div className="resItem">
              <label>Offers:</label>
              <input className='resInput' type="text" name="offers" placeholder='Separate by commas (e.g., 10% Off, Happy Hour,etc.)' value={formData.offers.join(',')} onChange={(e) => setFormData({ ...formData, offers: e.target.value.split(',') })} required />
            </div>
          </div>
        </div>

        {/* Additional Details  */}

        <div className="info">
          <div className="contents">
            <div className='subHeading'>Additional Details<span><small>(not mandatory)</small></span></div>
            <div className="resItem">
              <label>Website:</label>
              <input className='resInput' type="text" name="website" placeholder='www.tasteandflavor.com' value={formData.website} onChange={handleInputChange} />
            </div>
            <div className="resItem">
              <label>Average Cost for Two:</label>
              <input className='resInput' type="number" name="averageCostForTwo" placeholder='1320 (Numbers Only)' value={formData.averageCostForTwo} onChange={handleInputChange} />
            </div>
            <div className="resItem">
              <label>Extra Discount:</label>
              <input className='resInput' type="text" name="extraDiscount" placeholder='Separate by commas (e.g., 20% Off on total bill,etc.)' value={formData.extraDiscount.join(',')} onChange={(e) => setFormData({ ...formData, extraDiscount: e.target.value.split(',') })} />
              <small></small>
            </div>
            <div className="resItem">
              <label>Amenities:</label>
              <div className="amenities-input">
                <input className='resCheck' type="checkbox" id="wifi" name="wifi" checked={amenities.wifi} onChange={handleAmenitiesChange} />
                <label className='resCheckElement' htmlFor="wifi">Wifi</label>

                <input className='resCheck' type="checkbox" id="parking" name="parking" checked={amenities.parking} onChange={handleAmenitiesChange} />
                <label className='resCheckElement' htmlFor="parking">Parking</label>

                <input className='resCheck' type="checkbox" id="ac" name="ac" checked={amenities.ac} onChange={handleAmenitiesChange} />
                <label className='resCheckElement' htmlFor="ac">Air Conditioning</label>

                <input className='resCheck' type="checkbox" id="petsAllowed" name="petsAllowed" checked={amenities.petsAllowed} onChange={handleAmenitiesChange} />
                <label className='resCheckElement' htmlFor="petsAllowed">Pets Allowed</label>

                <input className='resCheck' type="checkbox" id="outdoorSeating" name="outdoorSeating" checked={amenities.outdoorSeating} onChange={handleAmenitiesChange} />
                <label className='resCheckElement' htmlFor="outdoorSeating">Outdoor Seating</label>
              </div>
            </div>
          </div>
        </div>

        {/* Images and Menu  */}

        <div className="info">
          <div className="contents">
            <div className='subHeading'>Images and Menu<span><small>(not mandatory)</small></span></div>
            <div className="resItem">
              <label>Images:</label>
              <input className='resFile' type="file" name="images" accept="image/*" onChange={handleImageChange} multiple />
              <div className='resImages'>
                {imageFileNames.map((item, index) => (
                  <div className='resImage' key={index}>
                    <p>{truncateFileName(item.name)}</p>
                    <div className='resImageRemove' onClick={() => handleImageRemove(index)}><RiDeleteBin6Line/></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="resItem">
              <label>Menu:</label>
              <input className='resFile' type="file" name="menu" accept="image/*" onChange={handleMenuChange} multiple />
              <div className='resImages'>
                {menuFileNames.map((item, index) => (
                  <div className='resImage' key={index}>
                    <p>{truncateFileName(item.name)}</p>
                    <div className='resImageRemove' onClick={() => handleMenuRemove(index)}><RiDeleteBin6Line/></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="info">
          {error && <div className="error-message">{error}</div>}
          <button className='resButton' type="submit">Add Restaurant</button>
        </div>
      </form>
    </div>
  );


};

export default AddRestaurant;
