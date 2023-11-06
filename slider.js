/**
 * An array of image file names used in the slider
 * @type {string[]}
 */
const images = [
  "11.jpg",
  "22.jpg",
  "33.jpg",
  "44.jpg",
  "55.jpg",
  "66.jpg",
  "77.jpg",
];

/**
 * Variables to track the current active image and a flag used to lock animation
 * @type {number}
 */
let activeImage = 0;

/**
 * A flag used to prevent concurrent animations
 * @type {boolean}
 */
let flag = true;

/**
 * Reference to the slider container element
 * @type {HTMLElement}
 */
const slider = document.querySelector(".slider");
const sliderLine = slider.querySelector(".slider-line");
const buttonNext = document.querySelector(".next-button");
const buttonPrev = document.querySelector(".prev-button");

/**
 * The width of the slider container
 * @type {number}
 */
const offsetWidth = slider.clientWidth;

/**
 * Sets the width and height of the slider line and initial position
 */
sliderLine.style.width = 3 * offsetWidth + "px";
sliderLine.style.height = slider.clientHeight + "px";
sliderLine.style.left = "-" + offsetWidth + "px";

/**
 * Initializes the slider by creating initial images.
 */
function initSlider() {
  createImage(images[getPrevImageIndex()], false);
  createImage(images[activeImage]);
  createImage(images[getNextImageIndex()], false);
}

/**
 * Creates an image element and adds it to the slider line.
 * @param {string} image - The image file name to create.
 * @param {boolean} hidden - If true, the image is hidden initially.
 */
function createImage(image, hidden = false) {
  const img = document.createElement("img");
  img.alt = "";
  img.src = `./img/${image}`;

  if (hidden) {
    img.style.width = 0;
    sliderLine.prepend(img);
  } else {
    sliderLine.append(img);
  }
}

/**
 * Calculates the index of the next image in the images array.
 * @returns {number} The index of the next image.
 */
function getNextImageIndex() {
  return (activeImage + 1) % images.length;
}

/**
 * Calculates the index of the previous image in the images array.
 * @returns {number} The index of the previous image.
 */
function getPrevImageIndex() {
  return (activeImage - 1 + images.length) % images.length;
}

/**
 * Animates an element over a specified duration.
 * @param {Object} options - Animation options.
 * @param {number} options.duration - The duration of the animation in milliseconds.
 * @param {Function} options.draw - The function to update the animation frame.
 * @param {HTMLElement} options.removeElement - The element to remove after the animation.
 */
const animate = ({ duration, draw, removeElement }) => {
  const start = performance.now();

  requestAnimationFrame(function animate(time) {
    let step = (time - start) / duration;
    if (step > 1) step = 1;
    draw(step);
    if (step < 1) {
      requestAnimationFrame(animate);
    } else {
      removeElement.remove();
      flag = true;
    }
  });
};

/**
 * Moves to the next image in the slider.
 */
const nextSliderMove = () => {
  if (!flag) return;
  flag = !flag;

  activeImage++;
  if (activeImage >= images.length) activeImage = 0;
  animate({
    duration: 1000,
    draw: function (progress) {
      document.querySelector(".slider-line img").style.width =
        offsetWidth * (1 - progress) + "px";
    },
    removeElement: document.querySelector(".slider-line img"),
  });
  createImage(images[getNextImageIndex()], false);
};

/**
 * Moves to the previous image in the slider.
 */
const prevSliderMove = () => {
  if (!flag) return;
  flag = !flag;

  activeImage--;

  if (activeImage < 0) activeImage = images.length - 1;

  animate({
    duration: 1000,
    draw: function (progress) {
      document.querySelector(".slider-line img").style.width =
        offsetWidth * progress + "px";
    },
    removeElement: document.querySelector(".slider-line img:last-child"),
  });
  createImage(images[getPrevImageIndex()], true);
};

// Initialize the slider when the page loads.
initSlider();

// Add event listeners to the "Next" and "Previous" buttons to trigger image transitions.
buttonNext.addEventListener("click", nextSliderMove);
buttonPrev.addEventListener("click", prevSliderMove);
