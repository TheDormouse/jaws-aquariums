'use client';

import { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import styles from './page.module.css';
import TestimonialsSlider from './components/TestimonialsSlider';

// Dynamically import the 3D shark scene to avoid SSR issues
const SharkScene = dynamic(() => import('./components/Shark'), {
  ssr: false,
  loading: () => <div className={styles.heroCanvas} style={{ background: 'transparent' }} />
});

// Header Logo with Bite Animation
function HeaderLogo() {
  const [isBiting, setIsBiting] = useState(false);
  const logoRef = useRef(null);
  const hoverCooldownRef = useRef(false);

  const triggerBite = useCallback(() => {
    setIsBiting(false);
    // Force reflow to restart animation
    if (logoRef.current) {
      void logoRef.current.offsetWidth;
    }
    setIsBiting(true);
  }, []);

  useEffect(() => {
    // Bite once on page load
    const timer = setTimeout(() => {
      triggerBite();
    }, 500);
    return () => clearTimeout(timer);
  }, [triggerBite]);

  const handleMouseEnter = () => {
    if (hoverCooldownRef.current) return;
    hoverCooldownRef.current = true;
    triggerBite();
    setTimeout(() => {
      hoverCooldownRef.current = false;
    }, 800);
  };

  const handleAnimationEnd = (e) => {
    if (e.target.classList.contains(styles.headerBite)) {
      // Keep the bite visible, but remove biting state
      setIsBiting(false);
    }
  };

  return (
    <a 
      ref={logoRef}
      className={`${styles.headerLogo} ${isBiting ? styles.isBiting : ''}`}
      href="#"
      aria-label="Home"
      onMouseEnter={handleMouseEnter}
      onAnimationEnd={handleAnimationEnd}
    >
      <span className={styles.headerBite} aria-hidden="true" />
      <span className={styles.headerCrumbs} aria-hidden="true" />
    </a>
  );
}

// Arrow icon component
function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// Phone icon component
function PhoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

// Email icon component
function EmailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

// Service icons
function AquariumIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="14" rx="2" />
      <path d="M6 18v2" />
      <path d="M18 18v2" />
      <path d="M4 20h16" />
      <path d="M8 10c1-1 2-1 3 0s2 1 3 0" />
      <circle cx="7" cy="11" r="1" />
    </svg>
  );
}

function PondIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="14" rx="9" ry="5" />
      <path d="M12 9c-2.5 0-4.5-2-4.5-4.5" />
      <path d="M12 9c0-2.5 2-4.5 4.5-4.5" />
      <path d="M12 9v5" />
      <path d="M6 13c1-0.5 2 0 2.5 0.5" />
    </svg>
  );
}

function WaterFeatureIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v6" />
      <path d="M12 8c-2 2-4 4-4 7a4 4 0 0 0 8 0c0-3-2-5-4-7z" />
      <path d="M8 22h8" />
      <path d="M7 8l-2-2" />
      <path d="M17 8l2-2" />
    </svg>
  );
}

function MaintenanceIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4" />
      <path d="M12 19v4" />
      <path d="M4.22 4.22l2.83 2.83" />
      <path d="M16.95 16.95l2.83 2.83" />
      <path d="M1 12h4" />
      <path d="M19 12h4" />
      <path d="M4.22 19.78l2.83-2.83" />
      <path d="M16.95 7.05l2.83-2.83" />
    </svg>
  );
}

// Portfolio items from JAWS Aquariums - real images from jawsaquariums.com
const portfolioItems = [
  {
    id: 1,
    title: 'Emory Orthopedics Installation',
    category: 'Healthcare',
    description: 'Custom aquarium designed to create a calming atmosphere for patients at Emory Orthopedics.',
    image: '/images/portfolio/home-15-emory_ortho.jpg',
  },
  {
    id: 2,
    title: 'Freestanding Display',
    category: 'Freestanding Aquarium',
    description: 'Walk-around aquarium serving as an artistic room divider, visible from all sides.',
    image: '/images/portfolio/home-16-group1_539.jpg',
  },
  {
    id: 3,
    title: 'Custom Aquatic Display',
    category: 'Custom Aquarium',
    description: 'Museum-quality acrylic aquarium with carefully selected fish for compatibility and visual impact.',
    image: '/images/portfolio/home-17-picture_001.jpg',
  },
  {
    id: 4,
    title: 'Executive Installation',
    category: 'Corporate',
    description: 'Professional aquatic display designed to impress clients and create a calming work environment.',
    image: '/images/portfolio/home-18-scottjc.jpg',
  },
];

const services = [
  {
    icon: AquariumIcon,
    title: 'Custom Aquariums',
    description: 'From freestanding masterpieces to built-in installations, we create bespoke aquatic environments tailored to your space and vision.',
  },
  {
    icon: PondIcon,
    title: 'Artistic Ponds',
    description: 'Transform your outdoor space with elegant koi ponds and water gardens that bring tranquility and natural beauty.',
  },
  {
    icon: WaterFeatureIcon,
    title: 'Water Features',
    description: 'Bubble walls, indoor waterfalls, and custom water art that captivate and create unforgettable atmospheres.',
  },
  {
    icon: MaintenanceIcon,
    title: 'Expert Maintenance',
    description: 'Comprehensive care including water changes, feeding, and health monitoring—no hidden fees, just exceptional service.',
  },
];

export default function Home() {
  const [showBite, setShowBite] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleBite = () => {
    setShowBite(true);
  };

  return (
    <>
      {/* Site Header */}
      <header className={styles.siteHeader}>
        <HeaderLogo />
      </header>

      {/* Hero Section */}
      <section
        className={styles.hero}
        aria-label="Welcome to JAWS Aquariums"
        style={{ '--cropOffset': `0px` }}
      >
        {/* 3D Shark Canvas - behind water layers */}
        <div className={styles.heroCanvas}>
          <Suspense fallback={null}>
            <SharkScene onBite={handleBite} />
          </Suspense>
        </div>
        <div className={styles.canvasEdgeFade} aria-hidden="true" />

        {/* Water depth layers - in front of shark */}
        <div className={styles.waterDepthFront} aria-hidden="true" />
        <div className={styles.waterDepthMid} aria-hidden="true" />
        <div className={styles.waterSurface} aria-hidden="true" />

        {/* Water Rising Effect */}
        <div className={styles.waterOverlay} aria-hidden="true" />

        {/* Bubbles */}
        <div className={styles.bubbles} aria-hidden="true">
          <div className={styles.bubble} />
          <div className={styles.bubble} />
          <div className={styles.bubble} />
          <div className={styles.bubble} />
          <div className={styles.bubble} />
          <div className={styles.bubble} />
        </div>

        {/* Hero Content */}
        <div className={styles.heroContent}>
          <div className={styles.logoContainer}>
            <h1 className={styles.logo}>
              Just Add <span>Water</span>
            </h1>
            {showBite && (
              <svg 
                className={styles.biteMark} 
                viewBox="0 0 120 100" 
                aria-hidden="true"
              >
                {/* Upper jaw bite */}
                <path 
                  d="M0,50 
                     Q10,50 15,35 
                     L20,45 L28,25 
                     L35,42 L45,20 
                     L55,40 L65,22 
                     L75,42 L85,28 
                     L95,45 L100,38
                     Q110,50 120,50
                     L120,0 L0,0 Z" 
                  fill="var(--deep-ocean)"
                />
                {/* Lower jaw bite */}
                <path 
                  d="M10,55 
                     Q15,55 20,70 
                     L30,58 L42,75 
                     L55,60 L68,72 
                     L80,58 L92,68
                     Q100,55 110,55
                     L110,100 L10,100 Z" 
                  fill="var(--deep-ocean)"
                />
              </svg>
            )}
          </div>
          <p className={styles.tagline}>Custom Aquarium Design & Installation</p>
          <p className={styles.subtitle}>
            Atlanta&apos;s premier aquatic artisans since 1989. 
            We transform spaces with bespoke aquariums that reflect 
            your vision, style, and sophistication.
          </p>
          <div className={styles.ctaHighlights} role="list">
            <span className={styles.ctaPill} role="listitem">Design → Build → Maintenance in-house</span>
            <span className={styles.ctaPill} role="listitem">Museum-grade acrylic & custom cabinetry</span>
            <span className={styles.ctaPill} role="listitem">White-glove installs with 48hr service response</span>
          </div>
          <p className={styles.ctaDetail}>
            We handle permitting, cabinetry, livestock sourcing, and proactive care so your statement piece stays crystal clear day one to year ten.
          </p>
          <div className={styles.ctaActions}>
            <a href="tel:+17703801020" className={styles.ctaButton}>
              Schedule a Consultation
              <ArrowIcon />
            </a>
            <a href="mailto:jawservice@earthlink.net" className={`${styles.ctaButton} ${styles.secondaryCta}`}>
              Email a Design Packet
              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.services} aria-labelledby="services-title">
        <h2 id="services-title" className={styles.sectionTitle}>
          What We <span>Create</span>
        </h2>
        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <article key={index} className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <service.icon />
              </div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Portfolio Section */}
      <section className={styles.portfolio} aria-labelledby="portfolio-title">
        <h2 id="portfolio-title" className={styles.sectionTitle}>
          Our <span>Work</span>
        </h2>
        <div className={styles.portfolioGrid}>
          {portfolioItems.map((item) => (
            <article key={item.id} className={styles.portfolioItem}>
              <Image
                src={item.image}
                alt={`${item.title} - ${item.category} by JAWS Aquariums: ${item.description}`}
                className={styles.portfolioImage}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
              />
              <div className={styles.portfolioOverlay}>
                <p className={styles.portfolioCategory}>{item.category}</p>
                <h3 className={styles.portfolioTitle}>{item.title}</h3>
                <p className={styles.portfolioDescription}>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSlider />

      {/* About / Why Choose Us Section */}
      <section className={styles.whyUs} aria-labelledby="why-us-title">
        <div className={styles.whyUsContent}>
          <div className={styles.whyUsText}>
            <h2 id="why-us-title" className={styles.whyUsTitle}>
              A Family Legacy of <span>Aquatic Artistry</span>
            </h2>
            <p className={styles.whyUsDescription}>
              Founded in 1989 by Jody Karlin after relocating from Long Island, NY, 
              Just Add Water has grown into Greater Atlanta&apos;s premier custom aquarium 
              design company. As a family-owned and operated business, we take pride 
              in creating one-of-a-kind systems that reflect your aesthetics, personality, 
              and lifestyle.
            </p>
            <p className={styles.whyUsDescription}>
              We exclusively use museum-quality acrylic aquariums—the same material 
              found in world-class public aquariums—offering superior clarity and 
              endless design possibilities. Every stone for our rock backdrops is 
              personally selected, and our cabinetry is finished with professional 
              stains, paints, and faux finishes to complement any interior.
            </p>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>1989</span>
                <span className={styles.statLabel}>Established</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>100%</span>
                <span className={styles.statLabel}>Custom Design</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>0</span>
                <span className={styles.statLabel}>Hidden Fees</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>∞</span>
                <span className={styles.statLabel}>Possibilities</span>
              </div>
            </div>
          </div>
          <div className={styles.experienceVisual}>
            <div className={styles.experienceCircle}>
              <span className={styles.experienceNumber}>35+</span>
            </div>
            <span className={styles.experienceLabel}>Years of Excellence</span>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contact} aria-labelledby="contact-title">
        <div className={styles.contactContent}>
          <h2 id="contact-title" className={styles.contactTitle}>
            Ready to <span>Transform</span> Your Space?
          </h2>
          <p className={styles.contactDescription}>
            Let&apos;s discuss your vision. Whether it&apos;s a stunning lobby centerpiece, 
            a serene medical waiting room, or a personal aquatic retreat, 
            we&apos;re here to bring it to life.
          </p>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <PhoneIcon />
              </div>
              <a href="tel:+17703801020" className={styles.contactLink}>
                (770) 380-1020
              </a>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <EmailIcon />
              </div>
              <a href="mailto:jawservice@earthlink.net" className={styles.contactLink}>
                jawservice@earthlink.net
              </a>
            </div>
          </div>
          <a href="tel:+17703801020" className={styles.ctaButton}>
            Call Now for a Free Consultation
            <ArrowIcon />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © {new Date().getFullYear()} <span>Just Add Water</span> — Atlanta&apos;s Premier Aquarium Specialists Since 1989
        </p>
      </footer>
    </>
  );
}
