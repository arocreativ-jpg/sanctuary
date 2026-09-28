import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", initWorkshopCollage);

export function initWorkshopCollage() {
  const blocks = document.querySelectorAll(".image-block");
  if (!blocks.length) return;

  // Subtle parallax for image blocks
  blocks.forEach((block, index) => {
    // Top blocks move slower, bottom blocks move faster
    const yMove = index < 2 ? -20 : -40; 
    const baseRot = block.style.getPropertyValue('transform') || '';

    ScrollTrigger.create({
      trigger: ".workshop-collage-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 1.5,
      animation: gsap.to(block, {
        y: yMove,
        rotation: (index % 2 === 0) ? "+=2" : "-=2",
        ease: "none"
      })
    });
  });

  // Fade in elements
  gsap.fromTo(
    blocks,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".workshop-collage-section",
        start: "top 70%",
      }
    }
  );

  // Fade in edge annotations
  const annos = document.querySelectorAll(".edge-anno");
  if (annos.length) {
    gsap.fromTo(
      annos,
      { opacity: 0 },
      {
        opacity: 0.8,
        duration: 2,
        delay: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".workshop-collage-section",
          start: "top 60%",
        }
      }
    );
  }
}
