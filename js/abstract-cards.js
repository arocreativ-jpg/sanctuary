import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  // Small delay to ensure all layout shifts are complete in production
  setTimeout(initAbstractCards, 100);
});

function initAbstractCards() {
  const section = document.querySelector(".cta.abstract-cards-section");
  if (!section) return;

  const cardWrappers = section.querySelectorAll(".abstract-card");
  const cardInners = section.querySelectorAll(".abstract-card .card-inner");

  if (!cardWrappers.length || !cardInners.length) return;

  const initial = Array.from(cardWrappers).map(() => ({
    rotation: Math.round(Math.random() * 50 - 25),
    scale: 1.25,
    zIndex: Math.floor(Math.random() * 45 + 5),
  }));

  cardWrappers.forEach((wrapper, idx) => {
    wrapper.style.zIndex = String(initial[idx].zIndex);
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 90%",
      end: "bottom 10%",
      scrub: 1.2,
      invalidateOnRefresh: true,
    },
  });

  const sRect = section.getBoundingClientRect();

  cardInners.forEach((inner, idx) => {
    const wrapper = cardWrappers[idx];
    if (!inner || !wrapper) return;

    const wRect = wrapper.getBoundingClientRect();
    const offsetX = sRect.left + sRect.width / 2 - (wRect.left + wRect.width / 2);
    const offsetY = sRect.top + sRect.height / 2 - (wRect.top + wRect.height / 2);

    tl.fromTo(
      inner,
      {
        x: offsetX,
        y: offsetY,
        scale: initial[idx].scale,
        rotate: initial[idx].rotation,
      },
      {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        ease: "power2.out",
      },
      0
    );
  });
}
