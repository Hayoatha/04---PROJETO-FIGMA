// ===========================================================
// CÍLIOS DE CINDERELA — script.js
// 1) Menu mobile
// 2) Ano automático no rodapé
// 3) Animações ao rolar a página (scroll reveal)
// 4) Lightbox da galeria
// 5) Formulário de reserva -> WhatsApp
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Menu mobile ---
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Ano automático ---
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Scroll reveal ---
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (reduceMotion) {
      revealEls.forEach(el => el.classList.add('visible'));
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(el => observer.observe(el));
    }
  }

  // --- Fotos da galeria ---
  const GALERIA_FOTOS = [
    { src: 'fotos/modelos/Hyper_Cinderela_1.jpeg', legenda: 'Hyper Cinderela' },
    { src: 'fotos/modelos/Hyper_Luxo_1.jpeg', legenda: 'Hyper Luxo' },
    { src: 'fotos/modelos/Hyper_Fox_Eyes_2.jpeg', legenda: 'Hyper Fox Eyes' },
    { src: 'fotos/modelos/Hyper_Fox_Eyes_Marrom_1.jpeg', legenda: 'Hyper Fox Eyes Marrom' },
    { src: 'fotos/modelos/Brow_Lamination_1.jpeg', legenda: 'Brow Lamination' },
    { src: 'fotos/modelos/Hyper_Marrom_2.jpeg', legenda: 'Hyper Marrom' },
  ];

  // --- Slideshows automáticos da galeria ---
  const galeriaLightboxTriggers = [];

  document.querySelectorAll('.galeria-slider').forEach(slider => {
    const track = document.createElement('div');
    track.className = 'galeria-track';
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'galeria-dots';

    const offset = Number(slider.dataset.offset || 0) % GALERIA_FOTOS.length;
    let current = offset;

    const items = GALERIA_FOTOS.map((foto, i) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'galeria-item' + (i === offset ? ' is-active' : '');
      item.dataset.fotoIndex = i;
      item.innerHTML = `<img src="${foto.src}" alt="Resultado ${foto.legenda}"><span class="galeria-legenda">${foto.legenda}</span>`;
      track.appendChild(item);
      galeriaLightboxTriggers.push(item);
      return item;
    });

    const dots = GALERIA_FOTOS.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'galeria-dot' + (i === offset ? ' is-active' : '');
      dot.setAttribute('aria-label', `Ver foto ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
      return dot;
    });

    function goToSlide(i) {
      items[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (i + items.length) % items.length;
      items[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }

    slider.appendChild(track);
    slider.appendChild(dotsWrap);

    if (items.length > 1) {
      let autoplay = setInterval(() => goToSlide(current + 1), 3000);
      slider.addEventListener('mouseenter', () => clearInterval(autoplay));
      slider.addEventListener('mouseleave', () => {
        autoplay = setInterval(() => goToSlide(current + 1), 3000);
      });
    }
  });

  // --- Lightbox da galeria ---
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (galeriaLightboxTriggers.length && lightbox && lightboxContent) {
    let lbIndex = 0;

    function renderLightbox(i) {
      lbIndex = (i + GALERIA_FOTOS.length) % GALERIA_FOTOS.length;
      const foto = GALERIA_FOTOS[lbIndex];
      lightboxContent.innerHTML = '';
      const bigImg = document.createElement('img');
      bigImg.src = foto.src;
      bigImg.alt = foto.legenda;
      lightboxContent.appendChild(bigImg);
    }

    function openLightbox(i) {
      renderLightbox(i);
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    galeriaLightboxTriggers.forEach(item => {
      item.addEventListener('click', () => openLightbox(Number(item.dataset.fotoIndex)));
    });
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    lightboxPrev.addEventListener('click', () => renderLightbox(lbIndex - 1));
    lightboxNext.addEventListener('click', () => renderLightbox(lbIndex + 1));
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') renderLightbox(lbIndex - 1);
      if (e.key === 'ArrowRight') renderLightbox(lbIndex + 1);
    });
  }

  // --- Formulário de reserva -> WhatsApp ---
  const WHATSAPP_NUMERO = '5592985951910';
  const bookingForm = document.getElementById('bookingForm');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = bookingForm.nome.value.trim();
      const tecnica = bookingForm.tecnica.value;

      const mensagem =
        `Olá! Gostaria de agendar um horário no Cílios de Cinderela.%0A` +
        `Nome: ${encodeURIComponent(nome)}%0A` +
        `Técnica desejada: ${encodeURIComponent(tecnica)}`;

      window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${mensagem}`, '_blank');
    });
  }

});
