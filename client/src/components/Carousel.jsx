import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Card from './Card';

export default function Carousel() {

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1
    };

    const data = [
        {
            restaurantImg: `/assets/res1.jpeg`,
            restaurantName: `Turin Cafe`,
            restaurantLocation: `Saltlake,Kolkata`,
            restaurantRating: `4.3`,
            discount: NaN,
        },
        {
            restaurantImg: `/assets/res2.jpeg`,
            restaurantName: `Bulbul Cafe`,
            restaurantLocation: `Newtown,Kolkata`,
            restaurantRating: `4.2`,
            discount: NaN,
        },
        {
            restaurantImg: `/assets/res3.jpeg`,
            restaurantName: `Arpan's Rannaghor`,
            restaurantLocation: `Garia,Kolkata`,
            restaurantRating: `4.6`,
            discount: 15,
        },
        {
            restaurantImg: `/assets/res4.jpeg`,
            restaurantName: `Cafe Cafe`,
            restaurantLocation: `Sovabazar,Kolkata`,
            restaurantRating: `4.3`,
            discount: NaN,
        },
        {
            restaurantImg: `/assets/res5.jpeg`,
            restaurantName: `Kolkata Teahouse`,
            restaurantLocation: `College Street,Kolkata`,
            restaurantRating: `4.3`,
            discount: 10,
        },
        {
            restaurantImg: `/assets/res6.jpeg`,
            restaurantName: `Bulbul Cafe`,
            restaurantLocation: `Newtown,Kolkata`,
            restaurantRating: `4.2`,
            discount: NaN,
        },
    ];

    return (
        <>
            <section className="restaurantNearby">
                <div className="restaurantHeader">
                    <h1>Restaurants Near You</h1>
                    <a href="#" className="seeAllLink">See All</a>
                </div>
                <div className="restaurantSlider">
                    <Slider {...settings}>
                        {data.map((d) => (
                            <Card d={d}/>
                        ))}
                    </Slider>
                </div>
            </section>
        </>
    )
}
