import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function NextArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        right: 10,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        cursor: "pointer",
        background: "rgba(0,0,0,0.4)",
        borderRadius: "50%",
        padding: "8px",
      }}
    >
      <FaChevronRight color="white" size={20} />
    </div>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        left: 10,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        cursor: "pointer",
        background: "rgba(0,0,0,0.4)",
        borderRadius: "50%",
        padding: "8px",
      }}
    >
      <FaChevronLeft color="white" size={20} />
    </div>
  );
}

export default function HotelImagesCarousel({ hotel }) {
  if (!hotel?.hotelImageLinks?.length) return null;

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  
  };

  return (
    <Slider {...settings}>
      {hotel.hotelImageLinks.map((img, i) => (
        <div key={i} style={{ padding: "0 5px", position: "relative" }}>
          <Image
            src={img.imageLink}
            alt={img.imageType || `Hotel Image ${i + 1}`}
            width={400}
            height={300}
            style={{ objectFit: "contain", width: "100%", height: "300px" }}
            loading="lazy"
          />
        </div>
      ))}
    </Slider>
  );
}
