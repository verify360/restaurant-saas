import React from 'react'
import { BsSearch } from "react-icons/bs";

export default function Search() {
    return (
        <>
            <div className ="flex flex-item searchMain">
                <span className ="flex-item restaurantIcon mainColor"><BsSearch /></span>
                <input className ="flex-item restaurantSearch" type="text" id="restaurantSearch" placeholder="Search for Restaurants, Cuisines, Location..." maxLength="50"></input>
                <button className ="restaurantSubmit button flex-item" type="submit" value="restaurantSubmit">Search</button>
            </div>
        </>
    )
}
