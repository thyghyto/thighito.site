(() => {
  const date = document.getElementById('today');
  if (date) date.textContent = new Intl.DateTimeFormat('pt-BR', {day:'2-digit', month:'2-digit', year:'numeric'}).format(new Date()).replaceAll('/', '.');

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox.querySelector('img');
  const close = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
  };

  document.querySelectorAll('.gallery-grid img').forEach((img) => {
    img.addEventListener('click', () => {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox || event.target === lightbox.querySelector('.lightbox-close')) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
})();