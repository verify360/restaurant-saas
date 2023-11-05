import React from 'react'
import Search from './Search';

function Banner() {
    return (
        <>
            <div className="flex searchBanner">
                <h1 className="flex-item heading">Every Bite Speaks Taste, <span className='mainColor'> Flavorful Journey!</span></h1>
                <Search/>
            </div>
        </>
    );
}

export default Banner;
