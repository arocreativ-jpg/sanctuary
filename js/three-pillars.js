import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const cardContainer = document.querySelector(".tp-card-container");
  const stickyHeader = document.querySelector(".tp-sticky-header h1");
  const cards = document.querySelectorAll(".tp-card");

  if (!cardContainer || !stickyHeader || cards.length === 0) return;

  function initAnimations() {
    const mm = gsap.matchMedia();

    mm.add("(max-width: 999px)", () => {
      document
        .querySelectorAll(".tp-card, .tp-card-container, .tp-sticky-header h1")
        .forEach((el) => (el.style = ""));
      return {};
    });

    mm.add("(min-width: 1000px)", () => {
      // Direct scrub timeline - 100% synchronized with Lenis smooth scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".tp-sticky",
          start: "top top",
          end: `+=${window.innerHeight * 2}px`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          refreshPriority: 2,
        },
      });

      // 1. Header slides up & container subtly scales (0 -> 1.0)
      tl.to(stickyHeader, { y: 0, opacity: 1, ease: "power1.out", duration: 1 }, 0)
        .to(cardContainer, { scale: 0.9, ease: "power1.out", duration: 1 }, 0)

      // 2. Cards separate using pure GPU transforms (0.8 -> 1.6)
        .to("#tp-card-1", { x: -25, ease: "power1.inOut", duration: 0.8 }, 0.8)
        .to("#tp-card-3", { x: 25, ease: "power1.inOut", duration: 0.8 }, 0.8)

      // 3. 3D Card flips with fan-out tilt (1.6 -> 3.2)
        .to(".tp-card", {
          rotationY: 180,
          ease: "power2.inOut",
          duration: 1.5,
          stagger: 0.12,
        }, 1.6)
        .to("#tp-card-1", {
          y: 25,
          rotationZ: -12,
          ease: "power2.inOut",
          duration: 1.5,
        }, 1.6)
        .to("#tp-card-3", {
          y: 25,
          rotationZ: 12,
          ease: "power2.inOut",
          duration: 1.5,
        }, 1.84)

      // 4. Dedicated resting window where cards remain locked in place (3.2 -> 4.2)
        .to({}, { duration: 1.0 })

      // 5. Exit fade as page smoothly transitions to the next section (4.2 -> 4.8)
        .to([cardContainer, stickyHeader], {
          opacity: 0,
          ease: "power1.in",
          duration: 0.6,
        });

      return () => {
        tl.kill();
      };
    });
  }

  initAnimations();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initAnimations();
      ScrollTrigger.refresh();
    }, 250);
  });
});
