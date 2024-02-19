import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Buffer } from 'buffer';
import { auth } from '../firebase';
import Navbar from '../components/Navbar';
import "../css/history.css";
import { CiFilter } from 'react-icons/ci';
import { RiImageAddLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { useCity } from '../CityContext';
import logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom';

const History = () => {

    const [user] = useAuthState(auth);

    const navigate = useNavigate();
    const { selectedCity, setSelectedCity } = useCity();

    const [bookingDetails, setBookingDetails] = useState([]);
    const [reviewDetails, setReviewDetails] = useState([])
    const [userDetails, setUserDetails] = useState("")
    const [restaurantNames, setRestaurantNames] = useState([]);
    const [restaurantCity, setRestaurantCity] = useState([]);
    const [restaurantArea, setRestaurantArea] = useState([]);

    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [showImageInput, setShowImageInput] = useState(false);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await fetch(`/user-info?userEmail=${user.email}`);
                if (res.ok) {
                    const data = await res.json();
                    setUserDetails(data);

                } else {
                    console.error('Failed to fetch user details');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (user) {
            fetchUserDetails();
        }
    }, [user]);

    useEffect(() => {
        const fetchReviewsDetails = async () => {
            try {
                const res = await fetch(`/reviews?userEmail=${user.email}`);
                if (res.ok) {
                    const data = await res.json();
                    setReviewDetails(data);

                } else {
                    console.error('Failed to fetch review details');
                }
            } catch (error) {
                console.error('Error fetching review details:', error);
            }
        };

        if (user) {
            fetchReviewsDetails();
        }
    }, [user]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const promises = reviewDetails.map(async (review) => {
                    const response = await fetch(`/restaurants-names?_id=${review.restaurant}`);
                    if (response.status === 200) {
                        const data = await response.json();
                        return {
                            name: data.restaurants.name,
                            city: data.restaurants.city,
                            area: data.restaurants.area
                        };
                    } else {
                        console.error('Failed to fetch restaurant details');
                        return null;
                    }
                });

                // Wait for all promises to resolve
                const restaurantDetails = await Promise.all(promises.filter(Boolean));

                // Extract names, cities, and areas separately
                const names = restaurantDetails.map(details => details.name);
                const cities = restaurantDetails.map(details => details.city);
                const areas = restaurantDetails.map(details => details.area);

                // Update the state with the extracted data
                setRestaurantNames(names);
                setRestaurantCity(cities);
                setRestaurantArea(areas);
            } catch (error) {
                console.error('Error fetching restaurant details:', error);
            }
        };

        if (reviewDetails.length > 0) {
            fetchRestaurants();
        }
    }, [reviewDetails]);


    const handleFilter = () => {
        setShowFilterOptions(!showFilterOptions);
    };

    const handleFilterOptionClick = (option) => {
        setFilter(option);
        setShowFilterOptions(false);
    };

    const filteredReservations = bookingDetails.filter((booking) => {
        switch (filter.toLowerCase()) {
            case 'all':
                return true;
            case 'pending':
                return booking.status === 'Pending';
            case 'confirmed':
                return booking.status === 'Confirmed';
            case 'cancelled':
                return booking.status === 'Cancelled';
            case 'unattended':
                return booking.status === 'Unattended';
            case 'fulfilled':
                return booking.status === 'Fulfilled';
            default:
                return true;
        }
    });

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const res = await fetch(`/bookings?userEmail=${user.email}`);
                if (res.ok) {
                    const data = await res.json();
                    setBookingDetails(data);
                } else {
                    console.error('Failed to fetch booking details');
                }
            } catch (error) {
                console.error('Error fetching booking details:', error);
            }
        };

        if (user) {
            fetchBookingDetails();
        }
    }, [user]);

    const handleCancelBooking = async (bookingId) => {
        try {
            const res = await fetch(`/bookings/${bookingId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                window.alert("Reservation Cancelled Successfully.")
                setBookingDetails(prevDetails => prevDetails.map(booking => {
                    if (booking._id === bookingId) {
                        return { ...booking, status: 'Cancelled' };
                    }
                    return booking;
                }));
            } else {
                console.error('Failed to cancel booking');
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
        }
    };

    const getStatusCircleColor = (status) => {
        switch (status) {
            case 'Pending':
                return '#ffcc00'; // Yellow
            case 'Confirmed':
                return '#00cc00'; // Green
            case 'Cancelled':
                return '#cc0000'; // Red
            case 'Fulfilled':
                return '#0066cc'; // Blue
            case 'Unattended':
                return '#cccccc';
            default:
                return '#000000'; // Black (default)
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch(`/upload-image?userEmail=${user.email}`, {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                window.alert('Image uploaded successfully');
                window.location.reload();
            } else {
                window.alert('Failed to upload image');
            }
        } catch (error) {
            window.alert('Error uploading image:', error);
        }
    };

    const handleEditClick = async (index, rating, resId, fullName, comment) => {
        const cleanedName = restaurantNames[restaurantNames.length - 1 - index].replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
        const cleanedCity = restaurantCity[restaurantCity.length - 1 - index].replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
        const cleanedArea = restaurantArea[restaurantArea.length - 1 - index].replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();

        const url = `/${cleanedCity}-restaurants/${cleanedArea}/${cleanedName}/${resId}?ratingD=${encodeURIComponent(rating)}&fullNameD=${encodeURIComponent(fullName)}&commentD=${encodeURIComponent(comment)}`;

        navigate(url);
    };

    return (
        <>
            <Navbar city={selectedCity.toLowerCase()}
                onSelectCity={setSelectedCity}
                onCityChangeRedirect={(selectedCity) => {
                    navigate(`/${selectedCity.toLowerCase()}`);
                }} />
            <div className="profile-container">
                <div className="profile-main-cont">
                    {userDetails ? (
                        <>
                            <div className="profile-image">
                                {userDetails.image && userDetails.image !== undefined ? (
                                    <img className="profile-image"
                                        src={`data:${userDetails.image.contentType};base64,${Buffer.from(userDetails.image.data).toString('base64')}`}
                                        alt={`${userDetails.fullName}`}
                                    />
                                ) : (
                                    <RiImageAddLine className="profile-image-icon" onClick={() => setShowImageInput(true)} title='Add Photo' />
                                )
                                }
                            </div>
                            {showImageInput && (
                                <div className='overlay'>
                                    <div className="profile-image-input">
                                        <div>
                                            <label>Upload Profile Image:</label><br /><br />
                                            <input type="file" name="images" accept="image/*" onChange={handleImageChange} />
                                        </div>
                                        <RxCross2 className="profile-image-cross" onClick={() => setShowImageInput(false)} />
                                    </div>
                                </div>
                            )}
                            <div className="profile-information">
                                <div>Username/Email: {userDetails.userEmail}</div>
                                <div>Profile Name: {userDetails.fullName}</div>
                                {userDetails.phoneNumber && (
                                    <div>Contact Number: {userDetails.phoneNumber}</div>
                                )}
                            </div>
                        </>
                    ) : ""}
                </div>
                <div className='history-container profile-container-bb'>
                    <span className='history-filter' title='Filter' onClick={handleFilter} ><CiFilter /></span>
                    {showFilterOptions && (
                        <div className="filterOptions historyFilterOptions" onClick={(e) => handleFilterOptionClick(e.target.innerText)}>
                            <div>All</div>
                            <div>Pending</div>
                            <div>Confirmed</div>
                            <div>Cancelled</div>
                            <div>Unattended</div>
                            <div>Fulfilled</div>
                        </div>
                    )}
                    <h1 style={{color: '#00635A'}}>Booking History</h1>
                    {filteredReservations.length === 0 ? (
                        <p className='history-not-found'>No {filter === "All" ? " " : filter} Reservations Found.</p>
                    ) : (
                        <div className='history-list'>
                            {[...filteredReservations].reverse().map((booking) => (
                                <div key={booking._id} className='history-items'>
                                    <div className='history-item' title={`Reservation ${booking.status}`}>
                                        <span
                                            style={{
                                                backgroundColor: getStatusCircleColor(booking.status),
                                            }}
                                        />
                                        <div>
                                            <strong>Status:</strong> {booking.status}
                                        </div>
                                        <div>
                                            <strong>Reserved on:</strong> {booking.bookingDate}
                                        </div>
                                        <div>
                                            <strong>Time of Arrival:</strong> {booking.entryTime}
                                        </div>
                                        <div title={`${booking.restaurantName}`}>
                                            <strong>Restaurant:</strong> {booking.restaurantName.slice(0, 15)}
                                        </div>
                                        <div>
                                            <strong>Party Size:</strong> {booking.numberOfPeople}
                                        </div>
                                        <div title={`${booking.specialRequest}`}>
                                            <strong>Special Requests:</strong> {booking.specialRequest ? booking.specialRequest.slice(0, 10) : 'N/A'}
                                        </div>
                                        <div>
                                            <strong>Booked At:</strong> {new Date(booking.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </div>
                                    </div>
                                    {booking.status === 'Pending' || booking.status === 'Confirmed' ? (
                                        <button className='history-button' type='button' onClick={() => handleCancelBooking(booking._id)} title='Cancel Reservation'>Cancel</button>
                                    ) : (
                                        <button className='history-button' type='button' disabled >Cancel</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className='history-container'>
                    <h1 style={{color:'#00635A'}}>My Reviews</h1>
                    {reviewDetails.length === 0 ? (
                        <p className='history-not-found'>No Reviews Found.</p>
                    ) : (
                        <div className='history-list'>
                            {
                                [...reviewDetails].reverse().map((rate, index) => (
                                    <div className='history-items' key={index}>
                                        <div className='history-item'>
                                            <span>{reviewDetails.length - index}.</span>
                                            <div>
                                                <strong>Restaurant Name:</strong> {restaurantNames[restaurantNames.length - 1 - index]}
                                            </div>
                                            <div>
                                                <strong>Rated:</strong> {rate.rating}
                                            </div>
                                            <div>
                                                {rate.liked ? (
                                                    <strong>Liked:</strong>
                                                ) : rate.disLiked ? (
                                                    <strong>Disliked:</strong>
                                                ) : rate.canBeImproved ? (
                                                    <strong>Suggested for Betterment :</strong>
                                                ) : (
                                                    ""
                                                )}
                                                {rate.liked || rate.disLiked || rate.canBeImproved ? ` ${rate.liked || rate.disLiked || rate.canBeImproved}` : ""}
                                            </div>

                                            <div title={`${rate.comment}`}>
                                                <strong>Reviews:</strong> {rate.comment ? rate.comment.slice(0, 30) : 'N/A'}
                                            </div>
                                            <div>
                                                <strong>Posted on:</strong> {new Date(rate.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </div>
                                        </div>
                                        {restaurantCity[restaurantCity.length - 1 - index] &&
                                            restaurantArea[restaurantArea.length - 1 - index] &&
                                            restaurantNames[restaurantNames.length - 1 - index] &&
                                            rate.restaurant &&
                                            (
                                                <button
                                                    className='history-button'
                                                    title='Edit Response'
                                                    onClick={() => handleEditClick(index, rate.rating, rate.restaurant, rate.fullName, rate.comment)}
                                                >
                                                    Edit
                                                </button>
                                            )
                                        }
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div >
            <div className="footerBottom flex">
                <div className="mainColor flex-item logo">
                    <img src={logo} alt="" />
                </div>
                <div className="flex-item">
                    <p>Every Bite Speaks Taste, Flavorful Journey</p>
                </div>
                <div className="flex-item">Write to us at: <strong>tasteandflavor@gmail.com</strong></div>
                <div className="flex-item">
                    <p>© 2023 - Taste&Flavor All Rights Reserved</p>
                </div>
            </div>
        </>
    )
}

export default History;
