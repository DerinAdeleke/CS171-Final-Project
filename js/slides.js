(function(){
  // Basic slide navigation: keep dots in sync, support arrow keys and dot clicks
  const slidesEl = document.getElementById('slides');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots = Array.from(document.querySelectorAll('.dot'));

  function goToSlide(index){
    if(index < 0) index = 0;
    if(index >= slides.length) index = slides.length - 1;
    slides[index].scrollIntoView({behavior:'smooth', block:'start'});
    updateActive(index);
  }

  function updateActive(index){
    dots.forEach((d,i)=>{
      d.classList.toggle('active', i === index);
    });
  }

  // Update active dot on scroll using IntersectionObserver for reliability
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const idx = Number(entry.target.dataset.index || 0);
        updateActive(idx);
      }
    });
  },{root:slidesEl, threshold:0.6});

  slides.forEach(s=>obs.observe(s));

  // Dot click handlers
  dots.forEach(d=>{
    d.addEventListener('click', ()=>{
      const target = Number(d.dataset.target);
      goToSlide(target);
    });
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowDown' || e.key === 'PageDown'){
      e.preventDefault();
      const activeIdx = dots.findIndex(d => d.classList.contains('active'));
      goToSlide(activeIdx + 1);
    } else if(e.key === 'ArrowUp' || e.key === 'PageUp'){
      e.preventDefault();
      const activeIdx = dots.findIndex(d => d.classList.contains('active'));
      goToSlide(activeIdx - 1);
    }
  });

  // Optional: click anywhere on lower half to go next (mobile friendly)
  slidesEl.addEventListener('click', (e)=>{
    // only if clicked background area (not a button or link)
    if(e.target.closest('button, a')) return;
    const y = e.clientY;
    if(y > window.innerHeight * 0.6){
      const activeIdx = dots.findIndex(d => d.classList.contains('active'));
      goToSlide(activeIdx + 1);
    }
  });

})();

// Flip-card stack logic for slide 2
(function(){
  const stack = document.getElementById('card-stack');
  if(!stack) return;

  const cards = Array.from(stack.querySelectorAll('.flip-card'));
  let topIndex = 0; // index of current top card

  function flipTop(){
    if(topIndex >= cards.length) return;
    const top = cards[topIndex];
    top.classList.add('flipped');
    topIndex += 1;
  }

  // allow clicking the stack to flip the top card
  stack.addEventListener('click', (e)=>{
    // ignore clicks that hit buttons/links inside cards if any
    if(e.target.closest('button, a')) return;
    flipTop();
  });

  // also allow keyboard navigation (space/enter)
  stack.addEventListener('keydown', (e)=>{
    if(e.key === ' ' || e.key === 'Enter'){
      e.preventDefault();
      flipTop();
    }
  });

  // make cards focusable for keyboard users
  cards.forEach(c=>{
    c.setAttribute('tabindex','0');
  });

})();

// DID YOU KNOW slide animation (slide-2): fade out first line after 2s, fade in second
(function(){
  const slidesEl = document.getElementById('slides');
  const slide2 = document.getElementById('slide-2');
  if(!slide2) return;
  const first = slide2.querySelector('.dyk-first');
  const second = slide2.querySelector('.dyk-second');
  const arrow = slide2.querySelector('.dyk-arrow');
  if(!first || !second) return;

  // reset to initial state
  function reset(){
    first.classList.remove('hidden'); first.classList.add('visible');
    second.classList.remove('visible'); second.classList.add('hidden');
    if(arrow){ arrow.classList.remove('visible'); arrow.setAttribute('aria-hidden','true'); }
  }

  reset();
  let t = null;

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
      if(entry.isIntersecting){
        // start sequence: ensure initial, then after 2s swap
        reset();
        clearTimeout(t);
        // after 2s fade out the first, then show the second and arrow
        t = setTimeout(()=>{
          first.classList.remove('visible'); first.classList.add('hidden');
          // small gap so the fade looks natural
          setTimeout(()=>{
            second.classList.remove('hidden'); second.classList.add('visible');
            if(arrow){ arrow.classList.add('visible'); arrow.removeAttribute('aria-hidden'); }
          }, 360);
        }, 2000);
      } else {
        clearTimeout(t);
        reset();
      }
    });
  }, { root: slidesEl, threshold: 0.6 });

  io.observe(slide2);
})();

// Slide 3 rotator (three statements cycling above #vis1)
(function(){
  const slidesEl = document.getElementById('slides');
  const slide3 = document.getElementById('slide-3');
  if(!slide3) return;
  const items = Array.from(slide3.querySelectorAll('.rot-item'));
  if(items.length === 0) return;
  let idx = 0;
  let timer = null;

  function showIndex(i){
    items.forEach((it, j) => {
      it.classList.toggle('visible', j === i);
      it.classList.toggle('hidden', j !== i);
    });
  }

  function startCycle(){
    clearTimeout(timer);
    showIndex(idx);
    timer = setTimeout(()=>{
      idx = (idx + 1) % items.length;
      showIndex(idx);
      // schedule next
      timer = setTimeout(cycleStep, 2200);
    }, 2000);
  }

  function cycleStep(){
    idx = (idx + 1) % items.length;
    showIndex(idx);
    timer = setTimeout(cycleStep, 2200);
  }

  function reset(){
    clearTimeout(timer);
    idx = 0;
    items.forEach((it)=>{ it.classList.remove('visible'); it.classList.add('hidden'); });
  }

  // Observe slide visibility and start/stop the cycle accordingly
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
      if(entry.isIntersecting){
        // give a small delay to ensure render
        reset();
        setTimeout(()=>{
          showIndex(0);
          // start cycling after showing first for 2s
          timer = setTimeout(cycleStep, 2000);
        }, 80);
      } else {
        reset();
      }
    });
  }, { root: slidesEl, threshold: 0.6 });

  io.observe(slide3);
})();

// Slide 4 fade-in paragraph
(function(){
  const slidesEl = document.getElementById('slides');
  const slide4 = document.getElementById('slide-4');
  if(!slide4) return;
  const para = slide4.querySelector('.slide4-text');
  const logos = Array.from(slide4.querySelectorAll('.logo-item'));
  const tagline = slide4.querySelector('.slide4-tagline');
  if(!para) return;

  let timers = [];
  function clearTimers(){ timers.forEach(t=>clearTimeout(t)); timers = []; }

  function resetAll(){
    clearTimers();
    // hide para
    para.classList.remove('visible'); para.classList.add('hidden');
    // hide logos
    logos.forEach(l=>{ l.classList.remove('visible'); l.classList.add('hidden'); });
    // hide tagline
    if(tagline){ tagline.classList.remove('visible'); tagline.classList.add('hidden'); }
  }

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        // show paragraph first
        para.classList.remove('hidden'); para.classList.add('visible');
        clearTimers();
        // stagger logos after a short delay so paragraph reads first
        const start = 500; // ms after paragraph appears
        logos.forEach((logo, i) => {
          const t = setTimeout(()=>{
            logo.classList.remove('hidden'); logo.classList.add('visible');
          }, start + i * 420);
          timers.push(t);
        });

        // show tagline after logos finished
        if(tagline){
          const t2 = setTimeout(()=>{
            tagline.classList.remove('hidden'); tagline.classList.add('visible');
          }, start + logos.length * 420 + 300);
          timers.push(t2);
        }
      } else {
        resetAll();
      }
    });
  }, { root: slidesEl, threshold: 0.55 });

  resetAll();
  io.observe(slide4);
})();
