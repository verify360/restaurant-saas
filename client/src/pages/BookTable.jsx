import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import "../css/bookATable.css";
import Footer from '../components/Footer';
import CityCard from '../components/CityCard';
import { Link, useParams } from 'react-router-dom';

const BookTable = () => {

  const [filter, setFilter] = useState([]);

  const [restaurants, setRestaurants] = useState([]);
  const [showCuisineFilters, setShowCuisineFilters] = useState(false);
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

  return (
    <>
      <Navbar city={city} />
      <div className="city-restaurant">
        <div className="city-filters">
          {!showCuisineFilters &&
            <div className="city-cuisine-filters">
              Cuisines
              <span className='city-cuisine-filters-span' onClick={() => setShowCuisineFilters(true)}>+</span>
            </div>
          }
          {showCuisineFilters &&
            <div className="city-cuisine-filters">
              Cuisines
              <span className='city-cuisine-filters-span' onClick={() => setShowCuisineFilters(false)}>—</span>
              <div className="city-checkboxes">
                <input type="checkbox" id="chinese" name="chinese" value="Chinese" />
                <label htmlFor="chinese"> Chinese</label><br />

                <input type="checkbox" id="south-indian" name="south-indian" value="South Indian" />
                <label htmlFor="south-indian"> South Indian</label><br />

                <input type="checkbox" id="north-indian" name="north-indian" value="North Indian" />
                <label htmlFor="north-indian"> North Indian</label><br />

                <input type="checkbox" id="italian" name="italian" value="Italian" />
                <label htmlFor="italian"> Italian</label><br />

                <input type="checkbox" id="mexican" name="mexican" value="Mexican" />
                <label htmlFor="mexican"> Mexican</label><br />

                <input type="checkbox" id="thai" name="thai" value="Thai" />
                <label htmlFor="thai"> Thai</label><br />

                <input type="checkbox" id="bengali" name="bengali" value="Bengali" />
                <label htmlFor="bengali"> Bengali</label><br />

                <input type="checkbox" id="mediterranean" name="mediterranean" value="Mediterranean" />
                <label htmlFor="mediterranean"> Mediterranean</label><br />

                <input type="checkbox" id="korean" name="korean" value="Korean" />
                <label htmlFor="korean"> Korean</label><br />

                <input type="checkbox" id="lebanese" name="lebanese" value="Lebanese" />
                <label htmlFor="lebanese"> Lebanese</label><br />

                <input type="checkbox" id="french" name="french" value="French" />
                <label htmlFor="french"> French</label><br />

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
          <div className="city-restaurants-heading">Restaurant Near Me</div>
          <div className="city-restaurants">
            {restaurants.map((restaurant) => (
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
