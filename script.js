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
(() => {
  const language = () => {
    try { return localStorage.getItem('thighito-language') === 'en' ? 'en' : 'pt'; } catch (_) { return 'pt'; }
  };
  const updates = Array.isArray(window.SITE_UPDATES) ? window.SITE_UPDATES : [];
  const renderUpdates = (container, items) => {
    if (!container) return;
    container.replaceChildren();
    const lang = language();
    items.forEach((item) => {
      const article = document.createElement('article');
      article.className = 'entry';
      const time = document.createElement('time');
      const date = new Date(item.date + 'T12:00:00');
      time.dateTime = item.date;
      time.textContent = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'}).format(date);
      const body = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = (item.title && item.title[lang]) || '';
      const paragraph = document.createElement('p');
      paragraph.textContent = (item.text && item.text[lang]) || '';
      body.append(title, paragraph);
      if (Array.isArray(item.tags) && item.tags.length) {
        const tags = document.createElement('span');
        tags.className = 'entry-tag';
        tags.textContent = item.tags.map(tag => '# ' + tag).join(' · ');
        body.append(tags);
      }
      article.append(time, body);
      container.append(article);
    });
  };
  const diaryContainer = document.getElementById('diary-entries');
  const homeContainer = document.getElementById('home-updates');
  const refreshUpdates = () => {
    renderUpdates(diaryContainer, updates);
    renderUpdates(homeContainer, updates.slice(0,2));
  };
  refreshUpdates();
  document.querySelectorAll('[data-language]').forEach((button) => button.addEventListener('click', refreshUpdates));

  const intro = document.getElementById('site-intro');
  const audio = document.getElementById('site-audio');
  const enter = document.getElementById('enter-site');
  const toggle = document.getElementById('music-toggle');
  const status = document.getElementById('music-status');
  const setMusicLabel = () => {
    if (!toggle || !audio) return;
    toggle.classList.toggle('is-playing', !audio.paused);
    toggle.querySelector('span').textContent = audio.paused ? 'music' : 'playing';
  };
  if (enter && intro && audio) {
    enter.addEventListener('click', async () => {
      try {
        audio.volume = 0.35;
        await audio.play();
        if (status) status.textContent = 'soundtrack playing ✦';
      } catch (_) {
        if (status) status.textContent = 'add your MP3 at music/theme.mp3 to enable the soundtrack';
      }
      intro.classList.add('intro-hidden');
      setMusicLabel();
    });
  }
  if (toggle && audio) {
    toggle.addEventListener('click', async () => {
      if (audio.paused) {
        try { audio.volume = 0.35; await audio.play(); }
        catch (_) { if (status) status.textContent = 'MP3 not found — add music/theme.mp3'; }
      } else audio.pause();
      setMusicLabel();
    });
    audio.addEventListener('play',setMusicLabel);
    audio.addEventListener('pause',setMusicLabel);
  }
})();