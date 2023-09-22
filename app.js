const wrapper = document.querySelector(".wrapper");
const newCarousel = document.querySelector(".newCarousel");
const firstCardWidth = newCarousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const newCarouselChildrens = [...newCarousel.children];

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

// Get the number of cards that can fit in the newCarousel at once
let cardPerView = Math.round(newCarousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of newCarousel for infinite scrolling
newCarouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    newCarousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to end of newCarousel for infinite scrolling
newCarouselChildrens.slice(0, cardPerView).forEach(card => {
    newCarousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the newCarousel at appropriate postition to hide first few duplicate cards on Firefox
newCarousel.classList.add("no-transition");
newCarousel.scrollLeft = newCarousel.offsetWidth;
newCarousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the newCarousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        newCarousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    newCarousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the newCarousel
    startX = e.pageX;
    startScrollLeft = newCarousel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the newCarousel based on the cursor movement
    newCarousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    newCarousel.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the newCarousel is at the beginning, scroll to the end
    if(newCarousel.scrollLeft === 0) {
        newCarousel.classList.add("no-transition");
        newCarousel.scrollLeft = newCarousel.scrollWidth - (2 * newCarousel.offsetWidth);
        newCarousel.classList.remove("no-transition");
    }
    // If the newCarousel is at the end, scroll to the beginning
    else if(Math.ceil(newCarousel.scrollLeft) === newCarousel.scrollWidth - newCarousel.offsetWidth) {
        newCarousel.classList.add("no-transition");
        newCarousel.scrollLeft = newCarousel.offsetWidth;
        newCarousel.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over newCarousel
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the newCarousel after every 2500 ms
    timeoutId = setTimeout(() => newCarousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

newCarousel.addEventListener("mousedown", dragStart);
newCarousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
newCarousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);