import React, { useEffect, useState } from 'react';
import '../css/reviews.css';
import { FaRegStar, FaStar, FaUserCircle } from 'react-icons/fa';
import Signin from './Signin';

const Reviews = ({ user, restaurant, onReviewsData }) => {

    const [reviewDetails, setReviewDetails] = useState([])

    const [rate, setRate] = useState(0);
    const [fullName, setFullName] = useState('');
    const [comment, setComment] = useState('');

    const [selectedDisliked, setSelectedDisliked] = useState([]);
    const [selectedCanBeImproved, setSelectedCanBeImproved] = useState([]);
    const [selectedLiked, setSelectedLiked] = useState([]);

    const [showRate, setShowRate] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const handleStarClick = (star) => {
        if (!user) {
            setShowLogin(true);
        } else {
            setRate(star);
            setShowRate(true);
        }
    };

    useEffect(() => {
        const fetchReviewsDetails = async () => {
            try {
                const res = await fetch(`/reviews?restaurantId=${restaurant._id}`);
                if (res.ok) {
                    const data = await res.json();
                    setReviewDetails(data);

                    const averageRating = data.length > 0
                        ? data.reduce((sum, review) => sum + review.rating, 0) / data.length
                        : 0;

                    const totalReviews = data.filter(review => review.comment).length;

                    // Call the callback function with the calculated values
                    onReviewsData(averageRating, totalReviews);
                } else {
                    console.error('Failed to fetch booking details');
                }
            } catch (error) {
                console.error('Error fetching booking details:', error);
            }
        };

        if (restaurant) {
            fetchReviewsDetails();
        }
    }, [restaurant, onReviewsData]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/add-review?restaurantId=${restaurant._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: user.email,
                    creationTime: user.metadata.creationTime,
                    lastSignInTime: user.metadata.lastSignInTime,
                    fullName,
                    rating: rate,
                    comment,
                    liked: selectedLiked.join(','),
                    disLiked: selectedDisliked.join(','),
                    canBeImproved: selectedCanBeImproved.join(','),
                }),
            });

            if (response.status === 201) {
                window.alert('Review Added successfully');
                window.location.reload();
            } else if (response.status === 200) {
                window.alert('Review Updated successfully');
                window.location.reload();
            } else if (response.status === 402) {
                window.alert('Some Attributes may Missing.');
            } else if (response.status === 404) {
                window.alert('Restaurant not Found.');
            } else {
                window.alert('Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleListItemClick = (item, category) => {
        // Update the selected items based on the category
        switch (category) {
            case 'disliked':
                setSelectedDisliked((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
                break;
            case 'canBeImproved':
                setSelectedCanBeImproved((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
                break;
            case 'liked':
                setSelectedLiked((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
                break;
            default:
                break;
        }
    };

    const getStarColor = (rating) => {
        switch (rating) {
            case 1:
                return '#e74c3c';
            case 2:
                return '#e67e22';
            case 3:
                return '#f39c12';
            case 4:
                return '#b3ca42';
            case 5:
                return '#27ae60';
            default:
                return '#000'; // default color if rating is not in the expected range
        }
    };

    const totalRatings = reviewDetails.length;
    const totalReviews = reviewDetails.filter(review => review.comment).length;
    const averageRating = totalRatings > 0
        ? reviewDetails.reduce((sum, review) => sum + review.rating, 0) / totalRatings
        : 0;

    const getRatingCount = (rating) => {
        return reviewDetails.filter((review) => review.rating === rating).length;
    };

    const calculateWidth = (rating) => {
        const count = getRatingCount(rating);
        const total = reviewDetails.length;
        return (count / total) * 100 + '%';
    };

    return (
        <>
            <div className="rating-container">
                <div className="rating-stat">
                    {averageRating != 0 && (
                        <div className="stats">
                            <p className="average-rating">{averageRating.toFixed(1)}  &#9733;</p>
                            <p className="num-ratings">{totalRatings} Ratings</p>
                            <p className="num-reviews">{totalReviews ? totalReviews : "No"} Reviews</p>
                        </div>
                    )}
                    <div className="star-visualization">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = getRatingCount(rating);
                            const total = reviewDetails.length;

                            return (
                                <div className="star-bar" key={rating}>
                                    <span className="star-stat"> {rating}</span>
                                    <span className="star"> &#9733;</span>
                                    <div className="fill">
                                        <div className="bar" style={{ width: total > 0 ? calculateWidth(rating) : 0 }}></div>
                                    </div>
                                    <span className="count">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="rating-input">
                    <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <div
                                key={star}
                                className="rating-star"
                                onClick={() => handleStarClick(star)} >
                                {rate >= star ? (
                                    <FaStar style={{ color: '#5ba727' }} />
                                ) : (
                                    <FaRegStar />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="rating-items">Rate This Place</div>
                </div>
            </div>
            {showRate && (
                <form action="POST">
                    <div className="reviews-input-container">
                        <div className='reviews-input-container-info'>
                            <div className="reviews-input-container-item-1">
                                <div className="reviews-input-container-stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <div
                                            key={star}
                                            className="rating-overlay-star"
                                            onClick={() => handleStarClick(star)} >
                                            {rate >= star ? (
                                                <FaStar style={{ color: '#2b98f7' }} />
                                            ) : (
                                                <FaStar />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="reviews-input-container-adj">
                                    {rate === 1 ? "Terrible" :
                                        rate === 2 ? "Bad" :
                                            rate === 3 ? "Ok" :
                                                rate === 4 ? "Good" :
                                                    rate === 5 ? "Excellent" : ""
                                    }
                                </div>
                            </div>
                            <div className="reviews-input-container-item-2">
                                {/* Update JSX for rendering list items */}
                                {rate >= 1 && rate <= 2 && (
                                    <>
                                        <div className="reviews-input-container-head">What went wrong?</div>
                                        <div className="reviews-input-container-flex">
                                            {["Too Crowded", "Food", "Customer Service", "Music", "Discount"].map((item) => (
                                                <li
                                                    key={item}
                                                    className={selectedDisliked.includes(item) ? 'selected' : ''}
                                                    onClick={() => handleListItemClick(item, 'disliked')}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {rate === 3 && (
                                    <>
                                        <div className="reviews-input-container-head">What could be better?</div>
                                        <div className="reviews-input-container-flex">
                                            {["Table Position", "Food", "Customer Service", "Music", "Ambience"].map((item) => (
                                                <li
                                                    key={item}
                                                    className={selectedCanBeImproved.includes(item) ? 'selected' : ''}
                                                    onClick={() => handleListItemClick(item, 'canBeImproved')}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {rate >= 4 && rate <= 5 && (
                                    <>
                                        <div className="reviews-input-container-head">What did you like?</div>
                                        <div className="reviews-input-container-flex">
                                            {["Food", "Customer Service", "Music", "Ambience"].map((item) => (
                                                <li
                                                    key={item}
                                                    className={selectedLiked.includes(item) ? 'selected' : ''}
                                                    onClick={() => handleListItemClick(item, 'liked')}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </div>
                                    </>
                                )}

                            </div>
                            <div className="reviews-input-container-item-3">
                                <input type="text" id="fullName" placeholder="Tell us your name (required)" value={fullName} onChange={(e) => setFullName(e.target.value)} required /><br />
                                <textarea id="comment" cols="42" rows="5" placeholder={`Tell us about your experience at ${restaurant.name}`} value={comment} onChange={(e) => setComment(e.target.value)}></textarea><br />
                            </div>
                            <div className="reviews-input-container-item-4" onClick={handleSubmitReview}>
                                Rate
                            </div>
                        </div>
                        <div className='profile-logo-cancel' onClick={() => { setRate(0); setShowRate(false); }}>×</div>
                    </div>
                </form>
            )}
            {showLogin && <Signin onClose={() => setShowLogin(false)} />}
            {reviewDetails ? (
                reviewDetails.map((r) => (
                    <div className="reviews-container">
                        <div className="profile-logo">
                            <FaUserCircle className='profile-logo-main' />
                        </div>
                        <div className="profile-info">
                            <h3>{r.fullName}</h3>
                            <h4 style={{ color: getStarColor(r.rating) }}>{r.rating} &#9733;</h4>
                            <h5>
                                {r.liked ? `Liked: ${r.liked}` : r.disLiked ? `Disliked: ${r.disLiked}` : r.canBeImproved ? `Could be better: ${r.canBeImproved}` : ""}
                            </h5>
                            <p>{r.comment}</p>
                        </div>
                    </div>
                ))
            ) : ""}

        </>
    );
};

export default Reviews;
