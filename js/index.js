const burger = document.querySelector(".burger");

function navToggle(e) {
    if (!e.target.classList.contains("active")) {
        e.target.classList.add("active");
        gsap.to(".line1", { duration: 0.5, rotate: "45", y: 4, background: "white" });
        gsap.to(".line2", { duration: 0.5, rotate: "-45", y: -4, background: "white" });
        gsap.to(".line3", { duration: 0.5, opacity: 0 });
        gsap.to(burger, {
            duration: 0.5,
            background: "rgba(7, 149, 185, 0.198)"
        });
        gsap.to(".nav-bar", {
            duration: 0.5,
            opacity: 1,
            color: "black",
            pointerEvents: "auto"
        });
        gsap.to(".nav-cursor-appear", { duration: 0, pointerEvents: "all" });

        document.body.classList.add("hide");
    } else {
        e.target.classList.remove("active");
        gsap.to(".line1", { duration: 0.5, rotate: "0", y: 0, background: "white" });
        gsap.to(".line2", { duration: 0.5, rotate: "0", y: 0, background: "white" });
        gsap.to(".line3", { duration: 0.5, opacity: 1, background: "white" });
        gsap.to(burger, { duration: 0.5, background: "rgb(7, 150, 185)" });
        gsap.to(".nav-bar", {
            duration: 0.4,
            x: 0,
            opacity: 0
        });
        gsap.to(".nav-cursor-appear", { duration: 0, pointerEvents: "none" });
        document.body.classList.remove("hide");
    }
}

burger.addEventListener("click", navToggle);

// Products Slideshow Animation
let slideIndex = 0;

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" nowActive", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " nowActive";
    setTimeout(showSlides, 3000); // Change image every 3 seconds
}

showSlides();
// Key products animation for Tech list Using Scroll Magic/GSAP

let controller;
let listScene;

function listStagger() {

    //Controller for ScrollMagic effect
    controller = new ScrollMagic.Controller();

    // List stagger on scroll using gsap animation 
    let nxtList = document.querySelectorAll(".tech li");
    nxtList.forEach((stag) => {
        let listTl = gsap.timeline();

        listTl = new TimelineMax({ repeat: 0 }); //do not repeat staggering effect
        listTl.staggerTo(nxtList, 0.5, { autoAlpha: 1 }, 0.2); //stagger for 0.3 seconds

        //Creating a scene using scroll magic
        listScene = new ScrollMagic.Scene({
                triggerElement: stag,
                triggerHook: 0.5,
                reverse: false,
            })
            .setTween(listTl)
            .addTo(controller);

    });


};

listStagger();


// CAROUSEL ANIMATION
function Carousel(element) {
    this._autoDuration = 0;
    this._container = element.querySelector('.container');
    this._interval = null;
    this._nav = element.querySelector('nav');
    this._slide = 0;
    this._touchAnchorX = 0;
    this._touchTime = 0;
    this._touchX1 = 0;
    this._touchX2 = 0;
    element.addEventListener('click', this);
    element.addEventListener('touchstart', this);
    element.addEventListener('touchmove', this);
    element.addEventListener('touchend', this);
    element.addEventListener('transitionend', this);
    window.addEventListener('blur', this);
    window.addEventListener('focus', this);
    this.set(0);
}

Carousel.prototype.auto = function(ms) {
    if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
    }
    if (ms) {
        this._autoDuration = ms;
        let self = this;
        this._interval = setInterval(function() { self.next(); }, ms);
    }
}

Carousel.prototype.handleEvent = function(event) {
    if (event.touches && event.touches.length > 0) {
        this._touchTime = +new Date;
        this._touchX1 = this._touchX2;
        this._touchX2 = event.touches[0].screenX;
    }

    let screen = document.documentElement.clientWidth;
    let position = this._slide + (this._touchAnchorX - this._touchX2) / screen;
    let velocity = (new Date - this._touchTime) <= 200 ? (this._touchX1 - this._touchX2) / screen : 0;

    switch (event.type) {
        case 'blur':
            this.auto(0);
            break;
        case 'click':
            if (event.target.parentNode != this._nav) break;
            var i = parseInt(event.target.dataset.slide);
            if (!isNaN(i)) {
                event.preventDefault();
                this.auto(0);
                this.set(i);
            }
            break;
        case 'focus':
            this.auto(this._autoDuration);
            break;
        case 'touchstart':
            event.preventDefault();
            this.auto(0);
            this._container.style.transition = 'none';
            this._touchAnchorX = this._touchX1 = this._touchX2;
            break;
        case 'touchmove':
            this._container.style.transform = 'translate3d(' + (-position * 100) + 'vw, 0, 0)';
            break;
        case 'touchend':
            this._container.style.transition = '';
            var offset = Math.min(Math.max(velocity * 4, -0.5), 0.5);
            this.set(Math.round(position + offset));
            break;
        case 'transitionend':
            var i = this._slide,
                count = this._countSlides();
            if (i >= 0 && i < count) break;
            // The slides should wrap around. Instantly move to just outside screen on the other end.
            this._container.style.transition = 'none';
            this._container.style.transform = 'translate3d(' + (i < 0 ? -count * 100 : 100) + 'vw, 0, 0)';
            // Force changes to be applied sequentially by reflowing the element.
            this._container.offsetHeight;
            this._container.style.transition = '';
            this._container.offsetHeight;
            // Animate the first/last slide in.
            this.set(i < 0 ? count - 1 : 0);
            break;
    }
};

Carousel.prototype.next = function() {
    this.set(this._slide + 1);
};

Carousel.prototype.previous = function() {
    this.set(this._slide - 1);
};

Carousel.prototype.set = function(i) {
    let count = this._countSlides();
    if (i < 0) { i = -1; } else if (i >= count) { i = count; }
    this._slide = i;
    this._container.style.transform = 'translate3d(' + (-i * 100) + 'vw, 0, 0)';
    this._updateNav();
};

Carousel.prototype._countSlides = function() {
    return this._container.querySelectorAll('.slide').length;
};

Carousel.prototype._updateNav = function() {
    var html = '',
        count = this._countSlides();
    for (var i = 0; i < count; i++) {
        if (i > 0) html += '&nbsp;';
        html += '<a' + (i == this._slide ? ' class="current"' : '') + ' data-slide="' + i + '" href="#">●</a>';
    }
    this._nav.innerHTML = html;
}

var carousels = Array.prototype.map.call(document.querySelectorAll('.carousel'), function(element) {
    var carousel = new Carousel(element);
    carousel.auto(5000);
    return carousel;
});


// footer arrow scroll to top animation

const navArrow = document.querySelector(".arrow-toTop");

navArrow.addEventListener("click", () => {
    window.scroll({
        top: 0,
        behavior: "smooth"
    });
});