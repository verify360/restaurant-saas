import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Offers from '../components/Offers';
import Carousel from '../components/Carousel';
import Footer from '../components/Footer';

function Home(){
    const [restaurants, setRestaurants] = useState([]);

    const selectedCity = "Kolkata";
    const filteredRestaurants = restaurants.filter((restaurant) => restaurant.city === selectedCity);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch('/restaurants-slider');
                const data = await response.json();
                setRestaurants(data.restaurants || []);
            } catch (error) {
                console.error(error);
            }
        };

        fetchRestaurants();
    }, []);
    return(
        <>
        <Navbar city={selectedCity.toLowerCase()}/>
        <Banner/>
        <Offers/>
        <Carousel city ={selectedCity.toLowerCase()} restaurants={filteredRestaurants}/>
        <Footer/>
        </>
    );
}


export default Home;