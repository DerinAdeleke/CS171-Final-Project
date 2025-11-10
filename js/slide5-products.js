// Products gallery for slide 5
(function(){
  const slide = document.getElementById('slide-5');
  if(!slide) return;
  const container = document.getElementById('products-area');
  if(!container) return;

  // Tooltip
  let tooltip = document.createElement('div');
  tooltip.className = 'product-tooltip';
  tooltip.style.display = 'none';
  document.body.appendChild(tooltip);

  // helper to slugify names for guessed filenames
  function slug(s){
    return String(s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
  }

  // candidate file extensions to try
  const exts = ['png','jpg','jpeg','webp'];

  // Fresh, simplified product gallery for slide 5
  (function(){
    const slide = document.getElementById('slide-5');
    if(!slide) return;
    const container = document.getElementById('products-area');
    if(!container) return;

    // create tooltip (reuse CSS .product-tooltip)
    let tooltip = document.querySelector('.product-tooltip');
    if(!tooltip){
      tooltip = document.createElement('div');
      tooltip.className = 'product-tooltip';
      tooltip.style.display = 'none';
      document.body.appendChild(tooltip);
    }

    // helper to get field by fuzzy name
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
      const cleaned = t.replace(/[^0-9.,\-]/g,'');
      const num = Number(cleaned.replace(/,/g,''));
      if(!isFinite(num)) return '$' + cleaned;
      return '$' + num.toLocaleString(undefined, {maximumFractionDigits:2});
    }

    function escapeHtml(s){ return s==null? '': String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

    function rectsOverlap(a,b){
      return !(a.left + a.width < b.left || b.left + b.width < a.left || a.top + a.height < b.top || b.top + b.height < a.top);
    }

    function randomPos(w,h){
      const pad = 18;
      const r = container.getBoundingClientRect();
      const maxX = Math.max(0, r.width - w - pad);
      const maxY = Math.max(0, r.height - h - pad);
      const left = Math.round(pad + Math.random() * maxX);
      const top = Math.round(pad + Math.random() * maxY);
      return {left, top};
    }

    // main loader that accepts an array of product objects
    async function populate(products){
      container.innerHTML = '';
      const placed = [];
      const maxItems = Math.min(products.length, 24); // cap to avoid overcrowding

      for(let i=0;i<maxItems;i++){
        const prod = products[i];
        const imgName = (prod.image || prod.Image || prod.ImageFile || '').trim();
        const imgUrl = imgName ? ('product_images/' + imgName) : null;
        if(!imgUrl) continue;

        // check image load
        const img = new Image();
        img.src = imgUrl;
        await new Promise((res)=>{ img.onload = res; img.onerror = res; });
        if(!img.naturalWidth) continue;

        const el = document.createElement('img');
        el.className = 'product-item';
        el.src = imgUrl;
        el.alt = (prod.Product || prod.product || prod.name || prod.Name || '');
        el.setAttribute('data-brand', (prod.Brand || prod.brand || ''));
        el.setAttribute('data-name', el.alt);
        el.setAttribute('data-price', (prod.Price || prod.price || ''));
        el.style.position = 'absolute';
        el.style.opacity = '0';
        el.style.transform = 'scale(0.92)';

        // sizing
        const containerRect = container.getBoundingClientRect();
        const maxW = Math.min(containerRect.width * 0.18, 260);
        const maxH = Math.min(containerRect.height * 0.26, 260);
        let ratio = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
        const w = Math.round(img.naturalWidth * ratio);
        const h = Math.round(img.naturalHeight * ratio);
        el.style.width = w + 'px';
        el.style.height = h + 'px';

        // find placement
        let placedPos = null;
        for(let attempt=0; attempt<200; attempt++){
          const p = randomPos(w,h);
          const rect = {left:p.left, top:p.top, width:w, height:h};
          let hit=false;
          for(const q of placed){ if(rectsOverlap(rect,q)){ hit=true; break; } }
          if(!hit){ placedPos = p; placed.push(rect); break; }
        }
        if(!placedPos){ placedPos = randomPos(w,h); }
        el.style.left = placedPos.left + 'px';
        el.style.top = placedPos.top + 'px';

        // hover tooltip
        el.addEventListener('mousemove', (ev)=>{
          const b = el.getAttribute('data-brand');
          const n = el.getAttribute('data-name');
          const p = el.getAttribute('data-price');
          tooltip.innerHTML = `<div style="font-weight:700;color:var(--emerald)">${escapeHtml(b)} — ${escapeHtml(n)}</div><div class="meta">${escapeHtml(formatPrice(p))}</div>`;
          tooltip.style.display = 'block';
          tooltip.style.left = (ev.pageX + 12) + 'px';
          tooltip.style.top = (ev.pageY + 12) + 'px';
        });
        el.addEventListener('mouseleave', ()=>{ tooltip.style.display='none'; });

        container.appendChild(el);

        // entrance animation
        requestAnimationFrame(()=>{
          el.style.transition = 'transform 420ms cubic-bezier(.2,.9,.3,1), opacity 420ms ease';
          el.style.opacity = '1';
          el.style.transform = 'scale(1)';
        });
      }
    }

    // load CSV using d3.csv (d3 is available on the page)
    async function loadAndPopulate(){
      let rows = null;
      try{
        rows = await d3.csv('data/best_selling_products.csv');
      }catch(e){ rows = null; }
      if(!rows || !rows.length){
        // try a simple fetch parse as last resort
        try{
          const r = await fetch('data/best_selling_products.csv');
          if(r.ok){ const txt = await r.text();
            const lines = txt.split(/\r?\n/).filter(l=>l.trim());
            const hdr = lines.shift().split(',').map(h=>h.trim());
            rows = lines.map(l=>{ const cols = l.split(','); const o={}; hdr.forEach((h,i)=> o[h]=cols[i]||''); return o; });
          }
        }catch(err){ rows = null; }
      }

      if(!rows || !rows.length){
        container.innerHTML = '<div style="padding:18px;color:var(--muted)">No product data available.</div>';
        return;
      }

      // normalize rows into simple objects with predictable keys
      const products = rows.map(r=>({
        Brand: getField(r, ['brand','maker','label']) || r.Brand || r.brand || '',
        Product: getField(r, ['product','name','title','item']) || r.Product || r.product || '',
        Price: getField(r, ['price','value','amount']) || r.Price || r.price || '',
        image: getField(r, ['image','image_name','filename','img']) || r.Image || r.image || ''
      }));

      populate(products);
    }

    // intro animation sequence: fade in 1.5s, brief hold, fade out, then load
    function introSequence(){
      const intro = document.getElementById('products-intro');
      if(!intro){ loadAndPopulate(); return; }
      intro.style.opacity = 0;
      intro.style.transition = 'opacity 1500ms ease';
      requestAnimationFrame(()=> intro.style.opacity = 1);
      setTimeout(()=>{
        intro.style.transition = 'opacity 800ms ease';
        intro.style.opacity = 0;
        setTimeout(()=>{ intro.style.display = 'none'; loadAndPopulate(); }, 820);
      }, 1500 + 500);
    }

    // Initialize when slide enters view; also provide a fallback timeout for environments
    // where IntersectionObserver doesn't trigger (file:// or different scroll parents)
    let initialized = false;
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting && !initialized){ initialized = true; introSequence(); io.disconnect(); }
      });
    }, { root: document.getElementById('slides'), threshold: 0.4 });
    io.observe(slide);

    // fallback after 800ms
    setTimeout(()=>{
      if(initialized) return;
      const r = slide.getBoundingClientRect();
      if(r.top < (window.innerHeight||document.documentElement.clientHeight) && r.bottom > 0){ initialized = true; introSequence(); try{ io.disconnect(); }catch(e){} }
    }, 800);

  })();

