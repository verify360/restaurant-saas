import React, { useState, useEffect } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Card from './Card';

export default function Carousel() {
    const [restaurants, setRestaurants] = useState([]);

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

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1
    };

    return (
        <>
            <section className="restaurantNearby">
                <div className="restaurantHeader">
                    <h1>Restaurants Near You</h1>
                    <a href="#" className="seeAllLink">See All</a>
                </div>
                <div className="restaurantSlider">
                    <Slider {...settings}>
                        {restaurants.map((restaurant, index) => (
                            <Card key={index} restaurant={restaurant} />
                        ))}
                    </Slider>
                </div>
            </section>
        </>
    );
}
