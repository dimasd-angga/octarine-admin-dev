"use client";
import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import styles from "@/components/homes/DiscoverYourScent/HeroBanner.module.scss";
import Link from "next/link";

// TikTok videos data
const tiktokVideos = [
  {
    id: 1,
    videoSrc: "/video/octarine.official_1.mp4",
    wowDelay: "0s",
    title: "Dari konsep sampai ke publish"
  },
  {
    id: 2,
    videoSrc: "/video/octarine.official_2.mp4",
    wowDelay: "0.1s",
    title: "Next kita undang siapa?"
  },
  {
    id: 3,
    videoSrc: "/video/octarine.official_3.mp4",
    wowDelay: "0.2s",
    title: "Pilihan yang sulit"
  },
  {
    id: 4,
    videoSrc: "/video/octarine.official_4.mp4",
    wowDelay: "0.3s",
    title: "Varian favorite kalian ada yang disebut bang @Garry Ang gak?"
  },
];

export default function Tiktok({ parentClass = "flat-spacing pt-0" }) {
  const videoRefs = useRef([]);
  const slideshowVideoRef = useRef(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(null);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const handleMouseEnter = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (video) {
        if (i === index) {
          video.play();
          setActiveVideoIndex(index);
        } else {
          video.pause();
        }
      }
    });
  };

  const handleMouseLeave = () => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
      }
    });
    setActiveVideoIndex(null);
  };

  const handleVideoClick = (index) => {
    setCurrentSlide(index);
    setShowSlideshow(true);
    setProgress(0);
    setCurrentTime(0);
    // Pause all grid videos
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
      }
    });
  };

  const closeSlideshow = () => {
    setShowSlideshow(false);
    if (slideshowVideoRef.current) {
      slideshowVideoRef.current.pause();
    }
    setProgress(0);
    setCurrentTime(0);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % tiktokVideos.length);
    setProgress(0);
    setCurrentTime(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + tiktokVideos.length) % tiktokVideos.length);
    setProgress(0);
    setCurrentTime(0);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setProgress(0);
    setCurrentTime(0);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showSlideshow) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextSlide();
          break;
        case 'Escape':
          e.preventDefault();
          closeSlideshow();
          break;
      }
    };

    if (showSlideshow) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showSlideshow]);

  // Handle video progress and auto-advance
  useEffect(() => {
    const video = slideshowVideoRef.current;
    if (!video || !showSlideshow) return;

    const updateProgress = () => {
      const current = video.currentTime;
      const total = video.duration;
      setCurrentTime(current);
      setDuration(total);

      if (total > 0) {
        setProgress((current / total) * 100);
      }
    };

    const handleVideoEnd = () => {
      // Auto-advance to next video when current one ends
      setTimeout(() => {
        nextSlide();
      }, 500); // Small delay before advancing
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [currentSlide, showSlideshow]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate width for each pagination item based on total number of videos
  const paginationItemWidth = Math.max(30, Math.min(60, 200 / tiktokVideos.length));

  return (
    <>
      <section className={parentClass}>
        <div className="container">
          <div className="heading-section text-center wow fadeInUp">
            <h3 className="heading">Have a look at our TikTok</h3>
            <p className="subheading text-secondary" style={{ fontSize: '20px' }}>
              Check out what our customer says about our product
            </p>
          </div>
          <Swiper
            dir="ltr"
            className="swiper tf-sw-collection"
            spaceBetween={15}
            breakpoints={{
              0: { slidesPerView: 1 },
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            modules={[Pagination]}
            pagination={{ el: ".spd456", clickable: true }}
          >
            {tiktokVideos.map((slide, index) => (
              <SwiperSlide key={index}>
                <div
                  className="collection-social hover-img wow fadeInUp"
                  data-wow-delay={slide.wowDelay}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleVideoClick(index)}
                  style={{ cursor: 'pointer' }}
                >
                  <video
                    className="video-thumbnail"
                    ref={(el) => (videoRefs.current[index] = el)}
                    width={300}
                    height={400}
                    playsInline
                    muted
                    loop
                    preload="metadata"
                    style={{
                      width: '100%',
                      height: '400px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      transform: activeVideoIndex === index ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: activeVideoIndex === index ? '0 10px 30px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.1)'
                    }}
                  >
                    <source src={slide.videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </SwiperSlide>
            ))}
            <div className="sw-pagination-collection sw-dots type-circle justify-content-center spd456"></div>
          </Swiper>
        </div>
      </section>

      {showSlideshow && (
        <div
          className="slideshow-modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={(e) => e.target === e.currentTarget && closeSlideshow()}
        >
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            height: '80vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <button
              onClick={closeSlideshow}
              style={{
                outline: "none",
                border: "none",
                position: 'absolute',
                backgroundColor: 'transparent',
                top: '-70px',
                right: '-30px',
                zIndex: 10,
                width: '44px',
                height: '44px',
                color: 'white',
                fontSize: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'normal',
              }}
            >
              ×
            </button>

            <div style={{
              position: 'relative',
              flex: 1,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                zIndex: 10
              }}>
                <div style={{
                  height: '100%',
                  backgroundColor: '#ff6b6b',
                  width: `${progress}%`,
                  transition: 'width 0.1s ease',
                  borderRadius: '0 2px 2px 0'
                }} />
              </div>

              <video
                ref={slideshowVideoRef}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                controls
                autoPlay
                loop={false}
                playsInline
                key={currentSlide}
              >
                <source src={tiktokVideos[currentSlide].videoSrc} type="video/mp4" />
              </video>

              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                backgroundColor: 'rgba(0, 0, 0, 1)',
                backdropFilter: 'blur(15px)',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <div>
                    <a
                      target={'_blank'}
                      href={'https://www.tiktok.com/@octarine.official'}
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '14px',
                      }}>
                      @octarine.official
                    </a>
                  </div>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '11px',
                    fontWeight: '500',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    minWidth: '50px',
                    textAlign: 'center'
                  }}>
                    {duration > 0 ? `${formatTime(currentTime)} / ${formatTime(duration)}` : '--:--'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '20px',
              padding: '0 20px'
            }}>
              {tiktokVideos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  style={{
                    width: `${paginationItemWidth}px`,
                    height: '8px',
                    borderRadius: '4px',
                    padding: "7px 32px",
                    border: 'none',
                    backgroundColor: index === currentSlide
                      ? 'rgba(255, 255, 255, 0.9)'
                      : 'rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    if (index !== currentSlide) {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index !== currentSlide) {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    }
                  }}
                />
              ))}
            </div>
          </div>

        </div>
      )}

      {/* <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '80px' }}>
        <Link href="https://www.tiktok.com/@octarine.official" target={'_blank'}>
          <button className={styles.button}>See our TikTok Profile</button>
        </Link>
      </div> */}

      <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .slideshow-modal * {
            box-sizing: border-box;
          }

          @media (max-width: 768px) {
            .slideshow-modal > div {
              margin: 0 20px;
              max-width: calc(100% - 40px);
            }

            .slideshow-modal button[style*="left: -60px"] {
              left: -20px !important;
            }

            .slideshow-modal button[style*="right: -60px"] {
              right: -20px !important;
            }
          }
        `}</style>
    </>
  );
}