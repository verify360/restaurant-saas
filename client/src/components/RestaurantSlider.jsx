import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import photo1 from '../assets/photo-1.jpeg';
import photo2 from '../assets/photo-2.jpeg';
import photo3 from '../assets/photo-3.jpeg';
import photo4 from '../assets/photo-4.jpeg';
import photo5 from '../assets/photo-5.jpeg';

const RestaurantSlider = () => {
  const settings = {
    dots: true,
    dotsClass: 'slick-dots',
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          dots: true,
        },
      },
    ],
  };

  return (
    <section className='restaurant-slides'>
      <h1
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: '1rem',
          textDecoration:'underline'
        }}
      >
        𝙊𝙪𝙧 𝙘𝙝𝙚𝙛𝙨 & 𝙛𝙤𝙤𝙙
      </h1>
      <Slider {...settings}>
        <img src={photo1} alt='Slide 1' className='restaurant-Img' />

        <img src={photo2} alt='Slide 2' className='restaurant-Img' />

        <img src={photo3} alt='Slide 3' className='restaurant-Img' />

        <img src={photo4} alt='Slide 4' className='restaurant-Img' />

        <img src={photo5} alt='Slide 5' className='restaurant-Img' />
      </Slider>
    </section>
  );
};

export default RestaurantSlider;
