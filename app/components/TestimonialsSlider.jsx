'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './TestimonialsSlider.module.css';

// Testimonials based on JAWS Aquariums' typical clientele
// Replace with actual client testimonials when available
const testimonials = [
  {
    id: 1,
    quote: "The aquarium JAWS designed for our executive lobby has become the centerpiece of our corporate headquarters. Clients are captivated the moment they walk in. Worth every penny.",
    name: "Richard Hartley",
    title: "CEO",
    company: "Hartley Capital Partners",
    type: "Corporate"
  },
  {
    id: 2,
    quote: "Our patients' anxiety levels have noticeably decreased since installing the waiting room aquarium. The calming effect is remarkable—it's become an integral part of our patient care.",
    name: "Dr. Sarah Mitchell",
    title: "Chief of Pediatrics",
    company: "Children's Medical Center",
    type: "Healthcare"
  },
  {
    id: 3,
    quote: "I've worked with aquarium companies before, but JAWS is different. No hidden fees, no pressure—just genuine expertise and craftsmanship. They've maintained our system flawlessly for over a decade.",
    name: "Dr. James Chen",
    title: "Owner",
    company: "Buckhead Dental Associates",
    type: "Dental"
  },
  {
    id: 4,
    quote: "From concept to installation, the team understood exactly what we envisioned. The custom reef display in our home is a living work of art that brings our family together every evening.",
    name: "Katherine & Michael Brooks",
    title: "Homeowners",
    company: "Private Residence, Alpharetta",
    type: "Residential"
  },
  {
    id: 5,
    quote: "Our restaurant's feature aquarium has been photographed thousands of times by guests. It's not just decor—it's become part of our brand identity. JAWS delivered beyond expectations.",
    name: "Antonio Rossi",
    title: "Executive Chef & Owner",
    company: "Acqua Fine Dining",
    type: "Commercial"
  }
];

// Quote icon component
function QuoteIcon() {
  return (
    <svg 
      width="48" 
      height="48" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={styles.quoteIcon}
    >
      <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-.485-1.938-.597.144c-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162-.293.408-.492.856-.702 1.299-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539l.025.168.026-.006A4.5 4.5 0 1 0 6.5 10zm11 0c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-.485-1.938-.597.144c-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162-.293.408-.492.856-.702 1.299-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539l.025.168.026-.006A4.5 4.5 0 1 0 17.5 10z"/>
    </svg>
  );
}

// Navigation arrow components
function ArrowLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState('next');

  const goToNext = useCallback(() => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const goToPrev = useCallback(() => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  const goToSlide = useCallback((index) => {
    setDirection(index > currentIndex ? 'next' : 'prev');
    setCurrentIndex(index);
  }, [currentIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(goToNext, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext]);

  // Pause on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section 
      className={styles.testimonials} 
      aria-labelledby="testimonials-title"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h2 id="testimonials-title" className={styles.sectionTitle}>
        What Our <span>Clients</span> Say
      </h2>
      
      <div className={styles.sliderContainer}>
        {/* Previous Button */}
        <button 
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={goToPrev}
          aria-label="Previous testimonial"
        >
          <ArrowLeft />
        </button>

        {/* Testimonial Card */}
        <div className={styles.sliderTrack}>
          <article 
            key={currentTestimonial.id}
            className={`${styles.testimonialCard} ${styles[direction]}`}
          >
            <QuoteIcon />
            <blockquote className={styles.quote}>
              {currentTestimonial.quote}
            </blockquote>
            <footer className={styles.attribution}>
              <div className={styles.clientInfo}>
                <cite className={styles.clientName}>{currentTestimonial.name}</cite>
                <span className={styles.clientTitle}>{currentTestimonial.title}</span>
                <span className={styles.clientCompany}>{currentTestimonial.company}</span>
              </div>
              <span className={styles.clientType}>{currentTestimonial.type}</span>
            </footer>
          </article>
        </div>

        {/* Next Button */}
        <button 
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={goToNext}
          aria-label="Next testimonial"
        >
          <ArrowRight />
        </button>
      </div>

      {/* Dots Navigation */}
      <div className={styles.dots} role="tablist" aria-label="Testimonial navigation">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
            onClick={() => goToSlide(index)}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}


