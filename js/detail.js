const params = new URLSearchParams(location.search);
const id = Number(params.get('car') || 1);
const car = cars.find(c => c.id === id) || cars[0];
const root = document.getElementById('detailRoot');
document.title = `${car.model} | Genesis Concept Car Gallery`;

root.innerHTML = `
  <section class="detail-hero" id="hero">
    <img src="${car.image}" alt="${car.model}" id="heroImage">
    <a class="back-main" href="index.html">← MAIN GALLERY</a>
    <div class="hero-copy">
      <div class="eyebrow">GENESIS · MODEL ${String(car.id).padStart(2,'0')}</div>
      <h1>${car.model}</h1>
      <p>${car.tagline}</p>
    </div>
  </section>

  <div class="detail-content">
    <section class="info-section reveal-target">
      <div class="info-media"><img src="${car.image}" alt="${car.model} detail"></div>
      <div class="info-copy">
        <div class="kicker">Design & Experience</div>
        <h2>Designed for every moment.</h2>
        <p>${car.note} 스크롤에 따라 이미지와 텍스트가 천천히 이동하도록 패럴랙스와 2초 이상의 전환 효과를 적용했습니다.</p>
      </div>
    </section>

    <section class="info-section alt reveal-target">
      <div class="info-copy">
        <div class="kicker">Performance</div>
        <h2>Quiet confidence in motion.</h2>
        <p>${car.powertrain} 기반의 구동 시스템과 제네시스 특유의 안정적인 승차감이 조화를 이룹니다. 차량 구성과 옵션에 따라 실제 제원은 달라질 수 있습니다.</p>
      </div>
      <div class="info-media"><img src="${car.image}" alt="${car.model} exterior"></div>
    </section>

    <section class="spec-section reveal-target">
      <div class="spec-head">
        <h2>Specifications</h2>
        <div class="price">${car.price}</div>
      </div>
      <div class="spec-grid">
        <div class="spec-card"><span>Powertrain</span><strong>${car.powertrain}</strong></div>
        <div class="spec-card"><span>Maximum output</span><strong>${car.power}</strong></div>
        <div class="spec-card"><span>Exterior size</span><strong>${car.size}</strong></div>
        <div class="spec-card"><span>Wheelbase</span><strong>${car.wheelbase}</strong></div>
      </div>
    </section>
  </div>

  <footer class="detail-footer">
    <a href="index.html">← Return to Main Slide</a>
    <p>Demo portfolio project · Publisher: kim so yeon<br>Price and specifications are reference values and may vary by trim, options and policy.</p>
  </footer>`;

requestAnimationFrame(() => document.body.classList.add('loaded'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('reveal');
  });
}, { threshold: .18 });
document.querySelectorAll('.reveal-target').forEach(el => revealObserver.observe(el));

const heroImage = document.getElementById('heroImage');
const mediaImages = [...document.querySelectorAll('.info-media img')];
let ticking = false;
function parallax() {
  const y = window.scrollY;
  heroImage.style.transform = `translate3d(0, ${Math.min(y * .12, 90)}px, 0) scale(1.03)`;
  mediaImages.forEach(img => {
    const box = img.parentElement.getBoundingClientRect();
    const viewportCenter = innerHeight / 2;
    const elementCenter = box.top + box.height / 2;
    const offset = (elementCenter - viewportCenter) * -0.045;
    img.style.transform = `translate3d(0, ${offset}px, 0) scale(1.02)`;
  });
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
}, { passive: true });
parallax();
