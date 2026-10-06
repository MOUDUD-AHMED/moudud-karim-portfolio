const navToggle=document.querySelector('.nav-toggle');
const nav=document.querySelector('.nav-links');
if(navToggle&&nav){navToggle.addEventListener('click',()=>nav.classList.toggle('open'));nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}

document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{if(a.classList.contains('sample-trigger'))return;const id=a.getAttribute('href');if(id&&id.length>1){const el=document.querySelector(id);if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'})}}})});

// Count-up stats: fast, smooth, and only once when the strip becomes visible.
const counters=document.querySelectorAll('.counter');
const animateCounter=(el)=>{if(el.dataset.done)return;el.dataset.done='1';const target=Number(el.dataset.target||0);const suffix=el.dataset.suffix||'';const comma=el.dataset.format==='comma';const duration=target>=1000?1250:target>=100?950:700;const start=performance.now();const tick=(now)=>{const progress=Math.min((now-start)/duration,1);const eased=1-Math.pow(1-progress,3);let value=Math.max(1,Math.round(target*eased));if(progress===1)value=target;el.textContent=(comma?value.toLocaleString('en-US'):value)+suffix;if(progress<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)};
if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.querySelectorAll('.counter').forEach(animateCounter);io.unobserve(entry.target)}}),{threshold:.35});const strip=document.querySelector('.stats-strip');if(strip)io.observe(strip);else counters.forEach(animateCounter)}else counters.forEach(animateCounter);

// On-site project sample lightbox.
const modal=document.getElementById('sampleModal');
const modalImg=document.getElementById('sampleModalImage');
const modalTitle=document.getElementById('sampleModalTitle');
let lastTrigger=null;
const closeModal=()=>{if(!modal)return;modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');modalImg.src='';if(lastTrigger)lastTrigger.focus()};
document.querySelectorAll('.sample-trigger').forEach(trigger=>trigger.addEventListener('click',e=>{e.preventDefault();lastTrigger=trigger;modalImg.src=trigger.dataset.image;modalTitle.textContent=trigger.dataset.title||'Project sample';modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');modal.querySelector('.modal-close').focus()}));
document.querySelectorAll('[data-close-modal]').forEach(el=>el.addEventListener('click',closeModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal?.classList.contains('is-open'))closeModal()});

// Make the real screenshot preview itself keyboard-accessible.
document.querySelectorAll('.real-sample-preview').forEach((preview) => {
  preview.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      preview.click();
    }
  });
});

// Active section navigation (scroll spy).
(() => {
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  if (!links.length) return;

  const items = links.map(link => {
    const id = link.getAttribute('href').slice(1);
    return { link, section: document.getElementById(id) };
  }).filter(item => item.section);

  const setActive = (id) => {
    links.forEach(link => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const updateActiveSection = () => {
    const marker = window.scrollY + Math.max(120, window.innerHeight * 0.28);
    let current = items[0];
    for (const item of items) {
      if (item.section.offsetTop <= marker) current = item;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
      current = items[items.length - 1];
    }
    if (current) setActive(current.section.id);
  };

  let ticking = false;
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateActiveSection(); ticking = false; });
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  window.addEventListener('load', updateActiveSection);
  updateActiveSection();
})();
