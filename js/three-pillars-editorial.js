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
        start: "top 75%",
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
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
  }
});
