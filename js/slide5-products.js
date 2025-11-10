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

  // detect likely column names from sheet rows
  function pickField(row, candidates){
    for(const c of candidates){
      for(const key of Object.keys(row||{})){
        if(key.toLowerCase().includes(c)) return row[key];
      }
    }
    return undefined;
  }

  // create an <img> element and check if it loads before adding
  function testImage(url){
    return new Promise((resolve)=>{
      const im = new Image();
      im.onload = ()=> resolve({ok:true, img: im});
      im.onerror = ()=> resolve({ok:false});
      im.src = url;
    });
  }

  // position element randomly within container bounds with padding
  function randomPosition(elWidth, elHeight){
    const pad = 20;
    const rect = container.getBoundingClientRect();
    const maxX = Math.max(0, rect.width - elWidth - pad);
    const maxY = Math.max(0, rect.height - elHeight - pad);
    const left = Math.round(pad + Math.random() * maxX);
    const top = Math.round(pad + Math.random() * maxY);
    return {left, top};
  }

  async function loadProducts(){
    // try to load XLSX using SheetJS (xlsx) if available; otherwise attempt to fetch CSV equivalent
    const xlsxPath = 'data/Best_Selling_Products_Gucci_Coach_Hermes_2025.xlsx';
    let rows = null;

    try{
      // fetch as arrayBuffer
      const resp = await fetch(xlsxPath);
      if(!resp.ok) throw new Error('Could not fetch products xlsx');
      const ab = await resp.arrayBuffer();
      if(window.XLSX){
        const wb = XLSX.read(ab, {type:'array'});
        const first = wb.SheetNames[0];
        rows = XLSX.utils.sheet_to_json(wb.Sheets[first], {defval: ''});
      }
    }catch(err){
      console.warn('Products sheet load failed:', err);
    }

    // fallback: try CSV by guessing a file name
    if(!rows){
      try{
        const csvp = 'data/best_selling_products.csv';
        const r2 = await fetch(csvp);
        if(r2.ok){
          const text = await r2.text();
          // simple CSV parse using split (best-effort)
          const lines = text.split(/\r?\n/).filter(l=>l.trim());
          const hdr = lines.shift().split(',').map(h=>h.trim());
          rows = lines.map(l=>{
            const cols = l.split(',');
            const obj = {};
            hdr.forEach((h,i)=> obj[h]=cols[i]||'');
            return obj;
          });
        }
      }catch(e){ /* ignore */ }
    }

    if(!rows || !rows.length){
      container.innerHTML = '<div style="padding:18px;color:var(--muted)">No product data available.</div>';
      return;
    }

    // determine fields
    // brand field candidates
    const brandCandidates = ['brand','maker','label'];
    const nameCandidates = ['product','name','title','product name','item'];
    const priceCandidates = ['price','retail price','value','amount'];
    const imageCandidates = ['image','image_name','imagefile','filename','img'];

    // go through rows and try to find an image for each
    for(const row of rows){
      const brand = pickField(row, brandCandidates) || '';
      const name = pickField(row, nameCandidates) || '';
      const price = pickField(row, priceCandidates) || '';
      // try explicit image column first
      let imageBase = pickField(row, imageCandidates);
      let found = false;
      let chosenUrl = null;
      let chosenId = null;

      const tryUrls = [];
      if(imageBase){
        // imageBase might include extension or not
        const base = String(imageBase).trim();
        if(base){
          tryUrls.push(base);
          for(const e of exts){ if(!base.toLowerCase().endsWith('.'+e)) tryUrls.push(base + '.' + e); }
        }
      }

      // if no explicit image name, try brand + '_' + slug(name)
      if(!tryUrls.length){
        const guess = (brand?String(brand).trim().toLowerCase() + '_':'') + slug(name);
        for(const e of exts){ tryUrls.push('product_images/' + guess + '.' + e); }
        // also try without brand
        for(const e of exts){ tryUrls.push('product_images/' + slug(name) + '.' + e); }
      } else {
        // normalize explicit entries to be relative to product_images if no path
        const normalized = [];
        for(const u of tryUrls){
          if(u.indexOf('/') === -1) normalized.push('product_images/' + u);
          else normalized.push(u);
        }
        tryUrls.length = 0; tryUrls.push(...normalized);
      }

      // attempt to load each candidate until one succeeds
      for(const url of tryUrls){
        // ensure url is a string and not empty
        if(!url) continue;
        try{
          const res = await testImage(url);
          if(res.ok){
            chosenUrl = url;
            chosenId = url.split('/').pop().replace(/\.[^.]+$/, '');
            found = true;
            break;
          }
        }catch(e){ /* ignore */ }
      }

      if(!found) continue; // skip products without images

      // create image element and place it
      const imgEl = document.createElement('img');
      imgEl.src = chosenUrl;
      imgEl.id = chosenId;
      imgEl.className = 'product-item';
      imgEl.setAttribute('data-brand', brand);
      imgEl.setAttribute('data-name', name);
      imgEl.setAttribute('data-price', price);
      imgEl.alt = name + ' — ' + brand;

      // when image dimensions available, position it
      imgEl.onload = ()=>{
        // limit size if too big
        const naturalW = imgEl.naturalWidth;
        const naturalH = imgEl.naturalHeight;
        // compute displayed size respecting max-width/max-height from CSS
        const containerRect = container.getBoundingClientRect();
        const maxW = Math.min(containerRect.width * 0.18, 260);
        const maxH = Math.min(containerRect.height * 0.26, 260);
        let ratio = Math.min(maxW / naturalW, maxH / naturalH, 1);
        const dispW = Math.round(naturalW * ratio);
        const dispH = Math.round(naturalH * ratio);
        imgEl.style.width = dispW + 'px';
        imgEl.style.height = dispH + 'px';

        const pos = randomPosition(dispW, dispH);
        imgEl.style.left = pos.left + 'px';
        imgEl.style.top = pos.top + 'px';
      };

      // hover interactions
      imgEl.addEventListener('mousemove', (ev)=>{
        const b = imgEl.getAttribute('data-brand');
        const n = imgEl.getAttribute('data-name');
        const p = imgEl.getAttribute('data-price');
        const priceText = formatPrice(p);
        tooltip.innerHTML = `<div>${escapeHtml(b)} — ${escapeHtml(n)}</div><div class="meta">${escapeHtml(priceText)}</div>`;
        tooltip.style.display = 'block';
        const x = ev.pageX + 12;
        const y = ev.pageY + 12;
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
      });
      imgEl.addEventListener('mouseleave', ()=>{ tooltip.style.display = 'none'; });

      container.appendChild(imgEl);
    }
  }

  function formatPrice(s){
    if(s==null) return '—';
    const t = String(s).trim();
    if(t === '') return '—';
    // remove currency symbols and non-numeric chars except dot and comma
    const cleaned = t.replace(/[^0-9.,\-]/g,'');
    // replace commas with empty if they are thousand separators, keep decimal if present
    const parts = cleaned.split(/[,]/);
    let numStr = cleaned;
    if(parts.length>1){
      // assume commas are thousand separators if last part length != 2
      numStr = parts.join('');
    }
    const num = Number(numStr);
    if(!isFinite(num)) return '$' + cleaned;
    return '$' + num.toLocaleString(undefined, {maximumFractionDigits:2});
  }

  // simple HTML escape for tooltip text
  function escapeHtml(s){
    if(s==null) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  // observer to initialize when slide is visible
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        // load once
        loadProducts();
        io.disconnect();
      }
    });
  }, { root: document.getElementById('slides'), threshold: 0.45 });

  io.observe(slide);

})();
