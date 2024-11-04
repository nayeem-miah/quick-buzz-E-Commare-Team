const nextBtn = document.querySelector<HTMLButtonElement>('.next');
const prevBtn = document.querySelector<HTMLButtonElement>('.prev');

const slider = document.querySelector<HTMLDivElement>('.slider');
const sliderList = slider ? slider.querySelector<HTMLDivElement>('.list') : null;
const thumbnail = document.querySelector<HTMLDivElement>('.thumbnail');
const thumbnailItems = thumbnail ? thumbnail.querySelectorAll<HTMLDivElement>('.item') : null;

if (thumbnailItems && thumbnailItems.length > 0) {
    thumbnail.appendChild(thumbnailItems[0]);
}

// Function for next button
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        moveSlider('next');
    });
}

// Function for prev button
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        moveSlider('prev');
    });
}

function moveSlider(direction: 'next' | 'prev') {
    if (!slider || !sliderList || !thumbnail) return;

    const sliderItems = sliderList.querySelectorAll<HTMLDivElement>('.item');
    const thumbnailItems = thumbnail.querySelectorAll<HTMLDivElement>('.item');

    if (direction === 'next') {
        if (sliderItems.length > 0 && thumbnailItems.length > 0) {
            sliderList.appendChild(sliderItems[0]);
            thumbnail.appendChild(thumbnailItems[0]);
            slider.classList.add('next');
        }
    } else {
        if (sliderItems.length > 0 && thumbnailItems.length > 0) {
            sliderList.prepend(sliderItems[sliderItems.length - 1]);
            thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1]);
            slider.classList.add('prev');
        }
    }

    slider.addEventListener(
        'animationend',
        () => {
            slider.classList.remove(direction === 'next' ? 'next' : 'prev');
        },
        { once: true }
    );
}
