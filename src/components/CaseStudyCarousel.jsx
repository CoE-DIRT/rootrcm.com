import { useEffect, useId, useRef, useState } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

function canUseSplide() {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

/**
 * Shared accessible case-study carousel.
 * Splide handles focus scope, keyboard pagination, swipe, and reduced motion.
 * Parent page must carry semantic SEO content; slides are visual evidence only.
 */
export default function CaseStudyCarousel({ slides = [], label = 'Proof of Capability slides' }) {
  const statusId = useId();
  const statusRef = useRef(null);
  const splideRef = useRef(null);
  const [enhanced] = useState(() => canUseSplide());

  useEffect(() => {
    if (!enhanced) return undefined;
    const instance = splideRef.current?.splide;
    if (!instance || !statusRef.current) return undefined;

    function syncStatus() {
      const index = instance.index + 1;
      const total = instance.length;
      statusRef.current.textContent = `Slide ${index} of ${total}`;
    }

    syncStatus();
    instance.on('moved', syncStatus);
    return () => {
      try {
        instance.off('moved', syncStatus);
      } catch (error) {
        console.error('Unable to remove Splide status listener.', error);
      }
    };
  }, [enhanced, slides.length]);

  if (!slides.length) return null;

  if (!enhanced) {
    return (
      <div className="caseStudyCarouselWrap" aria-label={label}>
        <ul className="caseStudyFallback">
          {slides.map((slide) => (
            <li key={slide.src}>
              <figure className="caseStudySlide">
                <img src={slide.src} alt={slide.alt || slide.title || ''} loading="lazy" decoding="async" />
                {slide.title ? <figcaption>{slide.title}</figcaption> : null}
              </figure>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="caseStudyCarouselWrap">
      <p id={statusId} className="caseStudyCarouselStatus" ref={statusRef} aria-live="polite">
        Slide 1 of {slides.length}
      </p>
      <Splide
        ref={splideRef}
        className="caseStudyCarousel"
        aria-label={label}
        aria-describedby={statusId}
        options={{
          type: 'slide',
          perPage: 1,
          perMove: 1,
          gap: '1.25rem',
          pagination: true,
          arrows: true,
          drag: true,
          keyboard: 'focused',
          paginationKeyboard: true,
          autoplay: false,
          speed: 420,
          reduceMotion: {
            speed: 0,
            autoplay: false,
            rewindSpeed: 0,
          },
          classes: {
            arrows: 'splide__arrows caseStudyArrows',
            arrow: 'splide__arrow caseStudyArrow',
            prev: 'splide__arrow--prev',
            next: 'splide__arrow--next',
            pagination: 'splide__pagination caseStudyPagination',
            page: 'splide__pagination__page caseStudyPage',
          },
        }}
      >
        {slides.map((slide) => (
          <SplideSlide key={slide.src}>
            <figure className="caseStudySlide">
              <img src={slide.src} alt={slide.alt || slide.title || ''} loading="lazy" decoding="async" />
              {slide.title ? <figcaption>{slide.title}</figcaption> : null}
            </figure>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}
