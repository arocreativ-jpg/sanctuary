import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".three-pillars-editorial");
  if (!section) return;

  const cards = section.querySelectorAll(".tpe-card");
  
  if (cards.length) {
    // Entrance animation
    gsap.to(cards, {
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out"
    });

    // Subtle parallax on images inside the cards
    cards.forEach((card) => {
      const img = card.querySelector(".tpe-card-img-wrapper img");
      if (img) {
        gsap.to(img, {
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          },
          y: "15%",
          ease: "none"
        });
      }
    });

    // Mobile slider dots tracking & click navigation
    const slider = section.querySelector(".tpe-cards-grid");
    const dots = section.querySelectorAll(".tpe-dot");

    if (slider && dots.length) {
      let isScrolling = false;
      const updateActiveDot = () => {
        const scrollLeft = slider.scrollLeft;
        const cardWidth = cards[0].offsetWidth;
        const gap = 20; // 1.25rem gap
        const activeIndex = Math.min(
          dots.length - 1,
          Math.max(0, Math.round(scrollLeft / (cardWidth + gap)))
        );

        dots.forEach((dot, idx) => {
          dot.classList.toggle("active", idx === activeIndex);
        });
        isScrolling = false;
      };

      slider.addEventListener("scroll", () => {
        if (!isScrolling) {
          window.requestAnimationFrame(updateActiveDot);
          isScrolling = true;
        }
      }, { passive: true });

      dots.forEach((dot, idx) => {
        dot.addEventListener("click", () => {
          if (cards[idx]) {
            cards[idx].scrollIntoView({
              behavior: "smooth",
              inline: "center",
              block: "nearest"
            });
          }
        });
      });
    }
  }
});
