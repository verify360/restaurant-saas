import React, { useState } from 'react';
import '../css/reviews.css';
import { FaRegStar, FaStar, FaUserCircle } from 'react-icons/fa';
import { RxCross2 } from "react-icons/rx";
import Signin from './Signin';
import { useNavigate, useParams } from 'react-router-dom';

const Reviews = ({ user, restaurant }) => {

    console.log(restaurant);

    const navigate = useNavigate();

    const resDetails = useParams();

    const [rate, setRate] = useState(0);
    const [fullName, setFullName] = useState('');
    const [comment, setComment] = useState('');
    const [liked, setLiked] = useState('');
    const [disLiked, setDisLiked] = useState('');
    const [canBeImproved, setCanBeImproved] = useState('');

    const [showRate, setShowRate] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const starRatings = [
        { rating: 5, count: 384 },
        { rating: 4, count: 450 },
        { rating: 3, count: 20 },
        { rating: 2, count: 80 },
        { rating: 1, count: 50 },
    ];

    const calculateWidth = (count) => {
        const total = starRatings.reduce((acc, star) => acc + star.count, 0);
        return (count / total) * 100 + '%';
    };

    const handleStarClick = (star) => {
        if (!user) {
            setShowLogin(true);
        } else {
            setRate(star);
            setShowRate(true);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/add-review?restaurantId=${resDetails._id}`, {
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
                    liked,
                    disLiked,
                    canBeImproved
                }),
            });

            if (response.status === 201) {
                window.alert('Review Added successfully');
                setRate(0);
                setShowRate(false);
                navigate(window.location.pathname);
            } else if (response.status === 200) {
                window.alert('Review Updated successfully');
                setRate(0);
                setShowRate(false);
                navigate(window.location.pathname);
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

    return (
        <>
            <div className="rating-container">
                <div className="rating-stat">
                    <div className="stats">
                        <p className="average-rating">4.5  &#9733;</p>
                        <p className="num-ratings">1,234 Ratings</p>
                        <p className="num-reviews">567 Reviews</p>
                    </div>
                    <div className="star-visualization">
                        {starRatings.map((star) => (
                            <div className="star-bar" key={star.rating}>
                                <span className="star-stat"> {star.rating}</span>
                                <span className="star"> &#9733;</span>
                                <div className="fill">
                                    <div className="bar" style={{ width: calculateWidth(star.count) }}></div>
                                </div>
                                <span className="count">{star.count}</span>
                            </div>
                        ))}
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
                <form action="" onSubmit={handleSubmitReview}>
                    <div className="reviews-container reviews-container-input">
                        <div className="profile-logo">
                            <FaUserCircle className='profile-logo-main' />
                        </div>
                        <div className="profile-info">
                            <h4><span>Rated: </span>{rate} &#9733;</h4>

                            <label htmlFor="fullName">Full Name*:</label><br/>
                            <input type="text" id="fullName" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required /><br/>

                            <label htmlFor="comment">Review*:</label><br/>
                            <textarea id="comment" cols="42" rows="3" placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} required></textarea><br/>

                            <label htmlFor="liked">Please tell us, what did you like about this restaurant?</label><br/>
                            <input type="text" id="liked" placeholder="Food, Customer Service, Music, etc." value={liked} onChange={(e) => setLiked(e.target.value)} /><br/>

                            <label htmlFor="disLiked">Please tell us, what did you not like about this restaurant?</label><br/>
                            <input type="text" id="disLiked" placeholder="Food, Customer Service, Music, etc." value={disLiked} onChange={(e) => setDisLiked(e.target.value)} /><br/>

                            <label htmlFor="canBeImproved">Please tell us, what can be improved?</label><br/>
                            <input type="text" id="canBeImproved" placeholder="Food, Customer Service, Music, Ambience, etc." value={canBeImproved} onChange={(e) => setCanBeImproved(e.target.value)} /><br/>

                            <button className='profile-logo-submit' type='submit'>Rate</button>
                        </div>

                        <div className="profile-logo">
                            
                        </div>
                        <RxCross2 className='profile-logo-cancel' onClick={() => { setRate(0); setShowRate(false); }} />
                    </div>
                </form>
            )}
            {showLogin && <Signin onClose={() => setShowLogin(false)} />}
            <div className="reviews-container">
                <div className="profile-logo">
                    <FaUserCircle className='profile-logo-main' />
                </div>
                <div className="profile-info">
                    <h3>Prachi Jain</h3>
                    <h4>5 &#9733;</h4>
                    <p>Lorem ipsum dolor sit,dolorem quo nisi doloremque qui.</p>
                </div>
            </div>
            <div className="reviews-container">
                <div className="profile-logo">
                    <FaUserCircle className='profile-logo-main' />
                </div>
                <div className="profile-info">
                    <h3>Shailesh Mishra</h3>
                    <h4>4 &#9733;</h4>
                    <p>dolorem quo nisi doloremque qui.</p>
                </div>
            </div>
        </>
    );
};

export default Reviews;
