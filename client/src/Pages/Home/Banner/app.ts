const nextBtn = document.querySelector<HTMLButtonElement>('.next');
const prevBtn = document.querySelector<HTMLButtonElement>('.prev');

const slider = document.querySelector<HTMLDivElement>('.slider');
const sliderList = slider ? slider.querySelector<HTMLDivElement>('.list') : null;
const thumbnail = document.querySelector<HTMLDivElement>('.thumbnail');
const thumbnailItems = thumbnail ? Array.from(thumbnail.querySelectorAll<HTMLDivElement>('.item')) : [];

if (thumbnail && thumbnailItems.length > 0) {
    thumbnail.appendChild(thumbnailItems[0]);
}

// Event listener for the next button
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        moveSlider('next');
    });
}

// Event listener for the prev button
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        moveSlider('prev');
    });
}

function moveSlider(direction: 'next' | 'prev') {
    if (!slider || !sliderList || !thumbnail) return;

    const sliderItems = Array.from(sliderList.querySelectorAll<HTMLDivElement>('.item'));
    const thumbnailItems = Array.from(thumbnail.querySelectorAll<HTMLDivElement>('.item'));

    if (sliderItems.length > 0 && thumbnailItems.length > 0) {
        if (direction === 'next') {
            sliderList.appendChild(sliderItems[0]); // Move first item to the end
            thumbnail.appendChild(thumbnailItems[0]); // Move first thumbnail to the end
            slider.classList.add('next');
        } else {
            sliderList.prepend(sliderItems[sliderItems.length - 1]); // Move last item to the start
            thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1]); // Move last thumbnail to the start
            slider.classList.add('prev');
        }

        // Remove the class after animation ends
        slider.addEventListener(
            'animationend',
            () => {
                slider.classList.remove(direction === 'next' ? 'next' : 'prev');
            },
            { once: true }
        );
    }
}
