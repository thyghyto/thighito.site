(() => {
  const date = document.getElementById('today');
  if (date) date.textContent = new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date()).replaceAll('/','.');
  const notice = document.getElementById('language-notice');
  const applyLanguage = (language) => {
    const lang = language === 'en' ? 'en' : 'pt';
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    document.querySelectorAll('[data-pt][data-en]').forEach((element) => {
      element.textContent = element.dataset[lang];
    });
    document.querySelectorAll('[data-language]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.language === lang));
    });
    try { localStorage.setItem('thighito-language', lang); } catch (_) {}
    if (notice) notice.classList.add('hidden');
  };
  let savedLanguage = null;
  try { savedLanguage = localStorage.getItem('thighito-language'); } catch (_) {}
  if (savedLanguage === 'pt' || savedLanguage === 'en') applyLanguage(savedLanguage);
  else if (notice) notice.classList.remove('hidden');
  document.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => applyLanguage(button.dataset.language));
  });
  const changeLanguage = document.getElementById('change-language');
  if (changeLanguage) changeLanguage.addEventListener('click',(event)=>{event.preventDefault();notice.classList.remove('hidden');});
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const image = lightbox.querySelector('img');
    const close = () => { lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden','true'); image.removeAttribute('src'); };
    document.querySelectorAll('.gallery-grid img').forEach((item)=>item.addEventListener('click',()=>{
      image.src = item.src; image.alt = item.alt; lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false');
    }));
    lightbox.addEventListener('click',(event)=>{if(event.target===lightbox || event.target===lightbox.querySelector('.lightbox-close')) close();});
    document.addEventListener('keydown',(event)=>{if(event.key==='Escape') close();});
  }
})();