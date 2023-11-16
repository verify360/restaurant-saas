import React from 'react';
import SimpleImageSlider from "react-simple-image-slider";
import { Buffer } from 'buffer';
import "../css/restaurant.css";
import { Link } from 'react-router-dom';
import { FaKitchenSet } from "react-icons/fa6";
import { TbToolsKitchen2 } from "react-icons/tb";
import { MdAcUnit, MdCurrencyRupee, MdOutlineDiscount, MdOutlineFeaturedPlayList } from "react-icons/md";

const ResDetails = ({ restaurant }) => {
    if (!restaurant) {
        return <div>Loading...Please Wait</div>;
    }

    const images = restaurant.images.map((image) => ({
        url: `data:${image.contentType};base64,${Buffer.from(image.data).toString('base64')}`,
    }));

    const amenityIcons = {
        Wifi: false,
        Parking: false,
        AC: <MdAcUnit />,
        PetsAllowed: false,
        OutdoorSeating: false,
        CardsAccepted: false,
        WalletAccepted: false,
        HomeDelivery: false,
        ValetAvailable: false,
        RoofTop: false,
        FullBarAvailable: false,
        Lift: false,
        SmokingArea: false,
        LivePerformance: false,
        LiveScreening: false,
    };

    const amenityLinks = Object.keys(restaurant.amenities).map((amenity) => (
        restaurant.amenities[amenity] && (
            <div key={amenity} className="resFeature">
                <div className="resFeatureIcon">
                    {amenityIcons[amenity]}
                </div>
                <Link
                    to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}/${restaurant.location.toLowerCase().replace(/\s+/g, '-')}/${amenity.toLowerCase().replace(/\s+/g, '-')}`}
                >
                    {amenity}
                </Link>
            </div>
        )
    ));

    return (
        <>
            <div className="resMainUrls">
                <Link className='url' to={"/"}> Taste&Flavor {'>'} </Link>
                <Link className='url' to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants`}> {restaurant.city} {'>'} </Link>
                <Link className='url' to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}`}> {restaurant.area} {'>'} </Link>
                <Link className='url' to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}/${restaurant.location.toLowerCase().replace(/\s+/g, '-')}`}> {restaurant.location} {'>'} </Link>
                {restaurant.name}
            </div>
            <div className='resMainImages'>
                <SimpleImageSlider width={810} height={445} images={images} showBullets={true} showNavs={true} />
            </div>
            <div className="resMainDetails">
                <div className="resMainInfo">
                    <h1>{restaurant.name}</h1>
                    <div className="resMainInfos">
                        ₹{restaurant.averageCostForTwo ? restaurant.averageCostForTwo : 999} for 2 |{" "}
                        {restaurant.cuisine.map((a, index) => (
                            <React.Fragment key={a}>
                                {index > 0 && ", "}
                                <Link
                                    to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}/${restaurant.location.toLowerCase().replace(/\s+/g, '-')}/${a.toLowerCase().replace(/\s+/g, '-')}-cuisine`}
                                >
                                    {a}
                                </Link>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="resMainInfos">
                        <Link to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}/${restaurant.location.toLowerCase().replace(/\s+/g, '-')}`}>{restaurant.location}</Link> |{" "}
                        <Link to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}`}>{restaurant.area}</Link> |{" "}
                        <Link to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants`}>{restaurant.city}</Link>
                    </div>
                    <div className="resMainInfos">Time: Opens at {restaurant.startTime}</div>
                </div>
                <div className="resMainRating">
                    <div className="textRating">4.0</div>
                    <div className="numberRating">34 reviews</div>
                </div>
            </div>
            <div className="resMainSchema">
                <div className="resMainSchemas"><h1>Overview</h1></div>
                <div className="resMainSchemas"><h1>Menu</h1></div>
                <div className="resMainSchemas"><h1>About</h1></div>
                <div className="resMainSchemas"><h1>Reviews (34)</h1></div>
                <div className="resMainSchemas"><h1>Help</h1></div>
            </div>
            <div className="resMainMenu">
                <h1>Menu</h1>
                {restaurant.menu && restaurant.menu != "" && restaurant.menu.map((menuImage, index) => (
                    <img
                        key={index}
                        src={`data:${menuImage.contentType};base64,${Buffer.from(menuImage.data).toString('base64')}`}
                        alt={`Menu Image ${index + 1}`}
                    />
                ))}
            </div>
            <div className="resMainAbout">
                <h1>About</h1>
                <div className="resMainAboutInfo">
                    <div className="resMainAboutInfos">
                        <div className="resMainAboutIcon">
                            <FaKitchenSet />
                        </div>
                        <div className="resMainAboutContent">
                            <h3>CUISINE</h3>
                            {restaurant.cuisine.map((a, index) => (
                                <React.Fragment key={a}>
                                    {index > 0 && ", "}
                                    <Link
                                        to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}/${restaurant.location.toLowerCase().replace(/\s+/g, '-')}/${a.toLowerCase().replace(/\s+/g, '-')}-cuisine`}
                                    >
                                        {a}
                                    </Link>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="resMainAboutInfos">
                        <div className="resMainAboutIcon">
                            <TbToolsKitchen2 />
                        </div>
                        <div className="resMainAboutContent">
                            <h3>TYPE</h3>
                            {restaurant.types.map((a, index) => (
                                <React.Fragment key={a}>
                                    {index > 0 && ", "}
                                    {a}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="resMainAboutInfos">
                        <div className="resMainAboutIcon">
                            <MdCurrencyRupee />
                        </div>
                        <div className="resMainAboutContent">
                            <h3>AVERAGE COST</h3>
                            {restaurant.averageCostForTwo} for two people
                        </div>
                    </div>
                    <div className="resMainAboutInfos">
                        <div className="resMainAboutIcon">
                            <MdOutlineDiscount />
                        </div>
                        <div className="resMainAboutContent">
                            <h3>OFFER</h3>
                            {restaurant.offers.map((a, index) => (
                                <React.Fragment key={a}>
                                    {index > 0 && ", "}
                                    {a}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    {restaurant.amenities && restaurant.amenities != " " && (
                        <div>
                            <div className="resMainAboutInfos">
                                <div className="resMainAboutIcon">
                                    <MdOutlineFeaturedPlayList />
                                </div>
                                <div className="resMainAboutContent">
                                    <h3>FACILITIES & FEATURES</h3>
                                </div>
                            </div>
                            <div className="resFeatures">
                                {restaurant.amenities.map((a, index) => (
                                    <div key={a} className="resFeature">
                                        <div className="resFeatureIcon">
                                            {amenityIcons[a]}
                                        </div>
                                        <Link
                                            to={`/${restaurant.city.toLowerCase().replace(/\s+/g, '-')}-restaurants/${restaurant.area.toLowerCase().replace(/\s+/g, '-')}/${restaurant.location.toLowerCase().replace(/\s+/g, '-')}/${a.toLowerCase().replace(/\s+/g, '-')}`}
                                        >
                                            {a === "AC" ? "Air Conditioned" :
                                                a === "OutdoorSeating" ? "Outdoor Seating" :
                                                    a === "PetsAllowed" ? "Pets Allowed" :
                                                        a === "CardsAccepted" ? "Cards Accepted" :
                                                            a === "WalletAccepted" ? "Wallet Accepted" :
                                                                a === "HomeDelivery" ? "Home Delivery" :
                                                                    a === "ValetAvailable" ? "Valet Available" :
                                                                        a === "RoofTop" ? "Roof Top" :
                                                                            a === "SmokingArea" ? "Smoking Area" :
                                                                                a === "FullBarAvailable" ? "Full Bar Available" :
                                                                                    a === "LivePerformance" ? "Live Performance" :
                                                                                        a === "LiveScreening" ? "Live Screening" : a
                                            }
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ResDetails;
