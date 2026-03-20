import './style.css'

// Target Date for the Hackathon
const targetDate = new Date('2026-04-08T09:00:00+05:30').getTime();

function updateCountdown() {
  const container = document.querySelector('.countdown-container');
  if (!container) return; // Safe check for pages without countdown

  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance < 0) {
    container.innerHTML = '<h2 style="color:white; font-family: var(--font-heading)">HACKATHON HAS STARTED!</h2>';
    return;
  }

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const d = Math.floor(distance / day);
  const h = Math.floor((distance % day) / hour);
  const min = Math.floor((distance % hour) / minute);
  const s = Math.floor((distance % minute) / second);

  // Update DOM elements safely
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');
  
  if (daysEl) daysEl.innerText = d.toString().padStart(2, '0');
  if (hoursEl) hoursEl.innerText = h.toString().padStart(2, '0');
  if (minsEl) minsEl.innerText = min.toString().padStart(2, '0');
  if (secsEl) secsEl.innerText = s.toString().padStart(2, '0');
}

// Initial Call & setInterval
updateCountdown();
setInterval(updateCountdown, 1000);

// Smooth Scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetAttr = this.getAttribute('href');
        if (targetAttr === '#') return;
        
        try {
            const target = document.querySelector(targetAttr);
            if(target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        } catch (err) {
            // Ignore invalid selector errors
        }
    });
});

// Image Modal Logic
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.querySelector('.modal-close');
const prevBtn = document.querySelector('.modal-prev');
const nextBtn = document.querySelector('.modal-next');

if (modal && modalImg && closeBtn) {
  const images = Array.from(document.querySelectorAll('.gallery-img'));
  let currentIndex = 0;

  function updateModalImage(index) {
    if (images.length === 0) return;
    currentIndex = index;
    modalImg.src = images[currentIndex].src;
  }

  // Add click event to all gallery images
  images.forEach((img, index) => {
    img.addEventListener('click', function() {
      modal.style.display = 'flex'; // Use flex to easily center content
      updateModalImage(index);
    });
  });

  // Close when clicking the close button
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });

  // Close when clicking outside the image
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Next/Prev logic
  function showNext() {
    if (images.length === 0) return;
    const nextIndex = (currentIndex + 1) % images.length;
    updateModalImage(nextIndex);
  }

  function showPrev() {
    if (images.length === 0) return;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    updateModalImage(prevIndex);
  }

  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (modal.style.display === 'flex') {
      if (e.key === 'Escape') modal.style.display = 'none';
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    }
  });

  // Swipe logic for touch devices
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive: true});

  modal.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, {passive: true});

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) showNext(); // swipe left
    if (touchEndX > touchStartX + swipeThreshold) showPrev(); // swipe right
  }
}
