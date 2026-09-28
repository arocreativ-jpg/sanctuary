import gsap from "gsap";

const COLLECTIONS_DATA = [
  {
    name: "The Smokers Lounge",
    img: "/engraving/8e291ae5c7eb8130952ccb843aefe48c100c23ec.webp",
    tag: "Engraved Zippos & Trays",
    url: "/collection"
  },
  {
    name: "Housewares",
    img: "/engraving/f4484ce2ca33e9017bc28ce083bcd8069acc448b%20(1).jpg",
    tag: "Boards & Coasters",
    url: "/collection"
  },
  {
    name: "Custom Engraving",
    img: "/engraving/73e8813702d05b94dfdee2bf2158d2bb1f965a90%20(1).jpg",
    tag: "Your Product Engraved",
    url: "/contact"
  }
];

const SPACING = 0.45; // Increased spacing for more breathing room
const SLIDE_WIDTH = SPACING * 1000;

let currentProductIndex = 0;
let slideItems = [];
let BUFFER_SIZE = 3;

document.addEventListener("DOMContentLoaded", () => {
  initCollectionsSlider();
  initCollectionsAnimations();
});

// collections section - slider initialization
function initCollectionsSlider() {
  const collectionsContainer = document.querySelector(".collections");
  const controllerInner = document.querySelector(".controller-inner");
  const collectionControllerPrevBtn = document.querySelector(
    ".collections-controller-nav-btn.prev"
  );
  const collectionControllerNextBtn = document.querySelector(
    ".collections-controller-nav-btn.next"
  );

  if (
    !collectionsContainer ||
    !controllerInner ||
    !collectionControllerPrevBtn ||
    !collectionControllerNextBtn
  ) {
    return;
  }

  function getBufferSize() {
    return window.innerWidth < 1000 ? 1 : 2;
  }

  function addSlideItem(relativeIndex) {
    const productIndex =
      (((currentProductIndex + relativeIndex) % COLLECTIONS_DATA.length) +
        COLLECTIONS_DATA.length) %
      COLLECTIONS_DATA.length;
    const product = COLLECTIONS_DATA[productIndex];
    const displayNum = String(productIndex + 1).padStart(2, '0');

    const li = document.createElement("li");
    li.innerHTML = `
      <div class="product-item-bg-wrapper"><div class="product-item-bg"></div></div>
      <div class="outline-wrapper"><div class="product-bg-outline"></div></div>
      <div class="product-img-wrapper">
        <img src="${product.img}" alt="${product.name}" />
        <div class="collection-meta-overlay">
          <p class="collection-number">${displayNum}</p>
          <h2 class="collection-title">${product.name.toUpperCase()}</h2>
          <div class="collection-line"></div>
        </div>
      </div>
    `;
    li.dataset.relativeIndex = relativeIndex;
    
    // Add click handler to navigate to URL when active slide is clicked
    li.style.cursor = "pointer";
    li.addEventListener("click", () => {
      // Only navigate if it's the center/active slide
      if (parseInt(li.dataset.relativeIndex) === 0) {
        window.location.href = product.url;
      }
    });

    gsap.set(li, {
      x: relativeIndex * SLIDE_WIDTH,
      scale: 0,
      opacity: relativeIndex === 0 ? 1 : 0.6,
      zIndex: relativeIndex === 0 ? 100 : 1,
      force3D: true,
    });

    collectionsContainer.appendChild(li);
    slideItems.push({ element: li, relativeIndex: relativeIndex });
  }

  function removeSlideItem(relativeIndex) {
    const itemIndex = slideItems.findIndex(
      (item) => item.relativeIndex === relativeIndex
    );
    if (itemIndex !== -1) {
      const item = slideItems[itemIndex];
      item.element.remove();
      slideItems.splice(itemIndex, 1);
    }
  }

  function updateSliderPosition() {
    const tl = gsap.timeline();

    slideItems.forEach((item) => {
      const isActive = item.relativeIndex === 0;
      tl.to(
        item.element,
        {
          x: item.relativeIndex * SLIDE_WIDTH,
          scale: isActive ? 1.1 : 0.75,
          opacity: isActive ? 1 : 0.6,
          zIndex: isActive ? 100 : 1,
          duration: 0.75,
          ease: "power3.out",
          force3D: true,
        },
        0
      );
    });
  }

  function moveNext() {
    currentProductIndex++;
    removeSlideItem(-BUFFER_SIZE);
    slideItems.forEach((item) => {
      item.relativeIndex--;
      item.element.dataset.relativeIndex = item.relativeIndex;
    });
    addSlideItem(BUFFER_SIZE);
    updateSliderPosition();
  }

  function movePrev() {
    currentProductIndex--;
    removeSlideItem(BUFFER_SIZE);
    slideItems.forEach((item) => {
      item.relativeIndex++;
      item.element.dataset.relativeIndex = item.relativeIndex;
    });
    addSlideItem(-BUFFER_SIZE);
    updateSliderPosition();
  }

  function handleExploreClick() {
    const actualIndex =
      ((currentProductIndex % COLLECTIONS_DATA.length) + COLLECTIONS_DATA.length) %
      COLLECTIONS_DATA.length;
    window.location.href = COLLECTIONS_DATA[actualIndex].url;
  }

  function clearSlider() {
    slideItems.forEach((item) => {
      item.element.remove();
    });
    slideItems = [];
  }

  function rebuildSlider() {
    clearSlider();
    BUFFER_SIZE = getBufferSize();
    for (let i = -BUFFER_SIZE; i <= BUFFER_SIZE; i++) {
      addSlideItem(i);
    }
    updateSliderPosition();
  }

  function initializeSlider() {
    BUFFER_SIZE = getBufferSize();
    for (let i = -BUFFER_SIZE; i <= BUFFER_SIZE; i++) {
      addSlideItem(i);
    }

    slideItems.forEach((item) => {
      const isActive = item.relativeIndex === 0;
      gsap.set(item.element, {
        x: item.relativeIndex * SLIDE_WIDTH,
        zIndex: isActive ? 100 : 1,
      });
    });

    slideItems.forEach((item) => {
      const isActive = item.relativeIndex === 0;
      gsap.to(item.element, {
        scale: isActive ? 1.1 : 0.75,
        opacity: isActive ? 1 : 0.6,
        duration: 1,
        ease: "power3.out",
        delay: 0.5,
      });
    });
  }

  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newBufferSize = getBufferSize();
      if (newBufferSize !== BUFFER_SIZE) {
        rebuildSlider();
      }
    }, 150);
  }

  let resizeTimeout;
  collectionControllerPrevBtn.addEventListener("click", movePrev);
  collectionControllerNextBtn.addEventListener("click", moveNext);
  controllerInner.addEventListener("click", handleExploreClick);
  window.addEventListener("resize", handleResize);

  initializeSlider();
}

// collections section - slide in animations for nav, footer, and controller
function initCollectionsAnimations() {
  const collectionsNav = document.querySelector(".collections-nav");
  const collectionsFooter = document.querySelector(".collections-footer");
  const controller = document.querySelector(".collections-slider .controller");

  if (collectionsNav) {
    gsap.set(collectionsNav, { y: -100 });
    gsap.to(collectionsNav, {
      y: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.5,
    });
  }

  if (collectionsFooter) {
    gsap.set(collectionsFooter, { y: 100 });
    gsap.to(collectionsFooter, {
      y: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.5,
    });
  }

  if (controller) {
    gsap.set(controller, { y: 300 });
    gsap.to(controller, {
      y: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.5,
    });
  }
}
