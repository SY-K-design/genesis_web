const track = document.getElementById('carouselTrack');
const dotsWrap = document.getElementById('carouselDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

cars.forEach((car, i) => {
  const slide = document.createElement('article');
  slide.className = 'slide';
  slide.dataset.id = car.id;
  slide.innerHTML = `
    <img src="${car.image}" alt="${car.model}">
    <div class="slide-caption">
      <div class="number">${String(i + 1).padStart(2, '0')} / ${String(cars.length).padStart(2, '0')}</div>
      <h2>${car.model}</h2>
      <p>${car.tagline}</p>
    </div>`;
  track.appendChild(slide);

  const dot = document.createElement('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', `${i + 1}번 슬라이드`);
  dot.addEventListener('click', () => goTo(i, true));
  dotsWrap.appendChild(dot);
});

const slides = [...document.querySelectorAll('.slide')];
const dots = [...dotsWrap.children];
let index = 0;
let timer = null;
let startX = 0;
let currentX = 0;
let dragging = false;
let moved = false;
let pointerId = null;
let pressedSlide = null;

function render(animate = true) {
  track.style.transition = animate ? 'transform .5s cubic-bezier(.22,.61,.36,1)' : 'none';
  track.style.transform = `translate3d(${-index * 100}%,0,0)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
}
function goTo(nextIndex, userAction = false) {
  index = (nextIndex + cars.length) % cars.length;
  render(true);
  if (userAction) restartAuto();
}
function next(userAction = false) { goTo(index + 1, userAction); }
function prev(userAction = false) { goTo(index - 1, userAction); }
function startAuto() { stopAuto(); timer = setInterval(() => next(false), 4000); }
function stopAuto() { if (timer) clearInterval(timer); timer = null; }
function restartAuto() { stopAuto(); setTimeout(startAuto, 4500); }

prevBtn.addEventListener('click', () => prev(true));
nextBtn.addEventListener('click', () => next(true));

track.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  dragging = true; moved = false; pointerId = e.pointerId;
  startX = currentX = e.clientX;
  pressedSlide = e.target.closest('.slide');
  track.setPointerCapture(pointerId);
  stopAuto();
});
track.addEventListener('pointermove', e => {
  if (!dragging || e.pointerId !== pointerId) return;
  currentX = e.clientX;
  const dx = currentX - startX;
  if (Math.abs(dx) > 7) moved = true;
  const offset = (-index * window.innerWidth) + dx;
  track.style.transition = 'none';
  track.style.transform = `translate3d(${offset}px,0,0)`;
});
function releaseDrag(e) {
  if (!dragging || e.pointerId !== pointerId) return;
  dragging = false;
  const dx = currentX - startX;
  const wasTapOrClick = Math.abs(dx) <= 7;
  const targetSlide = pressedSlide;
  const threshold = Math.min(110, window.innerWidth * .12);

  if (dx < -threshold) index = (index + 1) % cars.length;
  else if (dx > threshold) index = (index - 1 + cars.length) % cars.length;

  render(true);
  restartAuto();

  // Pointer capture can retarget the browser's click event to the track.
  // Handle a genuine click/tap here so the banner always opens its landing page.
  if (wasTapOrClick && targetSlide) {
    const id = targetSlide.dataset.id;
    window.location.href = `detail.html?car=${encodeURIComponent(id)}`;
    return;
  }

  pressedSlide = null;
  setTimeout(() => { moved = false; }, 40);
}
track.addEventListener('pointerup', releaseDrag);
track.addEventListener('pointercancel', e => {
  pressedSlide = null;
  releaseDrag(e);
});

window.addEventListener('blur', stopAuto);
window.addEventListener('focus', startAuto);
window.addEventListener('resize', () => render(false));
render(false);
startAuto();
