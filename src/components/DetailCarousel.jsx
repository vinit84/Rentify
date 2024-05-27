import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./DetailCarousel.css"; 

function DetailCarousel({ images }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
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
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="flex flex-col relative max-w-[130rem] mx-auto">
      <div className="mt-10">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className="carousel-slide focus:outline-none ">
              <img
                src={image}
                alt={`Slide ${index}`}
                className="carousel-image"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default DetailCarousel;
