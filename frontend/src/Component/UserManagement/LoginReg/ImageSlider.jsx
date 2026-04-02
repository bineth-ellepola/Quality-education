import React, { useState, useEffect } from "react";
import "./ImageSlider.css";

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Placeholder images - you can replace these with your own image URLs
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=600&h=400&fit=crop",
      title: "Interactive Learning",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      title: "Expert Instructors",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1522202176988-696dba299dd1?w=600&h=400&fit=crop",
      title: "Global Community",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      title: "Flexible Schedule",
    },
  ];

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="image-slider">
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? "active" : ""}`}
          >
            <img src={slide.image} alt={slide.title} />
            <div className="slide-overlay"></div>
            <div className="slide-title">{slide.title}</div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="slider-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
