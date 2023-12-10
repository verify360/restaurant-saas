import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import "../css/bookATable.css";
import Footer from '../components/Footer';
import CityCard from '../components/CityCard';
import { useNavigate, useParams } from 'react-router-dom';
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

  const [showMoreCuisine, setShowMoreCuisine] = useState(false);
  const [showMoreTypes, setShowMoreTypes] = useState(false);
  const [showMoreFeature, setShowMoreFeature] = useState(false);

  const [sortByPriceLowToHigh, setSortByPriceLowToHigh] = useState(false);
  const [sortByPriceHighToLow, setSortByPriceHighToLow] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;

  const { city, area, location, cuisine, types, amenities } = useParams();

  const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);

  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(capitalizedCity);

  function formatString(area) {
    const words = area.split('-');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    const formattedString = capitalizedWords.join(' ');

    return formattedString;
  }

  // Convert kebab-case to camelCase
  const kebabToCamel = (str) => {
    return str ? str.replace(/-([a-z])/g, (match, group) => group.toUpperCase()) : '';
  };

  // Convert kebab-case to PascalCase
  const kebabToPascal = (str) => {
    const camelCase = kebabToCamel(str);
    return camelCase ? camelCase.charAt(0).toUpperCase() + camelCase.slice(1) : '';
  };

  // Convert kebab-case to Title Case
  const kebabToTitleCase = (str) => {
    return str
      ? str
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      : '';
  };

  //Convert the types to desired format
  function convertToOriginalFormat(cleanedString) {
    if (cleanedString) {
      const words = cleanedString.split('-');
      const originalFormat = words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return originalFormat;
    }
  }

  // const updatedCuisine = formatString(cuisine);
  // console.log('Updated Cuisine:', updatedCuisine);

  // if (updatedCuisine && !selectedCuisines.includes(updatedCuisine)) {
  //   console.log('Setting Selected Cuisines:', updatedCuisine);
  //   setSelectedCuisines(updatedCuisine);
  // }


  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(
          types
            ? `/restaurants?city=${capitalizedCity}&types=${convertToOriginalFormat(types)}`
            : amenities
              ? `/restaurants?city=${capitalizedCity}&area=${formatString(area)}&amenities=${kebabToPascal(amenities)}`
              : location
                ? `/restaurants?city=${capitalizedCity}&area=${formatString(area)}&location=${formatString(location)}`
                : cuisine
                  ? area
                    ? `/restaurants?city=${capitalizedCity}&area=${formatString(area)}&cuisine=${formatString(cuisine)}`
                    : `/restaurants?city=${capitalizedCity}&cuisine=${formatString(cuisine)}`
                  : area
                    ? `/restaurants?city=${capitalizedCity}&area=${formatString(area)}`
                    : `/restaurants?city=${capitalizedCity}`
        );
        const data = await response.json();
        setRestaurants(data.restaurants || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRestaurants();
  }, [capitalizedCity, area, location, cuisine, types, amenities]);

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

  const records = filterRestaurants().slice(firstIndex, lastIndex);
  const nPage = Math.ceil(filterRestaurants().length / recordsPerPage);
  const numbers = [...Array(nPage + 1).keys()].slice(1);

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

  const restaurantAreaArrays = restaurants ? restaurants.map((restaurant) => restaurant.area) : [];
  const uniqueArea = [...new Set(restaurantAreaArrays.flat())];

  function getRandomElements(arr, count) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const actualArea = getRandomElements(uniqueArea, 1);

  let convertedArea = '';

  if (Array.isArray(actualArea) && actualArea.length > 0) {
    convertedArea = actualArea[0].toLowerCase().replace(/\s+/g, '-');
  }

  return (
    <>
      <Navbar
        city={selectedCity.toLowerCase()}
        onSelectCity={setSelectedCity}
        onCityChangeRedirect={(selectedCity) => {
          navigate(`/${selectedCity.toLowerCase()}`);
        }}
      />
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

                <input type="checkbox" id="biriyani" name="biriyani" onChange={handleCuisineChange} value="Biriyani" />
                <label htmlFor="biriyani"> Biriyani</label><br />

                <input type="checkbox" id="chinese" name="chinese" onChange={handleCuisineChange} value="Chinese" />
                <label htmlFor="chinese"> Chinese</label><br />

                <input type="checkbox" id="nepali" name="nepali" onChange={handleCuisineChange} value="Nepali" />
                <label htmlFor="nepali"> Nepali</label><br />

                <input type="checkbox" id="gujrati" name="gujrati" onChange={handleCuisineChange} value="Gujrati" />
                <label htmlFor="gujrati"> Gujrati</label><br />

                {!showMoreCuisine && (
                  <p className='city-show-more' onClick={() => setShowMoreCuisine(true)}>
                    Show more..<span className='city-show-more-icon'><GoChevronDown /></span>
                  </p>
                )}
                {showMoreCuisine &&
                  <>
                    <input type="checkbox" id="asian" name="asian" onChange={handleCuisineChange} value="Asian" />
                    <label htmlFor="asian"> Asian</label><br />

                    <input type="checkbox" id="thai" name="thai" onChange={handleCuisineChange} value="Thai" />
                    <label htmlFor="thai"> Thai</label><br />

                    <input type="checkbox" id="mexican" name="mexican" onChange={handleCuisineChange} value="Mexican" />
                    <label htmlFor="mexican"> Mexican</label><br />

                    <input type="checkbox" id="bengali" name="bengali" onChange={handleCuisineChange} value="Bengali" />
                    <label htmlFor="bengali"> Bengali</label><br />

                    <input type="checkbox" id="rajasthani" name="rajasthani" onChange={handleCuisineChange} value="Rajasthani" />
                    <label htmlFor="rajasthani"> Rajasthani</label><br />

                    <input type="checkbox" id="kashmiri" name="kashmiri" onChange={handleCuisineChange} value="Kashmiri" />
                    <label htmlFor="kashmiri"> Kashmiri</label><br />

                    <input type="checkbox" id="goan" name="goan" onChange={handleCuisineChange} value="Goan" />
                    <label htmlFor="goan"> Goan</label><br />

                    <input type="checkbox" id="punjabi" name="punjabi" onChange={handleCuisineChange} value="Punjabi" />
                    <label htmlFor="punjabi"> Punjabi</label><br />

                    <input type="checkbox" id="hyderabadi" name="hyderabadi" onChange={handleCuisineChange} value="Hyderabadi" />
                    <label htmlFor="hyderabadi"> Hyderabadi</label><br />

                    <input type="checkbox" id="kerala" name="kerala" onChange={handleCuisineChange} value="Kerala" />
                    <label htmlFor="kerala"> Kerala</label><br />

                    <input type="checkbox" id="assamese" name="assamese" onChange={handleCuisineChange} value="Assamese" />
                    <label htmlFor="assamese"> Assamese</label><br />

                    <input type="checkbox" id="odisha" name="odisha" onChange={handleCuisineChange} value="Odisha" />
                    <label htmlFor="odisha"> Odisha</label><br />

                    <input type="checkbox" id="maharashtrian" name="maharashtrian" onChange={handleCuisineChange} value="Maharashtrian" />
                    <label htmlFor="maharashtrian"> Maharashtrian</label><br />

                    <input type="checkbox" id="malabari" name="malabari" onChange={handleCuisineChange} value="Malabari" />
                    <label htmlFor="malabari"> Malabari</label><br />

                    <input type="checkbox" id="mediterranean" name="mediterranean" onChange={handleCuisineChange} value="Mediterranean" />
                    <label htmlFor="mediterranean"> Mediterranean</label><br />

                    <input type="checkbox" id="american" name="american" onChange={handleCuisineChange} value="American" />
                    <label htmlFor="american"> American</label><br />

                    <input type="checkbox" id="arabian" name="arabian" onChange={handleCuisineChange} value="Arabian" />
                    <label htmlFor="arabian"> Arabian</label><br />

                    <input type="checkbox" id="korean" name="korean" onChange={handleCuisineChange} value="Korean" />
                    <label htmlFor="korean"> Korean</label><br />

                    <input type="checkbox" id="lebanese" name="lebanese" onChange={handleCuisineChange} value="Lebanese" />
                    <label htmlFor="lebanese"> Lebanese</label><br />

                    <input type="checkbox" id="sushi" name="sushi" onChange={handleCuisineChange} value="Sushi" />
                    <label htmlFor="sushi"> Sushi</label><br />

                    <input type="checkbox" id="french" name="french" onChange={handleCuisineChange} value="French" />
                    <label htmlFor="french"> French</label><br />

                    <input type="checkbox" id="mughlai" name="mughlai" onChange={handleCuisineChange} value="Mughlai" />
                    <label htmlFor="mughlai"> Mughlai</label><br />

                    <input type="checkbox" id="fastfood" name="fastfood" onChange={handleCuisineChange} value="Fast Food" />
                    <label htmlFor="fastfood"> Fast Food</label><br />

                    <input type="checkbox" id="continental" name="continental" onChange={handleCuisineChange} value="Continental" />
                    <label htmlFor="continental"> Continental</label><br />

                    <p className='city-show-more' onClick={() => setShowMoreCuisine(false)}>
                      Show less..<span className='city-show-more-icon'><GoChevronUp /></span>
                    </p>
                  </>
                }

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

                <input type="checkbox" id="pizza" name="pizza" onChange={handleTypeChange} value="Pizza" />
                <label htmlFor="pizza"> Pizza</label><br />

                <input type="checkbox" id="qsr" name="qsr" onChange={handleTypeChange} value="Qsr" />
                <label htmlFor="qsr"> QSR</label><br />

                <input type="checkbox" id="ethniccuisine" name="ethniccuisine" onChange={handleTypeChange} value="Ethnic Cuisine" />
                <label htmlFor="ethniccuisine"> Ethnic Cuisine</label><br />

                <input type="checkbox" id="cafe" name="cafe" onChange={handleTypeChange} value="Cafe" />
                <label htmlFor="cafe"> Cafe</label><br />

                <input type="checkbox" id="girfflat50" name="girfflat50" onChange={handleTypeChange} value="Girf Flat 50" />
                <label htmlFor="girfflat50"> GIRF Flat 50</label><br />

                {!showMoreTypes && (
                  <p className='city-show-more' onClick={() => setShowMoreTypes(true)}>
                    Show more..<span className='city-show-more-icon'><GoChevronDown /></span>
                  </p>
                )}
                {showMoreTypes &&
                  <>
                    <input type="checkbox" id="pub" name="pub" onChange={handleTypeChange} value="Pub" />
                    <label htmlFor="pub"> Pub</label><br />

                    <input type="checkbox" id="streetfood" name="streetfood" onChange={handleTypeChange} value="Street Food" />
                    <label htmlFor="streetfood"> Street Food</label><br />

                    <input type="checkbox" id="familystyle" name="familystyle" onChange={handleTypeChange} value="Family Style" />
                    <label htmlFor="familystyle"> Family Style</label><br />

                    <input type="checkbox" id="seafood" name="seafood" onChange={handleTypeChange} value="Seafood" />
                    <label htmlFor="seafood"> Seafood</label><br />

                    <input type="checkbox" id="bakery" name="bakery" onChange={handleTypeChange} value="Bakery" />
                    <label htmlFor="bakery"> Bakery</label><br />

                    <input type="checkbox" id="nightlife" name="nightlife" onChange={handleTypeChange} value="Nightlife" />
                    <label htmlFor="nightlife"> Nightlife</label><br />

                    <input type="checkbox" id="foodtruck" name="foodtruck" onChange={handleTypeChange} value="Food Truck" />
                    <label htmlFor="foodtruck"> Food Truck</label><br />

                    <input type="checkbox" id="girfbuffetdeals" name="girfbuffetdeals" onChange={handleTypeChange} value="Girf Buffet Deals" />
                    <label htmlFor="girfbuffetdeals"> GIRF Buffet Deals</label><br />

                    <input type="checkbox" id="buffet" name="buffet" onChange={handleTypeChange} value="Buffet" />
                    <label htmlFor="buffet"> Buffet</label><br />

                    <input type="checkbox" id="vegan" name="vegan" onChange={handleTypeChange} value="Vegan" />
                    <label htmlFor="vegan"> Vegan</label><br />

                    <input type="checkbox" id="5star" name="5star" onChange={handleTypeChange} value="5 Star" />
                    <label htmlFor="5star"> 5 Star</label><br />

                    <p className='city-show-more' onClick={() => setShowMoreTypes(false)}>
                      Show less..<span className='city-show-more-icon'><GoChevronUp /></span>
                    </p>
                  </>
                }
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

                {!showMoreFeature && (
                  <p className='city-show-more' onClick={() => setShowMoreFeature(true)}>
                    Show more..<span className='city-show-more-icon'><GoChevronDown /></span>
                  </p>
                )}
                {showMoreFeature &&
                  <>
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

                    <p className='city-show-more' onClick={() => setShowMoreFeature(false)}>
                      Show less..<span className='city-show-more-icon'><GoChevronUp /></span>
                    </p>
                  </>
                }
              </div>
            </div>
          }

        </div>
        <div className="city-restaurant-content">
          <div className="resMainUrls">
            <a className='url' href={"/"}> Taste&Flavor {'>'} </a>
            <a className='url' href={`/${city}-restaurants`}> {capitalizedCity} {'>'} </a>
            {area &&
              <a className='url' href={`/${city}-restaurants/${area}`}> {formatString(area)} {'>'} </a>
            }
            {location &&
              <a className='url' href={`/${city}-restaurants/${area}/${location}`}> {formatString(location)} {'>'} </a>
            }
            {
              amenities ? kebabToTitleCase(amenities) + " Feature" :
                cuisine ? formatString(cuisine) + ' Cuisine' :
                  (location ? formatString(location) : area ? formatString(area) : capitalizedCity) + ' Restaurants'
            }
            {
              types
                ? (() => {
                  let originalFormat = convertToOriginalFormat(types);

                  return originalFormat === "Qsr"
                    ? " > QSR Restaurants"
                    : originalFormat === "Girf Flat 50"
                      ? " > GIRF Flat 50 Restaurants"
                      : originalFormat === "Girf Buffet Deals"
                        ? " > GIRF Buffet Deals Restaurants"
                        : `${" > "} ${originalFormat} Restaurants`;
                })()
                : " "
            }
          </div>
          <div className="city-restaurants-heading-sort">
            <div className="city-restaurants-heading">
              Best {amenities ? kebabToTitleCase(amenities) : ' '}
              {cuisine ? ` ${formatString(cuisine)}` : ' '}
              {
                types
                  ? (() => {
                    let originalFormat = convertToOriginalFormat(types);

                    return originalFormat === "Qsr"
                      ? "QSR"
                      : originalFormat === "Girf Flat 50"
                        ? "GIRF Flat 50"
                        : originalFormat === "Girf Buffet Deals"
                          ? "GIRF Buffet Deals"
                          : originalFormat;
                  })()
                  : " "
              }
              {' '}Restaurants Near Me in{' '}
              {location ? `${formatString(location)}, ${formatString(area)}` : area ? formatString(area) : capitalizedCity}
              <span className="city-restaurants-length"> ({records.length}) </span>
            </div>
            <span className='city-sort-by'>Sort by</span>
            <div className="city-restaurants-sort">
              <div className="city-restaurants-sort-element" onClick={() => setShowSort(!showSort)}>
                <span>{sortBy === 'rating' ? 'Rating' : sortBy === 'lowToHigh' ? 'Price: Low to High' : 'Price: High to Low'}</span>
                <span className="city-restaurants-updown">{showSort ? <GoChevronUp /> : <GoChevronDown />}</span>
              </div>
              {showSort &&
                <div className="city-restaurants-sort-elements">
                  {/* <div className="city-sort-elements">Rating</div>
                  <div className="city-sort-elements">Popularity</div> */}
                  <div className="city-sort-elements" onClick={() => { setSortBy('rating'); setShowSort(false); }}>Rating</div>
                  <div className="city-sort-elements" onClick={() => { setSortByPriceLowToHigh(true); setSortByPriceHighToLow(false); setShowSort(false); setSortBy('lowToHigh'); }}>Price: Low to High</div>
                  <div className="city-sort-elements" onClick={() => { setSortByPriceLowToHigh(false); setSortByPriceHighToLow(true); setShowSort(false); setSortBy('highToLow'); }}>Price: High to Low</div>
                </div>
              }
            </div>
          </div>
          <div className="city-restaurants">
            {records.map((restaurant) => (
              <CityCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
          {records.length < filterRestaurants().length ? 
            (<div className='pagination-container'>
              <li className='pagination-item'>
                <a href="#" onClick={prevPage}>Prev</a>
              </li>
              {
                numbers.map((n, i) => (
                  <li key={i} className={`pagination-item ${currentPage === n ? 'active' : ''}`}>
                    <a href="#" onClick={() => changeCurrentPage(n)} >{n}</a>
                  </li>
                ))
              }
              <li className='pagination-item'>
                <a href="#" onClick={nextPage}>Next</a>
              </li>
            </div>)
            : ""
          }
        </div>
      </div>
      <Footer city={city} area={convertedArea} />
    </>
  );

  function prevPage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCurrentPage(n) {
    setCurrentPage(n);
  }

  function nextPage() {
    if (currentPage !== nPage) {
      setCurrentPage(currentPage + 1);
    }
  }

}

export default BookTable;
