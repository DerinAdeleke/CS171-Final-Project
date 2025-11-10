// Brand profile radar chart for Slide 10
(function(){
  const container = d3.select('#brand-viz');
  if(container.empty()) return;

  // Sample multidimensional data (0-100 scale)
  const dimensions = ['Heritage','Digital Presence','Price Point','Accessibility','Search Interest','Resale Strength'];
  const data = [
    {brand: 'Gucci', values: [70, 90, 85, 60, 90, 75]},
    {brand: 'Coach', values: [50, 60, 45, 80, 55, 45]},
    {brand: 'Hermes', values: [95, 55, 100, 30, 85, 95]}
  ];

  // Colors from CSS variables (fallback to palette)
  const cs = container.node() ? getComputedStyle(container.node()) : null;
  const c1 = (cs && cs.getPropertyValue('--bp-1')) ? cs.getPropertyValue('--bp-1').trim() : '#046b4a';
  const c2 = (cs && cs.getPropertyValue('--bp-2')) ? cs.getPropertyValue('--bp-2').trim() : '#9b870c';
  const c3 = (cs && cs.getPropertyValue('--bp-3')) ? cs.getPropertyValue('--bp-3').trim() : '#d85a3a';
  const textColor = (cs && cs.getPropertyValue('--bp-text')) ? cs.getPropertyValue('--bp-text').trim() : '#052018';

  function render(){
    container.selectAll('*').remove();
    const W = container.node().clientWidth || 760;
    const H = container.node().clientHeight || 420;
    const svg = container.append('svg').attr('width', W).attr('height', H).attr('viewBox', `0 0 ${W} ${H}`);

    const cx = W / 2;
    const cy = H / 2;
    const radius = Math.min(W, H) * 0.36;
    const angleSlice = (Math.PI * 2) / dimensions.length;

    // scale for values
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);

    // draw gridlines and axis labels
    const levels = 4;
    const grid = svg.append('g').attr('class','radar-grid');
    for(let level=1; level<=levels; level++){
      const r = radius * (level/levels);
      grid.append('circle')
        .attr('cx', cx).attr('cy', cy).attr('r', r)
        .attr('fill','none').attr('stroke','rgba(2,6,23,0.06)').attr('stroke-width',1);
    }

    // axis lines and labels
    const axis = svg.append('g').attr('class','radar-axis');
    dimensions.forEach((d,i)=>{
      const angle = i * angleSlice - Math.PI/2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      axis.append('line')
        .attr('x1', cx).attr('y1', cy).attr('x2', x).attr('y2', y)
        .attr('stroke','rgba(2,6,23,0.08)').attr('stroke-width',1);
      // label
      axis.append('text')
        .attr('x', cx + Math.cos(angle) * (radius + 18))
        .attr('y', cy + Math.sin(angle) * (radius + 18))
        .attr('text-anchor', Math.cos(angle) > 0.1 ? 'start' : Math.cos(angle) < -0.1 ? 'end' : 'middle')
        .attr('dominant-baseline','central')
        .attr('fill', textColor)
        .attr('font-weight', 600)
        .attr('font-size', 12)
        .text(d);
    });

    // function to make polygon path
    function radarLine(values){
      return d3.lineRadial()
        .radius(d => rScale(d))
        .angle((v,i) => i * angleSlice)(values);
    }

    const radarG = svg.append('g').attr('transform', `translate(${cx},${cy})`);

    // draw areas for each brand with slight transparency and stroke
    const palette = [c1, c2, c3];
    data.forEach((row, idx) => {
      const g = radarG.append('g').attr('class','radar-brand');
      const values = row.values;
      // area
      g.append('path')
        .datum(values)
        .attr('d', radarLine(values))
        .attr('fill', palette[idx])
        .attr('fill-opacity', 0.12)
        .attr('stroke', palette[idx])
        .attr('stroke-width', 2);

      // draw points
      values.forEach((v,i)=>{
        const ang = i * angleSlice - Math.PI/2;
        const px = Math.cos(ang) * rScale(v);
        const py = Math.sin(ang) * rScale(v);
        g.append('circle').attr('cx', px).attr('cy', py).attr('r', 4).attr('fill', palette[idx]).attr('stroke','#fff').attr('stroke-width',1);
      });
    });

    // legend
    const legend = svg.append('g').attr('transform', `translate(${W - 140}, ${18})`);
    data.forEach((d, i)=>{
      const row = legend.append('g').attr('transform', `translate(0, ${i*22})`);
      row.append('rect').attr('width',12).attr('height',12).attr('rx',3).attr('fill', palette[i]);
      row.append('text').attr('x',18).attr('y',10).attr('fill', textColor).attr('font-weight',700).attr('font-size',13).text(d.brand);
    });
  }

  // typewriter animation for the write-up
  function typeWrite(targetSelector, text, speed=28){
    const el = document.querySelector(targetSelector);
    if(!el) return;
    el.innerHTML = '';
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    el.appendChild(cursor);

    function step(){
      if(i < text.length){
        cursor.insertAdjacentText('beforebegin', text[i]);
        i++;
        setTimeout(step, speed);
      } else {
        // remove cursor after done
        cursor.remove();
      }
    }
    step();
  }

  // paragraph comparing the three brands based on the radar
  const paragraph = `Gucci stands out for its strong digital presence and high price positioning while maintaining robust resale strength — a brand driven by cultural relevance and broad global interest. Coach is more accessible: it scores higher on affordability and reach but lags on heritage and resale, reflecting its mass-luxury positioning and concentrated regional demand. Hermès shows exceptional heritage and resale strength but a narrower accessibility profile and lower digital reach, underscoring its boutique, heritage-driven prestige in mature markets.`;

  // initial render and behaviors
  render();
  // re-render on resize
  let rt;
  window.addEventListener('resize', ()=>{ clearTimeout(rt); rt = setTimeout(()=> render(), 160); });

  // when slide 10 comes into view, start typing the paragraph
  const slide = document.getElementById('slide-10');
  if(slide){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          typeWrite('#brand-writeup', paragraph, 24);
          io.disconnect();
        }
      });
    }, { root: document.getElementById('slides'), threshold: 0.2 });
    io.observe(slide);
  } else {
    // fallback: type after small delay
    setTimeout(()=> typeWrite('#brand-writeup', paragraph, 24), 600);
  }
})();
