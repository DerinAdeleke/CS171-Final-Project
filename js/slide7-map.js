// Fresh, presentation-tailored choropleth for slide 7
(function(){
  const csvPath = 'data/geoMap (2).csv';
  const geojsonUrl = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';
  const host = d3.select('#map-svg');
  let brandSelect = d3.select('#brand-select');
  const keyToggle = d3.select('#map-key-toggle');
  const keyPanel = d3.select('#map-key-panel');
  let legendReady = false;

  // lightweight tooltip (uses existing .tooltip class in CSS)
  let tooltip = d3.select('body').select('#map-tooltip');
  if(tooltip.empty()){
    tooltip = d3.select('body').append('div').attr('id','map-tooltip').attr('class','tooltip').style('display','none');
  }

  // normalize country names for matching CSV -> GeoJSON
  function normalize(s){
    if(!s) return '';
    return String(s).normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/\(.+?\)/g,'').replace(/[.,\\/#!$%\\^&\\*;:{}=\\-_`~?@+<>\[\]\\]/g,'').replace(/&/g,' and ').replace(/\s+/g,' ').trim();
  }

  // load data but don't render until slide is visible
  let parsedCSV = null;
  let worldGeo = null;

  Promise.all([ d3.text(csvPath), d3.json(geojsonUrl) ])
    .then(([raw, geo]) => {
      // parse CSV (drop any metadata line)
      const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
      if(lines[0] && lines[0].startsWith('Category:')) lines.shift();
      const cleaned = lines.join('\n');
      parsedCSV = d3.csvParse(cleaned);
      worldGeo = geo;
      // we defer wiring the brand select until the legend panel is built
      // (the select will be inserted into #map-key-panel inside drawCurrent())
    })
    .catch(err => {
      console.warn('Failed to load map data', err);
      host.append('div').text('Map data failed to load').style('color','var(--muted)');
    });

  // Build a lookup from normalized country -> values object
  function buildLookup(){
    const byName = new Map();
    if(!parsedCSV) return byName;
    const cols = parsedCSV.columns;
    // detect brand columns automatically
    const brandCol = { Hermes: null, Gucci: null, Coach: null };
    cols.forEach(c => {
      const lc = c.toLowerCase();
      if(lc.includes('herm')) brandCol.Hermes = c;
      if(lc.includes('gucci')) brandCol.Gucci = c;
      if(lc.includes('coach')) brandCol.Coach = c;
    });

    parsedCSV.forEach(r => {
      const rawName = r[parsedCSV.columns[0]] || '';
      const n = normalize(rawName);
      byName.set(n, {
        Hermes: brandCol.Hermes ? parsePercent(r[brandCol.Hermes]) : NaN,
        Gucci: brandCol.Gucci ? parsePercent(r[brandCol.Gucci]) : NaN,
        Coach: brandCol.Coach ? parsePercent(r[brandCol.Coach]) : NaN
      });
    });
    return byName;
  }

  function parsePercent(s){
    if(s==null) return NaN;
    const t = String(s).trim();
    if(t === '') return NaN;
    return +t.replace('%','').replace(/[^0-9.\-]/g,'') || NaN;
  }

  // Draw map (clean, modern colors tuned to emerald theme)
  let currentSvg = null;
  function drawCurrent(){
    if(!worldGeo || !parsedCSV) return;
    host.selectAll('*').remove();
    const lookup = buildLookup();

    const node = host.node();
    const w = node.clientWidth || Math.max(900, window.innerWidth);
    const h = Math.max(480, window.innerHeight - 80);

    const svg = host.append('svg').attr('width', w).attr('height', h).style('opacity',0);
    currentSvg = svg;

    const features = worldGeo.features.filter(f => {
      const name = f.properties && (f.properties.name || f.properties.admin || f.properties.NAME) || '';
      return name && name.toLowerCase() !== 'antarctica';
    });

    const projection = d3.geoNaturalEarth1().fitExtent([[12,12],[w-12,h-12]], {type:'FeatureCollection', features});
    const path = d3.geoPath().projection(projection);

    const brand = brandSelect.node() ? brandSelect.node().value : 'Hermes';

    // collect values to compute domain
    const vals = features.map(f => {
      const name = f.properties && (f.properties.name || f.properties.admin || f.properties.NAME) || '';
      const vobj = lookup.get(normalize(name));
      return vobj && !isNaN(vobj[brand]) ? vobj[brand] : NaN;
    }).filter(v => !isNaN(v));

    const maxVal = vals.length ? d3.max(vals) : 100;
    // thresholds: 10 slices up to maxVal scaled to percent-like 0..100 if needed
    const thresholds = d3.range(1,10).map(i => (i/10) * maxVal);

    // color ramp - interpolate from very light to deep emerald
    const ramp = d3.range(9).map(t => d3.interpolateLab('#eaf6ef','#044c38')(t/8));
    const noData = '#dbeadf';

    const color = d3.scaleThreshold().domain(thresholds).range(ramp);

    const g = svg.append('g');

    g.selectAll('path').data(features).enter().append('path')
      .attr('d', path)
      .attr('fill', d => {
        const name = d.properties && (d.properties.name || d.properties.admin || d.properties.NAME) || '';
        const vobj = lookup.get(normalize(name));
        const v = vobj && !isNaN(vobj[brand]) ? vobj[brand] : NaN;
        return isNaN(v) ? noData : color(v);
      })
      .attr('stroke', 'rgba(3,10,8,0.5)')
      .attr('stroke-width', 0.4)
      .on('mousemove', function(event,d){
        const name = d.properties && (d.properties.name || d.properties.admin || d.properties.NAME) || '';
        const vobj = lookup.get(normalize(name));
        const v = vobj && !isNaN(vobj[brand]) ? vobj[brand] : NaN;
        const vText = isNaN(v) ? 'No data' : (v + '%');
        tooltip.style('display','block').style('left',(event.pageX+10)+'px').style('top',(event.pageY+10)+'px')
          .html(`<div style="font-weight:700;color:var(--emerald)">${name}</div><div style="margin-top:6px;color:var(--muted)">${vText} (${brand})</div>`);
      })
      .on('mouseleave', ()=> tooltip.style('display','none'));

  // build legend into the right-side collapsible panel
  const panel = d3.select('#map-key-panel');
  panel.html('');
  // Insert control area (brand select) at top of panel
  const ctrl = panel.append('div').attr('class','panel-controls').style('margin-bottom','8px');
  ctrl.append('label').attr('for','brand-select').style('font-weight','700').style('color','var(--muted)').text('Brand');
  const sel = ctrl.append('select').attr('id','brand-select').style('margin-left','8px');
  sel.append('option').attr('value','Hermes').text('Hermès');
  sel.append('option').attr('value','Gucci').text('Gucci');
  sel.append('option').attr('value','Coach').text('Coach');
  // rebind brandSelect variable to the newly-created element and wire change
  brandSelect = d3.select('#brand-select');
  brandSelect.on('change', () => {
    // if map currently visible, redraw
    if(document.getElementById('slide-7') && document.querySelector('.dot.active') ){
      drawCurrent();
    }
  });

  panel.append('div').attr('class','legend-title').text('Legend');
  const items = panel.append('div').attr('class','legend-items');
    const steps = thresholds.length + 1;
    for(let i=0;i<steps;i++){
      const row = items.append('div').attr('class','legend-row');
      const colorBox = i < ramp.length ? ramp[i] : ramp[ramp.length-1];
      row.append('i').style('background', colorBox).style('border','1px solid rgba(0,0,0,0.06)');
      const label = i===0 ? `0-${Math.round(thresholds[0])}` : (i< thresholds.length ? `${Math.round(thresholds[i-1])}-${Math.round(thresholds[i])}` : `${Math.round(thresholds[thresholds.length-1])}+`);
      row.append('span').text(label);
    }
    // add no-data row
    const nod = items.append('div').attr('class','legend-row');
    nod.append('i').style('background', noData).style('border','1px solid rgba(0,0,0,0.06)');
    nod.append('span').text('No data');
  // mark legend as ready so the toggle can open it with content
  legendReady = true;

    // fade in
    svg.transition().duration(420).style('opacity',1);

    // zoom behavior
    const zoom = d3.zoom().scaleExtent([1,6]).on('zoom', (event)=> g.attr('transform', event.transform));
    svg.call(zoom);

    // responsive redraw on resize
    window.addEventListener('resize', () => {
      // quick debounce
      clearTimeout(window.__mapResizeTimer);
      window.__mapResizeTimer = setTimeout(()=> drawCurrent(), 200);
    });
  }

  // wire the floating key toggle
  // ensure we can locate the button even if selection happened early; fallback to DOM
  if(keyToggle.empty()){
    const btn = document.getElementById('map-key-toggle');
    if(btn) keyToggle = d3.select(btn);
  }
  if(keyPanel.empty()){
    const pnl = document.getElementById('map-key-panel');
    if(pnl) keyPanel = d3.select(pnl);
  }

  if(!keyToggle.empty() && !keyPanel.empty()){
    keyToggle.attr('title','Show legend').style('display',null);
    keyToggle.on('click', (event)=>{
      const open = keyPanel.classed('open');
      // if no legend content available yet, show a short message
      if(!legendReady){
        keyPanel.html('');
        keyPanel.append('div').attr('class','legend-title').text('Legend');
        keyPanel.append('div').attr('style','color:var(--muted);font-size:0.95rem').text('Legend will appear once the map has finished loading.');
        keyPanel.classed('open', true).attr('aria-hidden','false');
        return;
      }
      keyPanel.classed('open', !open).attr('aria-hidden', open ? 'true' : 'false');
      if(!open){
        // move focus into panel for accessibility
        setTimeout(()=>{
          const first = keyPanel.node().querySelector('button, a, input, select, [tabindex]');
          if(first) first.focus();
        }, 180);
      }
    });

    // close panel on Escape
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && keyPanel.classed && keyPanel.classed('open')){
        keyPanel.classed('open', false).attr('aria-hidden','true');
      }
    });

    // close when clicking outside
    document.addEventListener('click', (ev)=>{
      const target = ev.target;
      const isToggle = target && (target.id === 'map-key-toggle' || target.closest && target.closest('#map-key-toggle'));
      const isPanel = target && (target.id === 'map-key-panel' || target.closest && target.closest('#map-key-panel'));
      if(!isToggle && !isPanel && keyPanel.classed && keyPanel.classed('open')){
        keyPanel.classed('open', false).attr('aria-hidden','true');
      }
    }, true);
  }

  // Render only when slide 7 intersects to avoid unnecessary work
  const slide7 = document.getElementById('slide-7');
  if(!slide7) return;
  const slideIO = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
      if(entry.isIntersecting){
        // when slide visible, draw map
        drawCurrent();
      } else {
        // when leaving, clear svg to free memory
        host.selectAll('*').remove();
      }
    });
  }, { root: document.getElementById('slides'), threshold: 0.5 });

  slideIO.observe(slide7);

})();
