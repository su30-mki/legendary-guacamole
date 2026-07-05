const reveals = document.querySelectorAll('.reveal');
const progressBar = document.querySelector('.scroll-progress');
const navLinks = Array.from(document.querySelectorAll('.nav-links a[data-nav]'));
const hero = document.querySelector('.hero');
const heroIntro = document.querySelector('.hero-intro');
const heroVisual = document.querySelector('.hero-visual');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: '0px 0px -40px 0px',
  },
);

reveals.forEach((element, index) => {
  element.style.transitionDelay = `${index * 70}ms`;
  revealObserver.observe(element);
});

const updateScrollProgress = () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

  if (progressBar) {
    progressBar.style.transform = `scaleX(${progress})`;
  }
};

const updateActiveNav = () => {
  const offset = window.innerHeight * 0.25;
  const currentSection = navLinks
    .map((link) => document.querySelector(`#${link.dataset.nav}`))
    .filter(Boolean)
    .reduce((activeSection, section) => {
      if (window.scrollY + offset >= section.offsetTop) {
        return section;
      }
      return activeSection;
    }, null);

  navLinks.forEach((link) => {
    const isActive = currentSection && link.dataset.nav === currentSection.id;
    link.classList.toggle('active', isActive);
  });
};

const updateHeroTilt = (event) => {
  if (!hero || !heroIntro || !heroVisual || prefersReducedMotion) {
    return;
  }

  const x = (event.clientX / window.innerWidth - 0.5) * 10;
  const y = (event.clientY / window.innerHeight - 0.5) * 10;

  heroIntro.style.setProperty('--tilt-x', `${x}px`);
  heroIntro.style.setProperty('--tilt-y', `${y}px`);
  heroVisual.style.setProperty('--tilt-x', `${-x * 0.7}px`);
  heroVisual.style.setProperty('--tilt-y', `${-y * 0.7}px`);
};

const resetHeroTilt = () => {
  if (!heroIntro || !heroVisual) {
    return;
  }

  heroIntro.style.removeProperty('--tilt-x');
  heroIntro.style.removeProperty('--tilt-y');
  heroVisual.style.removeProperty('--tilt-x');
  heroVisual.style.removeProperty('--tilt-y');
};

let ticking = false;
const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateScrollProgress();
      updateActiveNav();
      ticking = false;
    });
    ticking = true;
  }
};

updateScrollProgress();
updateActiveNav();

window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('resize', () => {
  updateScrollProgress();
  updateActiveNav();
});

if (hero) {
  hero.addEventListener('pointermove', updateHeroTilt);
  hero.addEventListener('pointerleave', resetHeroTilt);
}
