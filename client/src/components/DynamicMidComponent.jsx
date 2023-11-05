import React from 'react';

export default function DynamicMidComponent({ title, items }) {
  return (
    <>
      <div className="dynamicMid">
        <h4 className="subHeading">{title}</h4>
        <ul className="dynamicMidComponent">
          {items.map((item, index) => {
            const cleanedItem = item
              .toLowerCase()
              .replace(/[^a-zA-Z]/g, '-')
              .replace(/--+/g, '-');

            const url = `/${cleanedItem}`;

            return (
              <li key={index}>
                <a href={url}>{item}</a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
