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

  // --- Lightbox da galeria ---
  const galeriaItems = Array.from(document.querySelectorAll('.galeria-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (galeriaItems.length && lightbox && lightboxContent) {
    let lbIndex = 0;

    function renderLightbox(i) {
      lbIndex = (i + galeriaItems.length) % galeriaItems.length;
      const item = galeriaItems[lbIndex];
      const img = item.querySelector('img');
      const legenda = item.querySelector('.galeria-legenda');
      lightboxContent.innerHTML = '';

      if (img) {
        const bigImg = document.createElement('img');
        bigImg.src = img.src;
        bigImg.alt = img.alt || '';
        lightboxContent.appendChild(bigImg);
      } else {
        const span = document.createElement('span');
        span.textContent = legenda ? legenda.textContent.trim() : 'Foto';
        lightboxContent.appendChild(span);
      }
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

    galeriaItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
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
      const whatsapp = bookingForm.whatsapp.value.trim();
      const tecnica = bookingForm.tecnica.value;

      const mensagem =
        `Olá! Gostaria de agendar um horário no Cílios de Cinderela.%0A` +
        `Nome: ${encodeURIComponent(nome)}%0A` +
        `Meu WhatsApp: ${encodeURIComponent(whatsapp)}%0A` +
        `Técnica desejada: ${encodeURIComponent(tecnica)}`;

      window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${mensagem}`, '_blank');
    });
  }

});
