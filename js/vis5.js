// Radar chart for brand dimensions: Revenue, Avg Resale Price, Search Interest, Category Diversity
(function(){
  const container = d3.select('#radar');
  if (container.empty()) return;

  // helper: parse percent like '44%'
  function parsePct(s){
    if(s==null) return NaN;
    const t = String(s).trim();
    if(t === '' ) return NaN;
    return +t.replace('%','').replace(/[^0-9.\-]/g,'') || NaN;
  }

  // load datasets in parallel
  Promise.all([
    d3.csv('data/luxury_revenue.csv'),
    d3.csv('data/resale_prices.csv'),
    d3.text('data/geoMap (2).csv'),
    d3.csv('data/region_category_clean_data.csv')
  ]).then(([lux, resale, geoText, region]) => {
    try {
      // compute metrics per brand
      const brands = ['Hermes','Gucci','Coach'];

      // revenue: latest year (assume last row)
      const latest = lux && lux.length ? lux[lux.length-1] : {};
      const revenue = {};
      brands.forEach(b => {
        const key = `${b}_Revenue_Million_USD`;
        revenue[b] = latest && latest[key] ? +latest[key] : 0;
      });

      // avg resale price
      const avgResale = {};
      brands.forEach(b => {
        const rows = resale.filter(r => r.Brand && r.Brand.trim().toLowerCase() === b.toLowerCase());
        const vals = rows.map(r => +r.Average_Price_USD).filter(v => !isNaN(v));
        avgResale[b] = vals.length ? d3.mean(vals) : 0;
      });

      // parse geo CSV (may have leading metadata line)
      let geoRows = geoText.split(/\r?\n/).filter(l => l.trim().length>0);
      if(geoRows[0] && geoRows[0].startsWith('Category:')) geoRows.shift();
      const parsedGeo = d3.csvParse(geoRows.join('\n'));
      // find brand columns
      const brandCols = { Hermes: null, Gucci: null, Coach: null };
      parsedGeo.columns.forEach(c => {
        const lc = c.toLowerCase();
        if(lc.includes('herm')) brandCols.Hermes = c;
        if(lc.includes('gucci')) brandCols.Gucci = c;
        if(lc.includes('coach')) brandCols.Coach = c;
      });
      const avgSearch = {};
      brands.forEach(b => {
        const col = brandCols[b];
        if(!col) { avgSearch[b] = 0; return; }
        const vals = parsedGeo.map(r => parsePct(r[col])).filter(v => !isNaN(v));
        avgSearch[b] = vals.length ? d3.mean(vals) : 0;
      });

      // category diversity: unique categories per brand in region dataset
      const catCount = {};
      brands.forEach(b => {
        const filtered = region.filter(r => (r.brand || r.Brand || '').toLowerCase() === b.toLowerCase());
        const cats = Array.from(new Set(filtered.map(r => (r.category || r.Category || '').trim()).filter(x => x)));
        catCount[b] = cats.length;
      });

      // assemble raw metrics and normalize
      const metrics = ['Revenue','AvgResale','SearchInterest','CategoryDiversity'];
      const raw = {};
      brands.forEach(b => {
        raw[b] = {
          Revenue: revenue[b] || 0,
          AvgResale: avgResale[b] || 0,
          SearchInterest: avgSearch[b] || 0,
          CategoryDiversity: catCount[b] || 0
        };
      });

      // compute max per metric for normalization
      const maxima = {};
      metrics.forEach(m => {
        maxima[m] = d3.max(brands.map(b => raw[b][m]));
        if(maxima[m] === 0 || isNaN(maxima[m])) maxima[m] = 1; // avoid div by 0
      });

      // build radar-friendly data (normalized 0..1)
      const radarData = brands.map(b => {
        return metrics.map(m => ({ axis: m, value: Math.max(0, raw[b][m] / maxima[m]) }));
      });

      // label mapping for axes
      const axisLabels = {
        Revenue: 'Revenue (normalized)',
        AvgResale: 'Avg Resale Price (normalized)',
        SearchInterest: 'Search Interest (normalized)',
        CategoryDiversity: 'Category Diversity (normalized)'
      };

      // drawing
      function render(){
        container.selectAll('*').remove();
        const W = container.node().clientWidth || 900;
        const H = container.node().clientHeight || 420;
        const pad = 24;
        const svg = container.append('svg').attr('width', W).attr('height', H).attr('viewBox', `0 0 ${W} ${H}`);

        const cx = W / 2;
        const cy = H / 2 + 10;
        const radius = Math.min(W, H) / 2 - 80;

        const allAxes = metrics;
        const total = allAxes.length;
        const angleSlice = Math.PI * 2 / total;

        // concentric circles
        const levels = 4;
        const axisGrid = svg.append('g').attr('class','axis-grid');
        for(let lvl=1; lvl<=levels; lvl++){
          const r = radius * (lvl/levels);
          axisGrid.append('circle')
            .attr('cx',cx).attr('cy',cy).attr('r',r)
            .attr('fill','none').attr('stroke','#203052').attr('stroke-width',1);
        }

        // axis lines and labels
        const axisG = svg.append('g').attr('class','axes');
        allAxes.forEach((d,i) =>{
          const angle = angleSlice * i - Math.PI/2;
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);
          axisG.append('line').attr('x1',cx).attr('y1',cy).attr('x2',x).attr('y2',y).attr('stroke','#2b3b63').attr('stroke-width',1);
          const lx = cx + (radius + 18) * Math.cos(angle);
          const ly = cy + (radius + 18) * Math.sin(angle);
          axisG.append('text').attr('x', lx).attr('y', ly)
            .attr('text-anchor', Math.cos(angle) > 0.1 ? 'start' : (Math.cos(angle) < -0.1 ? 'end' : 'middle'))
            .attr('dominant-baseline','central')
            .attr('fill','#cfd6ff')
            .attr('font-size',12)
            .text(axisLabels[d]);
        });

        const color = d3.scaleOrdinal().domain(brands).range(['#c41e3a','#7dd3fc','#a7f3d0']);

        // radial line generator
        const radialLine = d3.lineRadial()
          .radius(d => d[1]*radius)
          .angle((d,i) => i * angleSlice)
          .curve(d3.curveCatmullRom.alpha(0.5));

        // prepare data in [ [axisIndex,value] ] per brand
        const structured = radarData.map(series => series.map((pt, idx) => [idx, pt.value]));

        const radarG = svg.append('g').attr('transform', `translate(${cx},${cy})`);

        // polygons
        structured.forEach((s,bi) => {
          const path = radarG.append('path')
            .datum(s)
            .attr('d', radialLine)
            .attr('fill', color(brands[bi]))
            .attr('fill-opacity', 0.12)
            .attr('stroke', color(brands[bi]))
            .attr('stroke-width', 2);

          // dots
          radarG.selectAll(`.dot-${bi}`)
            .data(s)
            .enter()
            .append('circle')
            .attr('cx', d => Math.cos(d[0]*angleSlice - Math.PI/2) * d[1]*radius)
            .attr('cy', d => Math.sin(d[0]*angleSlice - Math.PI/2) * d[1]*radius)
            .attr('r', 4)
            .attr('fill', color(brands[bi]))
            .attr('stroke','#0b1020')
            .attr('stroke-width',1);
        });

        // legend
        const legend = svg.append('g').attr('transform', `translate(${W-160},${20})`);
        brands.forEach((b,i) => {
          const row = legend.append('g').attr('transform', `translate(0,${i*20})`);
          row.append('rect').attr('width',12).attr('height',12).attr('fill',color(b));
          row.append('text').attr('x',18).attr('y',9).attr('fill','#cfd6ff').attr('font-size',12).text(b);
        });

        // title
        svg.append('text').attr('x', W/2).attr('y', 20).attr('text-anchor','middle').attr('fill','#e8ebff').attr('font-weight',700).text('Brand Profile — Multi-dimensional View');
      }

      // initial render and responsive
      render();
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => render(), 180);
      });

    } catch (err) {
      container.selectAll('*').remove();
      container.append('div').style('color','var(--muted)').style('padding','12px').text('Failed to build radar chart: '+(err && err.message));
      console.error('vis5 radar error', err);
    }
  }).catch(err => {
    container.selectAll('*').remove();
    container.append('div').style('color','var(--muted)').style('padding','12px').text('Failed to load data for radar chart');
    console.warn('vis5: data load failed', err);
  });

})();
