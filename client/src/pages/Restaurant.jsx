import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../components/Navbar";
import ResDetails from "../components/ResDetails";
import "../css/restaurant.css";

export default function Restaurant() {
    const { city, area, name, _id } = useParams();
    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                const res = await fetch(`http://localhost:5000/${city}/${area}/${name}/${_id}`);
                const data = await res.json();

                if (res.status === 200) {
                    setRestaurant(data.restaurant);
                } else if (res.status === 403) {
                    window.alert("Unauthorized Access.");
                } else {
                    console.error('Failed to fetch restaurant details');
                }
            } catch (error) {
                console.error('Error fetching restaurant details:', error);
            }
        };

        fetchRestaurantDetails();
    }, [_id, area, city, name]);

    if (!_id) {
        return <div>No restaurant data available.</div>;
    }

    return (
        <>
            <Navbar />
            <div className="resMain">
                <div className="resMainOne">
                    <ResDetails restaurant={restaurant} />
                </div>
                <div className="resMainTwo">

                </div>
            </div>
        </>
    );
}
