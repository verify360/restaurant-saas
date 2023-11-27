import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../css/history.css";

const History = () => {

    const [user] = useAuthState(auth);

    const [bookingDetails, setBookingDetails] = useState([]);

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
                // Update the local state to reflect the cancellation
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


    return (
        <>
            <Navbar />
            <div className='history-container'>
                <h1>Booking History</h1>
                {bookingDetails.length === 0 ? (
                    <p className='history-not-found'>No bookings found.</p>
                ) : (
                    <div className='history-list'>
                        {bookingDetails.map((booking) => (
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
                                    <div>
                                        <strong>Restaurant:</strong> {booking.restaurantName.slice(0, 15)}
                                    </div>
                                    <div>
                                        <strong>Party Size:</strong> {booking.numberOfPeople}
                                    </div>
                                    <div>
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
            <Footer />
        </>
    )
}

export default History;
