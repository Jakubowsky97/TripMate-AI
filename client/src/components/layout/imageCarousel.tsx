import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  "/img/carousel/photo1.jpg",
  "/img/carousel/italy.jpg",
  "/img/carousel/photo2.jpg",
  "/img/carousel/plane.jpg",
  "/img/carousel/trip.jpg",
];
``
const ImageCarousel = () => {
  const settings = {
    dots: false,
    infinite: true,
    draggable: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="w-full mx-auto mb-12">
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index}>
            <img
              src={src}
              alt={`Travel ${index + 1}`}
              className="w-full h-96 object-cover shadow-lg"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageCarousel;
