import React from 'react';
import '../css/reviews.css';
import { FaUserCircle } from 'react-icons/fa';

const Reviews = () => {
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
                <div className="rating">
                    dfkn
                </div>
            </div>
            <div className="reviews-container">
                <div className="profile-logo">
                    <FaUserCircle className='profile-logo-main'/>
                </div>
                <div className="profile-info">
                    <h3>Prachi Jain</h3>
                    <h4>5 &#9733;</h4>
                    <p>Lorem ipsum dolor sit,dolorem quo nisi doloremque qui.</p>
                </div>
            </div>
            <div className="reviews-container">
                <div className="profile-logo">
                    <FaUserCircle className='profile-logo-main'/>
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
