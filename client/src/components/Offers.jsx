import React from 'react';
import offers30 from '../assets/offers30.jpg';
import offers25 from '../assets/offers25.jpg';
import offers20 from '../assets/offers20.jpg';
import offers15 from '../assets/offers15.jpg';

function Offers() {
  return (
    <>
      <section className='bestOffers'>
        <h1
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: '1rem',
            textDecoration: 'underline',
          }}
        >
          𝘽𝙚𝙨𝙩 𝙊𝙛𝙛𝙚𝙧𝙨
        </h1>
        <div className='offersActual'>
          <div className='offer'>
            <a href='#' className='offer-link'>
              <img src={offers30} alt='offers30' />
            </a>
          </div>
          <div className='offer'>
            <a href='#' className='offer-link'>
              <img src={offers25} alt='offers25' />
            </a>
          </div>
          <div className='offer'>
            <a href='#' className='offer-link'>
              <img src={offers20} alt='offers20' />
            </a>
          </div>
          <div className='offer'>
            <a href='#' className='offer-link'>
              <img src={offers15} alt='offers15' />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Offers;
