import React from 'react'
import {MdDiscount} from "react-icons/md";

export default function Card({d}) {
    return (
        <>
            <div className='restaurant' title={d.restaurantName} onClick={() => {
                const cleanedName = d.restaurantName
                    .replace(/[^a-zA-Z]/g, '-')
                    .toLowerCase();

                const cleanedLocation = d.restaurantLocation
                    .replace(/[^a-zA-Z]/g, '-')
                    .toLowerCase();

                const url = `/${cleanedName}-${cleanedLocation}`;
                window.location.href = url;
            }}>
                <div className="restaurantImg"><img src={d.restaurantImg} alt={d.restaurantName} /></div>
                <div className="restaurantDescription">
                    <div className='restaurantDes1'>
                        <h4 className="restaurantName">{d.restaurantName}</h4>
                        <p className="restaurantLocation">{d.restaurantLocation}</p>
                    </div>
                    <div className='restaurantDes2'>
                        <p className="restaurantRating">{d.restaurantRating}</p>
                    </div>
                </div>
                {typeof d.discount === 'number' && !isNaN(d.discount) ? (
                    <div className="discount">
                        <span>
                            <MdDiscount />{' '}
                            {' '}{d.discount}% Off the Total Bill
                        </span>
                    </div>
                ) : (
                    ""
                )}
            </div>
        </>
    )
}
