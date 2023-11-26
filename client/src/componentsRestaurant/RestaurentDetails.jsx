import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageLoading from '../componentsOwner/PageLoading';
import LogoutButton from '../componentsOwner/LogoutButton';
import { MdDelete } from "react-icons/md";
import { AiFillHome, AiTwotoneEdit } from "react-icons/ai";
import "../css/resDetailsOwner.css";
import { Buffer } from 'buffer';

const RestaurentDetails = () => {
    const { restaurantId } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                const res = await fetch(`/restaurant/${restaurantId}`);
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
    }, [restaurantId]);

    const handleDelete = async () => {
        try {
            const res = await fetch(`/delete-restaurant/${restaurantId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 200) {
                window.alert("Restaurant Deleted Successfully.");
                navigate('/owner-home');
            } else if (res.status === 403) {
                setError('Unauthorized Access.');
            } else if (res.status === 404) {
                setError('Restaurant not found.');
            } else {
                setError('Failed to delete restaurant. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setError('Failed to delete restaurant.');
        }
    };


    if (!restaurant) {
        return <><PageLoading link={"/owner-home"} /></>;
    }

    return (
        <>
            <div>
                {error && <p>
                    {error}
                    <br />
                    <Link to="owner-home" className=" icon" title='Back Home'><AiFillHome /></Link>
                </p>}
            </div>
            <div className="headingContainer">
                <div className="Heading">Restaurant Details
                    <Link to="update-restaurant-details" className="editIcon" title='Edit Restaurant Details'>
                        <AiTwotoneEdit  />
                    </Link>
                </div>
                <div className="editIcon">
                    <MdDelete title='Delete Restaurant' onClick={handleDelete} />
                </div>
            </div>
            <div className="containerRes">
                <div className="item">
                    <div className="subHeading">Basic Information</div>
                    <p>Name: {restaurant.name}</p>
                    <p>City: {restaurant.city}</p>
                    <p>Area: {restaurant.area}</p>
                    <p>Location: {restaurant.location}</p>
                    <p>Contact: {restaurant.contactNumber}</p>
                </div>
                <div className="item">
                    <div className="subHeading">Restaurant Details</div>
                    <p>
                        Open:
                        {restaurant.startTime && restaurant.endTime ? (
                            ` ${restaurant.startTime} to ${restaurant.endTime}`
                        ) : restaurant.startTime ? (
                            restaurant.startTime
                        ) : restaurant.endTime ? (
                            restaurant.endTime
                        ) : (
                            'Not Specified'
                        )}
                    </p>
                    <p>Cuisine: {!restaurant.cuisine || restaurant.cuisine == "" ? (
                        "Not Specified"
                    ) : restaurant.cuisine.join(',')
                    }
                    </p>
                    <p>Types: {!restaurant.types || restaurant.types == "" ? (
                        "Not Specified"
                    ) : restaurant.types.join(',')
                    }
                    </p>
                    <p>Offers: {!restaurant.offers || restaurant.offers == "" ? (
                        "Not Specified"
                    ) : restaurant.offers.join(',')
                    }
                    </p>
                </div>
                <div className="item">
                    <div className="subHeading">Images and Menu</div>
                    <p>Images:</p>
                    <div className='fetchedImage'>
                        {restaurant.images ? (
                            restaurant.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={`data:${image.contentType};base64,${Buffer.from(
                                        image.data
                                    ).toString("base64")}`}
                                    alt={`Restaurant ${index + 1}`}
                                />
                            ))
                        ) : (
                            "Not Specified"
                        )}
                    </div>
                    <p>Menus:</p>
                    <div className='fetchedImage'>
                        {restaurant.menu ? (
                            restaurant.menu.map((item, index) => (
                                <img
                                    key={index}
                                    src={`data:${item.contentType};base64,${Buffer.from(
                                        item.data
                                    ).toString("base64")}`}
                                    alt={`Restaurant ${index + 1}`}
                                />
                            ))
                        ) : (
                            "Not Specified"
                        )}
                    </div>
                </div>
                <div className="item">
                    <div className="subHeading">Additional Details</div>
                    <p>Website: {restaurant.website ? (
                        restaurant.website
                    ) : "Not Specified"
                    }
                    </p>
                    <p>Average For 2: {restaurant.averageCostForTwo ? (
                        `₹${restaurant.averageCostForTwo}`
                    ) : "Not Specified"
                    }
                    </p>
                    <p>
                        Extra Discount: {restaurant.extraDiscount && restaurant.extraDiscount.length > 0
                            ? restaurant.extraDiscount.join(',')
                            : "Not Specified"}
                    </p>
                    <p>
                        Amenities: {restaurant.amenities && restaurant.amenities.length > 0
                            ? restaurant.amenities.join(',')
                            : "Not Specified"}
                    </p>

                </div>
            </div>
            <div className="logout-button-container" title='Log Out'>
                <LogoutButton userData />
            </div>
        </>
    );
};

export default RestaurentDetails;
