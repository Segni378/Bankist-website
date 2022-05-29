'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const scrollToBtn = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector('#section--1');
const nav = document.querySelector(".nav");
const navItems = document.querySelectorAll(".nav__item");
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');


///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

scrollToBtn.addEventListener("click", function(e) {
  const s1coords = section1.getBoundingClientRect();

  // optional

      // window.pageXOffset --> Tells how much length the page is scrolled in the X direction.
      // window.pageYOffset --> Tells how much length the page is scrolled in the Y direction.
      // s1coords.top --> Tells how far the section is from the top of the view port.
      // s1coords.left --> Tells how far the section is from the left of the view port. 

  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);
  // OR
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: "smooth" 
  // })

  section1.scrollIntoView({ behavior: 'smooth' });

})


//********************** Page Navigation ************************//
// Event propagation concept is used. 

document.querySelector(".nav__links").addEventListener("click", function(e) {
  const id = e.target.getAttribute("href");
  if(id === '#') return; // for the btn--show-modal
  if(e.target.classList.contains('nav__link')){
    e.preventDefault();
    document.querySelector(id).scrollIntoView({behavior: "smooth"});
  }

})

/****************//* Optional for the page navigation *//****************/

// document.querySelectorAll(".nav__link").forEach(el => {
//   el.addEventListener("click", function(e) {
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     console.log(id);
//     document.querySelector(id).scrollIntoView({behavior: "smooth"});
//   })
// })


///////////////////////////////////////
// Tabbed component

// Event propagation concept is used. 


tabsContainer.addEventListener("click", function(e) {

    const clickedTab = e.target.closest(".operations__tab");
    
    // If there is no closest element with operations__tab class we return. This is called guard clause.
    if(!clickedTab) return;

    tabsContent.forEach((el) => el.classList.remove("operations__content--active"));
    tabs.forEach((el) => el.classList.remove("operations__tab--active"));

    const tabNumber = clickedTab.dataset.tab;
    const selectedContent = document.querySelector(`.operations__content--${tabNumber}`);
    
    clickedTab.classList.add("operations__tab--active");
    selectedContent.classList.add("operations__content--active");
    
})

// page navigation animation on hover


const eventHandler = function(e) {
  if (e.target.classList.contains('nav__link')) {
    const hoveredEle = e.target.closest('.nav__item');
    const logo = hoveredEle.closest('.nav').querySelector('img');

    navItems.forEach(el => {if(el != hoveredEle) el.style.opacity = this});
    logo.style.opacity = this;
  }
  

}
nav.addEventListener("mouseover", eventHandler.bind(0.5));
nav.addEventListener("mouseout", eventHandler.bind(1));

///////////////////////////////////////
// Sticky navigation: Intersection Observer API

// window.addEventListener("scroll", function() {

//   const s1coords = section1.getBoundingClientRect();

//   if(s1coords.top <= 0) {
//     document.querySelector(".nav").classList.add("sticky");
//   }
//   else document.querySelector('.nav').classList.remove('sticky');


// })

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const obsCallback = function(entries) {
  const [entry] = entries;

  if(!entry.isIntersecting) document.querySelector('.nav').classList.add('sticky');
  else  document.querySelector('.nav').classList.remove('sticky');
}
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `${-navHeight}px`
}

const observer = new IntersectionObserver(obsCallback, obsOptions);

observer.observe(header);

///////////////////////////////////////
// Reveal sections

const sections = document.querySelectorAll(".section");

const revealCallback = function(entries, observer) {
    const [entry] = entries;

    if(!entry.isIntersecting) return;
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
}

const revealObj = {
  root: null,
  threshold: 0.15
}

const revealSectionObserver = new IntersectionObserver(revealCallback, revealObj);

sections.forEach(section => {
  section.classList.add("section--hidden");
  revealSectionObserver.observe(section);
})

///////////////////////////////////////
// Lazzy Loading 


const images = document.querySelectorAll("img[data-src]");

const lazzyLoadCallback = function(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
}

const lazzyLoadingObj = {
  root: null,
  threshold: 0
}
const imageObserver = new IntersectionObserver(lazzyLoadCallback, lazzyLoadingObj);

images.forEach(image => imageObserver.observe(image));

///////////////////////////////////////
// Slider 
const contentSlider = function () {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotsContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxSlide = slides.length;
  const goToSlide = slide => {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };
  const createDots = () => {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide = "${i}"></button>`
      );
    });
  };
  const activateDots = slide => {
    document
      .querySelectorAll('.dots__dot')
      .forEach(slide => slide.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const init = function () {
    createDots();
    goToSlide(currentSlide);
    activateDots(currentSlide);
  };

  init();
  const btnLeftClickHandler = () => {
    if (currentSlide == 0) {
      currentSlide = maxSlide - 1;
    } else currentSlide--;
    goToSlide(currentSlide);
    activateDots(currentSlide);
  };
  const btnRightClickHandler = () => {
    if (currentSlide == maxSlide - 1) {
      currentSlide = 0;
    } else currentSlide++;

    goToSlide(currentSlide);
    activateDots(currentSlide);
  };
  btnLeft.addEventListener('click', btnLeftClickHandler);
  btnRight.addEventListener('click', btnRightClickHandler);

  document.addEventListener('keydown', function (e) {
    if (e.key == 'ArrowRight') btnRightClickHandler();
    if (e.key == 'ArrowLeft') btnLeftClickHandler();
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDots(slide);
    }
  });
};

contentSlider();
