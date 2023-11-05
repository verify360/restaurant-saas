import React from 'react'
import logo from "../assets/logo.png"
import Cities from './Cities';
import DynamicMidComponent from './DynamicMidComponent';

export default function Footer() {

    const cities = [
        { cityName: "Delhi" },
        { cityName: "Mumbai" },
        { cityName: "Bangalore" },
        { cityName: "Kolkata" },
        { cityName: "Chennai" },
        { cityName: "Hyderabad" },
        { cityName: "Pune" },
        { cityName: "Ahmedabad" },
        { cityName: "Jaipur" },
        { cityName: "Lucknow" },
        { cityName: "Chandigarh" },
        { cityName: "Bhopal" },
        { cityName: "Indore" },
        { cityName: "Nagpur" },
        { cityName: "Patna" },
        { cityName: "Kanpur" },
        { cityName: "Agra" },
        { cityName: "Varanasi" },
        { cityName: "Coimbatore" },
        { cityName: "Visakhapatnam" },
    ];

    const midSections = [
        {
          title: 'Discover',
          items: ['Trending Restaurants']
        },
        {
          title: 'About',
          items: ['About Us', 'Blog', 'Terms & Conditions', 'Privacy Policy']
        },
        {
          title: 'Top Cuisines',
          items: ['Chinese', 'Italian', 'South Indian', 'Mexican', 'Continental', 'Mughlai']
        },
        {
          title: 'Top Facilities',
          items: ['Fine Dining', '5 Star', 'Sea Food']
        },
        {
          title: 'Top Locations',
          items: ['Park Street', 'Salt Lake City', 'Howrah', 'New Town', 'Kalighat', 'Esplanade']
        }
      ];
    
      return (
        <>
          <div className="footer">
            <Cities data={cities} />
            <div className="footerMid">
              {midSections.map((section, index) => (
                <DynamicMidComponent key={index} title={section.title} items={section.items} />
              ))}
            </div>
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
          </div>
        </>
      );
    }