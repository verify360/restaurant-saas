import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import "../css/bookATable.css";
import Footer from '../components/Footer';
import CityCard from '../components/CityCard';
import { Link, useParams } from 'react-router-dom';
import { FaMinus, FaPlus } from "react-icons/fa";
import { GoChevronDown, GoChevronUp } from "react-icons/go";

const BookTable = () => {

  const [restaurants, setRestaurants] = useState([]);

  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const [showCuisineFilters, setShowCuisineFilters] = useState(true);
  const [showTypeFilters, setShowTypeFilters] = useState(true);
  const [showFeatureFilters, setShowFeatureFilters] = useState(false);

  const [showSort, setShowSort] = useState(false);

  const [sortByPriceLowToHigh, setSortByPriceLowToHigh] = useState(false);
  const [sortByPriceHighToLow, setSortByPriceHighToLow] = useState(false);
  const [sortBy, setSortBy] = useState(null);

  const { city } = useParams();
  const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`/restaurants?city=${capitalizedCity}`);
        const data = await response.json();
        setRestaurants(data.restaurants || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRestaurants();
  }, [capitalizedCity]);

  const filterRestaurants = () => {
    let filteredRestaurants = [...restaurants];

    // Apply cuisine filters
    if (selectedCuisines.length > 0) {
      filteredRestaurants = filteredRestaurants.filter((restaurant) =>
        restaurant.cuisine && selectedCuisines.some((cuisine) => restaurant.cuisine.includes(cuisine))
      );
    }

    // Apply type filters if selected
    if (selectedTypes.length > 0) {
      filteredRestaurants = filteredRestaurants.filter((restaurant) =>
        restaurant.types && selectedTypes.some((type) => restaurant.types.includes(type))
      );
    }

    // Apply feature filters if selected
    if (selectedFeatures.length > 0) {
      filteredRestaurants = filteredRestaurants.filter((restaurant) =>
        restaurant.amenities && selectedFeatures.some((amenity) => restaurant.amenities.includes(amenity))
      );
    }

    // Apply price sorting if selected
    if (sortByPriceLowToHigh) {
      filteredRestaurants = filteredRestaurants.sort((a, b) => a.averageCostForTwo - b.averageCostForTwo);
    } else if (sortByPriceHighToLow) {
      filteredRestaurants = filteredRestaurants.sort((a, b) => b.averageCostForTwo - a.averageCostForTwo);
    }

    return filteredRestaurants;
  };

  const handleCuisineChange = (e) => {
    const value = e.target.value;
    setSelectedCuisines((prev) =>
      prev.includes(value) ? prev.filter((cuisine) => cuisine !== value) : [...prev, value]
    );
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((type) => type !== value) : [...prev, value]
    );
  };

  const handleFeatureChange = (e) => {
    const value = e.target.value;
    setSelectedFeatures((prev) =>
      prev.includes(value) ? prev.filter((feature) => feature !== value) : [...prev, value]
    );
  };


  return (
    <>
      <Navbar city={city} />
      <div className="city-restaurant">
        <div className="city-filters">
          {!showCuisineFilters &&
            <div className="city-cuisine-filters">
              Cuisines
              <span className='city-cuisine-filters-span' onClick={() => setShowCuisineFilters(true)}><FaPlus /></span>
            </div>
          }
          {showCuisineFilters &&
            <div className="city-cuisine-filters">
              Cuisines
              <span className='city-cuisine-filters-span' onClick={() => setShowCuisineFilters(false)}><FaMinus /></span>
              <div className="city-checkboxes">

                <input type="checkbox" id="italian" name="italian" onChange={handleCuisineChange} value="Italian" />
                <label htmlFor="italian"> Italian</label><br />

                <input type="checkbox" id="south-indian" name="south-indian" onChange={handleCuisineChange} value="South Indian" />
                <label htmlFor="south-indian"> South Indian</label><br />

                <input type="checkbox" id="north-indian" name="north-indian" onChange={handleCuisineChange} value="North Indian" />
                <label htmlFor="north-indian"> North Indian</label><br />


                <input type="checkbox" id="mexican" name="mexican" onChange={handleCuisineChange} value="Mexican" />
                <label htmlFor="mexican"> Mexican</label><br />

                <input type="checkbox" id="thai" name="thai" onChange={handleCuisineChange} value="Thai" />
                <label htmlFor="thai"> Thai</label><br />

                <input type="checkbox" id="chinese" name="chinese" onChange={handleCuisineChange} value="Chinese" />
                <label htmlFor="chinese"> Chinese</label><br />

                <input type="checkbox" id="bengali" name="bengali" onChange={handleCuisineChange} value="Bengali" />
                <label htmlFor="bengali"> Bengali</label><br />

                <input type="checkbox" id="mediterranean" name="mediterranean" onChange={handleCuisineChange} value="Mediterranean" />
                <label htmlFor="mediterranean"> Mediterranean</label><br />

                <input type="checkbox" id="korean" name="korean" onChange={handleCuisineChange} value="Korean" />
                <label htmlFor="korean"> Korean</label><br />

                <input type="checkbox" id="lebanese" name="lebanese" onChange={handleCuisineChange} value="Lebanese" />
                <label htmlFor="lebanese"> Lebanese</label><br />

                <input type="checkbox" id="french" name="french" onChange={handleCuisineChange} value="French" />
                <label htmlFor="french"> French</label><br />

                <input type="checkbox" id="continental" name="continental" onChange={handleCuisineChange} value="Continental" />
                <label htmlFor="continental"> Continental</label><br />

              </div>
            </div>
          }

          {!showTypeFilters &&
            <div className="city-type-filters">
              Types
              <span className='city-type-filters-span' onClick={() => setShowTypeFilters(true)}><FaPlus /></span>
            </div>
          }
          {showTypeFilters &&
            <div className="city-type-filters">
              Types
              <span className='city-type-filters-span' onClick={() => setShowTypeFilters(false)}><FaMinus /></span>
              <div className="city-checkboxes">

                <input type="checkbox" id="finedining" name="finedining" onChange={handleTypeChange} value="Fine Dining" />
                <label htmlFor="finedining"> Fine Dining</label><br />

                <input type="checkbox" id="casualdining" name="casualdining" onChange={handleTypeChange} value="Casual Dining" />
                <label htmlFor="casualdining"> Casual Dining</label><br />

                <input type="checkbox" id="dineoutpay" name="dineoutpay" onChange={handleTypeChange} value="Dineout Pay" />
                <label htmlFor="dineoutpay"> Dineout Pay</label><br />

                <input type="checkbox" id="fastfood" name="fastfood" onChange={handleTypeChange} value="Fast Food" />
                <label htmlFor="fastfood"> Fast Food</label><br />

                <input type="checkbox" id="ethniccuisine" name="ethniccuisine" onChange={handleTypeChange} value="Ethnic Cuisine" />
                <label htmlFor="ethniccuisine"> Ethnic Cuisine</label><br />

                <input type="checkbox" id="cafeteria" name="cafeteria" onChange={handleTypeChange} value="Cafeteria" />
                <label htmlFor="cafeteria"> Cafeteria</label><br />

                <input type="checkbox" id="pub" name="pub" onChange={handleTypeChange} value="Pub" />
                <label htmlFor="pub"> Pub</label><br />

                <input type="checkbox" id="foodtruck" name="foodtruck" onChange={handleTypeChange} value="Food Truck" />
                <label htmlFor="foodtruck"> Food Truck</label><br />

                <input type="checkbox" id="buffet" name="buffet" onChange={handleTypeChange} value="Buffet" />
                <label htmlFor="buffet"> Buffet</label><br />

                <input type="checkbox" id="vegan" name="vegan" onChange={handleTypeChange} value="Vegan" />
                <label htmlFor="vegan"> Vegan</label><br />

                <input type="checkbox" id="5star" name="5star" onChange={handleTypeChange} value="5 Star" />
                <label htmlFor="5star"> 5 Star</label><br />

              </div>
            </div>
          }

          {!showFeatureFilters &&
            <div className="city-feature-filters">
              Features
              <span className='city-feature-filters-span' onClick={() => setShowFeatureFilters(true)}><FaPlus /></span>
            </div>
          }
          {showFeatureFilters &&
            <div className="city-feature-filters">
              Features
              <span className='city-feature-filters-span' onClick={() => setShowFeatureFilters(false)}><FaMinus /></span>
              <div className="city-checkboxes">

                <input type="checkbox" id=" " name="Wifi" onChange={handleFeatureChange} value="Wifi" />
                <label htmlFor="Wifi"> Wifi</label><br />

                <input type="checkbox" id="Parking" name="Parking" onChange={handleFeatureChange} value="Parking" />
                <label htmlFor="Parking"> Parking</label><br />

                <input type="checkbox" id="AC" name="AC" onChange={handleFeatureChange} value="AC" />
                <label htmlFor="AC"> Air Conditioning</label><br />

                <input type="checkbox" id="PetsAllowed" name="PetsAllowed" onChange={handleFeatureChange} value="PetsAllowed" />
                <label htmlFor="PetsAllowed"> Pets Allowed</label><br />

                <input type="checkbox" id="OutdoorSeating" name="OutdoorSeating" onChange={handleFeatureChange} value="OutdoorSeating" />
                <label htmlFor="OutdoorSeating"> Outdoor Seating</label><br />

                <input type="checkbox" id="CardsAccepted" name="CardsAccepted" onChange={handleFeatureChange} value="CardsAccepted" />
                <label htmlFor="CardsAccepted"> Cards Accepted</label><br />

                <input type="checkbox" id="WalletAccepted" name="WalletAccepted" onChange={handleFeatureChange} value="WalletAccepted" />
                <label htmlFor="WalletAccepted"> Wallet Accepted</label><br />

                <input type="checkbox" id="HomeDelivery" name="HomeDelivery" onChange={handleFeatureChange} value="HomeDelivery" />
                <label htmlFor="HomeDelivery"> Home Delivery</label><br />

                <input type="checkbox" id="ValetAvailable" name="ValetAvailable" onChange={handleFeatureChange} value="ValetAvailable" />
                <label htmlFor="ValetAvailable"> Valet Available</label><br />

                <input type="checkbox" id="RoofTop" name="RoofTop" onChange={handleFeatureChange} value="RoofTop" />
                <label htmlFor="RoofTop"> Roof Top</label><br />

                <input type="checkbox" id="FullBarAvailable" name="FullBarAvailable" onChange={handleFeatureChange} value="FullBarAvailable" />
                <label htmlFor="FullBarAvailable"> Full Bar Available</label><br />

                <input type="checkbox" id="Lift" name="Lift" />
                <label htmlFor="Lift"> Lift</label><br />

                <input type="checkbox" id="SmokingArea" name="SmokingArea" onChange={handleFeatureChange} value="SmokingArea" />
                <label htmlFor="SmokingArea"> Smoking Area</label><br />

                <input type="checkbox" id="LivePerformance" name="LivePerformance" onChange={handleFeatureChange} value="LivePerformance" />
                <label htmlFor="LivePerformance"> Live Performance</label><br />

                <input type="checkbox" id="LiveScreening" name="LiveScreening" onChange={handleFeatureChange} value="LiveScreening" />
                <label htmlFor="LiveScreening"> Live Screening</label><br />
              </div>
            </div>
          }

        </div>
        <div className="city-restaurant-content">
          <div className="resMainUrls">
            <Link className='url' to={"/"}> Taste&Flavor {'>'} </Link>
            <Link className='url' to={`/${city}-restaurants`}> {capitalizedCity} {'>'} </Link>
            {capitalizedCity} Restaurants
          </div>
          <div className="city-restaurants-heading-sort">
            <div className="city-restaurants-heading">
              Best Restaurant Near Me in {capitalizedCity}
              <span className="city-restaurants-length"> ({filterRestaurants().length}) </span>
            </div>
            <span className='city-sort-by'>Sort by</span>
            <div className="city-restaurants-sort">
              <div className="city-restaurants-sort-element" onClick={() => setShowSort(!showSort)}>
                <span>{sortBy === null ? 'Rating' : sortBy === 'lowToHigh' ? 'Price: Low to High' : 'Price: High to Low'}</span>
                <span className="city-restaurants-updown">{showSort ? <GoChevronUp /> : <GoChevronDown />}</span>
              </div>
              {showSort &&
                <div className="city-restaurants-sort-elements">
                  {/* <div className="city-sort-elements">Rating</div>
                  <div className="city-sort-elements">Popularity</div> */}
                  <div className="city-sort-elements" onClick={() => { setSortBy(null); setShowSort(false); }}>Rating</div>
                  <div className="city-sort-elements" onClick={() => { setSortByPriceLowToHigh(true); setSortByPriceHighToLow(false); setShowSort(false); setSortBy('lowToHigh'); }}>Price: Low to High</div>
                  <div className="city-sort-elements" onClick={() => { setSortByPriceLowToHigh(false); setSortByPriceHighToLow(true); setShowSort(false); setSortBy('highToLow'); }}>Price: High to Low</div>
                </div>
              }
            </div>
          </div>
          <div className="city-restaurants">
            {filterRestaurants().map((restaurant) => (
              <CityCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BookTable;
