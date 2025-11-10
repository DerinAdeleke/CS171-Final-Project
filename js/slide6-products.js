// Slide 6 carousel: center-focused swipeable product gallery
(function(){
  const slide = document.getElementById('slide-6');
  if(!slide) return;
  // ensure slide can receive keyboard focus for arrow navigation
  if(typeof slide.tabIndex === 'number') slide.tabIndex = 0;
  const container = document.getElementById('products-area-6');
  if(!container) return;

  // Utilities
  function getField(row, candidates){
    for(const key of Object.keys(row||{})){
      const lk = key.toLowerCase();
      for(const c of candidates){ if(lk.includes(c)) return row[key]; }
    }
    return undefined;
  }
  function formatPrice(s){
    if(s==null) return '—';
    const t = String(s).trim();
    if(t==='') return '—';
    const cleaned = t.replace(/[^0-9.,\\-]/g,'');
    const num = Number(cleaned.replace(/,/g,''));
    if(!isFinite(num)) return '$' + cleaned;
    return '$' + num.toLocaleString(undefined, {maximumFractionDigits:2});
  }
  function escapeHtml(s){ return s==null? '': String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // Build carousel DOM (start hidden; we'll fade it in after the intro and after data loads)
  container.innerHTML = '';
  const carousel = document.createElement('div');
  carousel.className = 'product-carousel';
  carousel.style.opacity = '0';
  carousel.style.pointerEvents = 'none';
  carousel.setAttribute('aria-hidden','true');

  const btnPrev = document.createElement('button'); btnPrev.className = 'carousel-btn prev'; btnPrev.setAttribute('aria-label','Previous product'); btnPrev.innerHTML = '‹';
  const btnNext = document.createElement('button'); btnNext.className = 'carousel-btn next'; btnNext.setAttribute('aria-label','Next product'); btnNext.innerHTML = '›';

  const track = document.createElement('div'); track.className = 'carousel-track';
  // three panes: prev, current, next
  const panePrev = document.createElement('div'); panePrev.className = 'carousel-item pane prev';
  const paneCurr = document.createElement('div'); paneCurr.className = 'carousel-item pane current';
  const paneNext = document.createElement('div'); paneNext.className = 'carousel-item pane next';

  // overlay that appears on center hover (brand, name, price)
  const overlay = document.createElement('div'); overlay.className = 'product-overlay'; overlay.setAttribute('aria-hidden','true');
  paneCurr.appendChild(overlay);

  track.appendChild(panePrev);
  track.appendChild(paneCurr);
  track.appendChild(paneNext);

  carousel.appendChild(btnPrev);
  carousel.appendChild(track);
  carousel.appendChild(btnNext);
  container.appendChild(carousel);

  // State
  let products = [];
  let idx = 0;

  function ensureImg(pane, prod){
    pane.innerHTML = '';
    if(!prod) return;
    const imgWrap = document.createElement('div'); imgWrap.className = 'img-wrap';
    const img = new Image(); img.className = 'carousel-img';
    img.alt = prod.Product || prod.product || prod.name || '';
    img.src = prod.imageUrl;
    imgWrap.appendChild(img);
    pane.appendChild(imgWrap);
    // add overlay for center pane
    if(pane.classList.contains('current')){
      const info = document.createElement('div'); info.className = 'overlay-content';
      info.innerHTML = `<div class="brand">${escapeHtml(prod.Brand||'')}</div><div class="name">${escapeHtml(prod.Product||'')}</div><div class="price">${escapeHtml(formatPrice(prod.Price||''))}</div>`;
      overlay.innerHTML = '';
      overlay.appendChild(info);
    }
  }

  // attach hover/tap behavior for the center image reliably
  function attachCenterInteractions(){
    // find the current image inside paneCurr
    const img = paneCurr.querySelector('.carousel-img');
    if(!img) return;
    // mouse hover (desktop)
    img.addEventListener('mouseenter', ()=> overlay.classList.add('visible'));
    img.addEventListener('mouseleave', ()=> overlay.classList.remove('visible'));
    // support tap on touch devices: toggle overlay on tap
    let lastTouch = 0;
    img.addEventListener('click', (e)=>{
      const now = Date.now();
      // on touch devices click often follows touchend; debounce double clicks
      if(now - lastTouch < 50) return;
      lastTouch = now;
      // toggle visible (use class) — this lets touch users reveal details
      if(overlay.classList.contains('visible')) overlay.classList.remove('visible');
      else overlay.classList.add('visible');
    });
  }

  function render(){
    // clamp idx
    if(products.length === 0){ track.classList.add('empty'); return; }
    idx = ((idx % products.length) + products.length) % products.length;
    const prev = products[(idx - 1 + products.length) % products.length];
    const curr = products[idx];
    const next = products[(idx + 1) % products.length];
    ensureImg(panePrev, prev);
    ensureImg(paneCurr, curr);
    ensureImg(paneNext, next);
    // set accessible labels
    paneCurr.setAttribute('aria-label', (curr && (curr.Brand + ' — ' + curr.Product)) || '');
    overlay.setAttribute('aria-hidden','true');
    // small visual focus animation
    track.style.transform = 'none';
    // after rendering images, attach center interactions (hover/tap)
    requestAnimationFrame(()=> attachCenterInteractions());
  }

  function go(delta){ idx += delta; render(); }

  btnPrev.addEventListener('click', ()=> go(-1));
  btnNext.addEventListener('click', ()=> go(1));

  // Click on side panes to move
  panePrev.addEventListener('click', ()=> go(-1));
  paneNext.addEventListener('click', ()=> go(1));

  // hover on center shows overlay
  paneCurr.addEventListener('mouseenter', ()=> overlay.classList.add('visible'));
  paneCurr.addEventListener('mouseleave', ()=> overlay.classList.remove('visible'));

  // keyboard navigation
  slide.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowLeft') { go(-1); }
    if(e.key === 'ArrowRight') { go(1); }
  });

  // pointer/touch swipe support
  let pointerStart = null;
  let pointerActive = false;
  track.addEventListener('pointerdown', (ev)=>{
    pointerActive = true; pointerStart = ev.clientX; track.setPointerCapture(ev.pointerId);
  });
  track.addEventListener('pointermove', (ev)=>{
    if(!pointerActive || pointerStart==null) return;
    const dx = ev.clientX - pointerStart;
    // small shift for visual feedback
    track.style.transform = `translateX(${dx}px)`;
  });
  track.addEventListener('pointerup', (ev)=>{
    if(!pointerActive) return; pointerActive=false;
    const dx = ev.clientX - pointerStart; pointerStart = null;
    track.style.transform = 'none';
    const threshold = 60;
    if(dx > threshold) go(-1);
    else if(dx < -threshold) go(1);
  });
  track.addEventListener('pointercancel', ()=>{ pointerActive=false; pointerStart=null; track.style.transform='none'; });

  // mouse fallback for desktop (mousedown/drag)
  let mouseDown = false;
  let mouseStartX = null;
  track.addEventListener('mousedown', (ev)=>{
    // only primary button
    if(ev.button !== 0) return;
    mouseDown = true; mouseStartX = ev.clientX; track.classList.add('is-dragging');
    document.body.style.userSelect = 'none';
    ev.preventDefault();
  });
  window.addEventListener('mousemove', (ev)=>{
    if(!mouseDown || mouseStartX==null) return;
    const dx = ev.clientX - mouseStartX;
    track.style.transform = `translateX(${dx}px)`;
  });
  window.addEventListener('mouseup', (ev)=>{
    if(!mouseDown) return; mouseDown=false; document.body.style.userSelect=''; track.classList.remove('is-dragging');
    const dx = (ev.clientX || 0) - (mouseStartX || 0); mouseStartX = null; track.style.transform='none';
    const threshold = 60;
    if(dx > threshold) go(-1);
    else if(dx < -threshold) go(1);
  });
  // cancel drag if leaving window
  window.addEventListener('mouseleave', ()=>{ if(mouseDown){ mouseDown=false; mouseStartX=null; track.style.transform='none'; document.body.style.userSelect=''; track.classList.remove('is-dragging'); } });

  // touch fallback (for browsers that may not support pointer events reliably)
  let touchStartX = null;
  let touchActive = false;
  track.addEventListener('touchstart', (ev)=>{
    if(!ev.touches || !ev.touches[0]) return;
    touchActive = true; touchStartX = ev.touches[0].clientX;
  }, {passive:true});
  track.addEventListener('touchmove', (ev)=>{
    if(!touchActive || touchStartX==null) return;
    const dx = ev.touches[0].clientX - touchStartX;
    // if mainly horizontal, prevent vertical scroll to feel like swipe
    if(Math.abs(dx) > 10) ev.preventDefault();
    track.style.transform = `translateX(${dx}px)`;
  }, {passive:false});
  track.addEventListener('touchend', (ev)=>{
    if(!touchActive) return; touchActive=false;
    const lastX = (ev.changedTouches && ev.changedTouches[0]) ? ev.changedTouches[0].clientX : null;
    const dx = lastX != null && touchStartX != null ? (lastX - touchStartX) : 0;
    touchStartX = null; track.style.transform = 'none';
    const threshold = 60;
    if(dx > threshold) go(-1);
    else if(dx < -threshold) go(1);
  }, {passive:true});

  // Load data and populate products array
  async function load(){
    let rows = null;
    try{ rows = await d3.csv('data/best_selling_products.csv'); }catch(e){ rows = null; }
    if(!rows || !rows.length){
      // fallback simple fetch parse
      try{ const r = await fetch('data/best_selling_products.csv'); if(r.ok){ const txt = await r.text(); const lines = txt.split(/\r?\n/).filter(l=>l.trim()); const hdr = lines.shift().split(',').map(h=>h.trim()); rows = lines.map(l=>{ const cols = l.split(','); const o={}; hdr.forEach((h,i)=> o[h]=cols[i]||''); return o; }); }}catch(e){}
    }
    if(!rows || !rows.length){ container.innerHTML = '<div style="padding:18px;color:var(--muted)">No product data available.</div>'; return; }

    products = rows.map(r=>{
      const imageName = getField(r, ['image','image_name','filename','img']) || r.Image || r.image || '';
      return {
        Brand: getField(r, ['brand','maker','label']) || r.Brand || r.brand || '',
        Product: getField(r, ['product','name','title','item']) || r.Product || r.product || '',
        Price: getField(r, ['price','value','amount']) || r.Price || r.price || '',
        imageName: String(imageName||'').trim(),
        imageUrl: imageName ? ('product_images/' + imageName) : ''
      };
    }).filter(p => p.imageUrl);

    if(products.length === 0){ container.innerHTML = '<div style="padding:18px;color:var(--muted)">No product images found.</div>'; return; }
    // start centered on first item
    idx = 0; render();
    // fade carousel in now that we have content
    requestAnimationFrame(()=>{
      carousel.style.transition = 'opacity 700ms ease, transform 260ms ease';
      carousel.style.opacity = '1';
      carousel.style.pointerEvents = 'auto';
      carousel.removeAttribute('aria-hidden');
    });
  }

  function introSequence(){
    // Show the intro heading and keep it visible, then load the carousel and reveal it.
    const intro = document.getElementById('products-intro-6');
    if(!intro){ load(); return; }
    intro.style.opacity = 0;
    intro.style.transition = 'opacity 900ms ease';
    // fade in intro and keep it visible
    requestAnimationFrame(()=> intro.style.opacity = 1);
    // after a short pause let the carousel load and reveal itself
    setTimeout(()=>{ load(); }, 1000);
  }

  let initialized = false;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting && !initialized){ initialized = true; introSequence(); io.disconnect(); }
    });
  }, { root: document.getElementById('slides'), threshold: 0.4 });
  io.observe(slide);

  setTimeout(()=>{
    if(initialized) return;
    const r = slide.getBoundingClientRect();
    if(r.top < (window.innerHeight||document.documentElement.clientHeight) && r.bottom > 0){ initialized = true; introSequence(); try{ io.disconnect(); }catch(e){} }
  }, 800);

})();
