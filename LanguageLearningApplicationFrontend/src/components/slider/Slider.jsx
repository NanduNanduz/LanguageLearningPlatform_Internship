import React, { useState, useEffect , useRef} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import "./Slider.scss";

const Slide = ({ children, slidesToShow, arrowsScroll }) => {
  const [slides, setSlides] = useState(slidesToShow);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth <= 640) {
        setSlides(1);
      } else if (window.innerWidth <= 1024) {
        setSlides(2);
      } else {
        setSlides(slidesToShow);
      }
    };

    updateSlides(); // Set initial value
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, [slidesToShow]);

  return (
    <div className="slide">
      <div className="container">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={slides}
          //navigation={arrowsScroll ? { prevEl: ".custom-prev", nextEl: ".custom-next" } : false}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          pagination={{ clickable: true }}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
        >
          {React.Children.map(children, (child, index) => (
            <SwiperSlide key={index}>{child}</SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        {arrowsScroll && (
          <>
            {/* <button className="custom-prev">&#10094;</button>
            <button className="custom-next">&#10095;</button> */}

          <button ref={prevRef} className="custom-prev">&#10094;</button>
          <button ref={nextRef} className="custom-next">&#10095;</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Slide;