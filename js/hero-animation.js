import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const spotlightGallery = document.querySelector(".hero-spotlight-gallery");
const spotlightImages = document.querySelectorAll(".hero-spotlight-item img");
const logo = document.querySelector(".logo");

const lerp = (from, to, t) => from + (to - from) * t;

const mapRange = (value, rangeStart, rangeEnd) =>
  gsap.utils.clamp(0, 1, (value - rangeStart) / (rangeEnd - rangeStart));

const headerFadeTargets = document.querySelectorAll(".hero-badge, .hero-title, .hero-subtitle, .hero-desc, .hero-btn-primary, .hero-btn-secondary");
gsap.set(headerFadeTargets, { opacity: 0, y: 20 });

const headerFadeStep = (0.7 - 0.1) / Math.max(1, headerFadeTargets.length);
const headerFadeDuration = headerFadeStep * 2.5;

const MOBILE_BREAKPOINT = 1000;

let logoStartScale = 6;
gsap.matchMedia().add(`(max-width: ${MOBILE_BREAKPOINT}px)`, () => {
  logoStartScale = 2;
  return () => (logoStartScale = 6);
});

if (spotlightGallery) {
  ScrollTrigger.create({
    trigger: ".hero",
    start: "top top",
    end: `+=${window.innerHeight * 1.5}px`,
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      const scrollProgress = self.progress;

      const galleryProgress = mapRange(scrollProgress, 0, 0.95);
      const galleryScale = lerp(1, 0.5, galleryProgress);
      gsap.set(spotlightGallery, { scale: galleryScale });

      const imageScale = lerp(1, 1, galleryProgress);
      gsap.set(spotlightImages, { scale: imageScale });

      const logoScale = lerp(logoStartScale, 1, galleryProgress);

      const oneRem = parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      if (logo) {
        const logoScaledHeight = logo.offsetHeight * logoScale;
        const logoTravelDistance =
          window.innerHeight - logoScaledHeight - oneRem * 4;

        gsap.set(logo, {
          scale: logoScale,
          y: -logoTravelDistance * galleryProgress,
        });
      }

      headerFadeTargets.forEach((target, index) => {
        const targetStart = 0.1 + index * headerFadeStep;
        const targetProgress = mapRange(
          scrollProgress,
          targetStart,
          targetStart + headerFadeDuration,
        );
        gsap.set(target, { 
          opacity: targetProgress,
          y: lerp(20, 0, targetProgress)
        });
      });
    },
  });
}
