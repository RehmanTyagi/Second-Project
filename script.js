'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const allSections = document.querySelectorAll('.section');
const learnMore = document.querySelector('.btn--scroll-to');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const Section1 = document.querySelector('#section--1');
const TopHeader = document.querySelector('.header');
const lazyImg = document.querySelectorAll('img[data-src]');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////////
//Scrolling through Navbar Links
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching Strategy
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('btn--show-modal')
  ) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

learnMore.addEventListener('click', function () {
  document.querySelector('#section--1').scrollIntoView({ behavior: 'smooth' });
});

// Operation Section

// OperationTabFunc
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // If clicked is empty
  if (clicked) {
    // Active class Remove
    tabs.forEach(b => b.classList.remove('operations__tab--active'));
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));

    //Active Tab
    clicked.classList.add('operations__tab--active');
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  }
});

// Navbar HoverEffect

const HoverHandler = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('.nav__logo');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', HoverHandler.bind(0.5));
nav.addEventListener('mouseout', HoverHandler.bind(1));

// Sticky Navigation Feature
const NavHeight = nav.getBoundingClientRect().height;

const stickyNavigation = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const navigationObserver = new IntersectionObserver(stickyNavigation, {
  root: null,
  threshold: 0,
  rootMargin: `-${NavHeight}px`,
}).observe(TopHeader);

// Section Animation
const sectionAnimation = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const SectionObserver = new IntersectionObserver(sectionAnimation, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  section.classList.add('section--hidden');
  SectionObserver.observe(section);
});

////////////////////////////////////////////
// Lazy Image loading feature
const lazyLoadingFunc = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(lazyLoadingFunc, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

lazyImg.forEach(img => imgObserver.observe(img));

// Testimonial Slider
const Slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

// default Index
let curSlideIndex = 0;
const totalSlides = slides.length;

// produce slides movement
const slideEngine = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
slideEngine(0);

// Slider Dots Creating
const createDots = function () {
  slides.forEach(function (_, i) {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

// shows dots with slides
const activateDots = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
activateDots(0);

// Next Slide
const nextSlide = function () {
  if (curSlideIndex === totalSlides - 1) {
    curSlideIndex = 0;
  } else {
    curSlideIndex++;
  }

  slideEngine(curSlideIndex);
  activateDots(curSlideIndex);
};
// Prev Slide
const prevSlide = function () {
  if (curSlideIndex === 0) {
    curSlideIndex = totalSlides - 1;
  } else {
    curSlideIndex--;
  }
  slideEngine(curSlideIndex);
  activateDots(curSlideIndex);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// Keyboard functionality for slider
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});
