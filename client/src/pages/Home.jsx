import React from 'react'
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Offers from '../components/Offers';
import Carousel from '../components/Carousel';
import Footer from '../components/Footer';

function Home(){
    return(
        <>
        <Navbar/>
        <Banner/>
        <Offers/>
        <Carousel/>
        <Footer/>
        </>
    );
}


export default Home;