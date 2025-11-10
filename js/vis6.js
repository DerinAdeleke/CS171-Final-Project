// Price distribution comparison (overlapping densities) for three brands
(function(){
  const container = d3.select('#viz-price-dists');
  if (container.empty()) return;

  // brands we'll compare
  const brands = ['Hermes','Gucci','Coach'];
  const colors = d3.scaleOrdinal().domain(brands).range(['#c41e3a','#7dd3fc','#a7f3d0']);

  // helper: find numeric column matching keywords
  function findColumn(columns, keywords) {
    const lc = columns.map(c => c.toLowerCase());
    for (const k of keywords) {
      for (let i=0;i<lc.length;i++){
        if(lc[i].includes(k)) return columns[i];
      }
    }
    return null;
  }

  // KDE helpers
  function kernelEpanechnikov(k) {
    return function(v) {
      return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
  }
  function kernelDensityEstimator(kernel, X) {
    return function(V) {
      return X.map(function(x) {
        return [x, d3.mean(V, function(v) { return kernel(x - v); })];
      });
    };
  }

  // load data
  d3.csv('data/resale_prices.csv').then(data => {
    // assume data contains brand column and numeric columns for price_usd and seller_price
    const columns = data.columns;
    const brandCol = columns.find(c => c.toLowerCase().includes('brand')) || 'Brand';
    // possible price column names
  // prefer specific price column names; avoid the generic 'price' keyword which may match 'seller_price'
  const priceUsdCol = findColumn(columns, ['price_usd','price usd','priceusd','average_price','average price']);
    const sellerPriceCol = findColumn(columns, ['seller_price','sellerprice','seller price','seller']);

    // fallback: try known column names from dataset used earlier (Average_Price_USD)
    const altPrice = columns.find(c => c.toLowerCase().includes('average_price'));
    if(!priceUsdCol && altPrice) {
      // use average price as price_usd if explicit price_usd missing
      
    }

    // prepare per-brand arrays for both metrics
    const metricData = {
      price_usd: {},
      seller_price: {}
    };
    brands.forEach(b => { metricData.price_usd[b] = []; metricData.seller_price[b] = []; });

    data.forEach(d => {
      const brand = (d[brandCol] || d.Brand || '').trim();
      if(!brand) return;
      const bKey = brands.find(b => b.toLowerCase() === brand.toLowerCase());
      if(!bKey) return;

      // price_usd value
      let pu = null;
      if(priceUsdCol && d[priceUsdCol] != null && d[priceUsdCol] !== '') pu = +d[priceUsdCol];
      else if(altPrice && d[altPrice] != null && d[altPrice] !== '') pu = +d[altPrice];

      if(pu != null && !isNaN(pu)) metricData.price_usd[bKey].push(pu);

      // seller price
      let sp = null;
      if(sellerPriceCol && d[sellerPriceCol] != null && d[sellerPriceCol] !== '') sp = +d[sellerPriceCol];
      if(sp != null && !isNaN(sp)) metricData.seller_price[bKey].push(sp);
    });

    // Debug: print which columns we detected so it's easier to diagnose dataset mismatches
    console.log('vis6 detected columns:', {brandCol, priceUsdCol, sellerPriceCol, altPrice});

    // If a metric has no values, fall back to the other metric for that brand or leave empty
    brands.forEach(b => {
      if(metricData.price_usd[b].length === 0 && metricData.seller_price[b].length > 0) metricData.price_usd[b] = metricData.seller_price[b].slice();
      if(metricData.seller_price[b].length === 0 && metricData.price_usd[b].length > 0) metricData.seller_price[b] = metricData.price_usd[b].slice();
    });

    // rendering function
    function render(metricKey){
      container.selectAll('*').remove();
      const W = container.node().clientWidth || 760;
      const H = container.node().clientHeight || 320;
      const margin = {t:16,r:20,b:40,l:48};
      const w = W - margin.l - margin.r;
      const h = H - margin.t - margin.b;

      const svg = container.append('svg').attr('width', W).attr('height', H).attr('viewBox', `0 0 ${W} ${H}`);
      const g = svg.append('g').attr('transform', `translate(${margin.l},${margin.t})`);

      // gather combined values across brands for domain
      let allVals = [];
      brands.forEach(b => { allVals = allVals.concat(metricData[metricKey][b]); });
      if(allVals.length === 0){
        g.append('text').attr('x', w/2).attr('y', h/2).attr('text-anchor','middle').attr('fill','var(--muted)').text('No data available for this metric');
        return;
      }

      // x scale (log scale might be appropriate, but use linear with small positive domain guard)
      const minV = d3.min(allVals);
      const maxV = d3.max(allVals);
      const x = d3.scaleLinear().domain([Math.max(0, minV*0.9), maxV*1.05]).range([0,w]);

      // y scale: density
      const y = d3.scaleLinear().range([h,0]).domain([0,0.05]); // domain will be updated after computing densities

      // create X axis
      const xAxis = d3.axisBottom(x).ticks(6).tickFormat(d3.format('~s'));
      g.append('g').attr('transform', `translate(0,${h})`).call(xAxis).selectAll('text').attr('fill','#cfd6ff');

      // KDE
      const xTicks = x.ticks(80);
      const bandwidth = (maxV - minV) / 24 || (maxV*0.05 || 1);
      const kde = kernelDensityEstimator(kernelEpanechnikov(bandwidth), xTicks);

      // compute per-brand densities
      const densities = brands.map(b => ({brand: b, density: kde(metricData[metricKey][b])}));
      // find max density for y domain
      const maxDensity = d3.max(densities, d => d3.max(d.density, dd => dd[1]));
      y.domain([0, maxDensity * 1.15]);

      // area generator
      const area = d3.area()
        .curve(d3.curveBasis)
        .x(d => x(d[0]))
        .y0(h)
        .y1(d => y(d[1]));

      // draw densities (ordered so darker foreground for later brands)
      densities.forEach((d,i) => {
        g.append('path')
          .datum(d.density)
          .attr('fill', colors(d.brand))
          .attr('fill-opacity', 0.18)
          .attr('stroke', colors(d.brand))
          .attr('stroke-width', 1.6)
          .attr('d', area);
      });

      // legend
      const legend = svg.append('g').attr('transform', `translate(${margin.l + 6},${8})`);
      brands.forEach((b,i)=>{
        const row = legend.append('g').attr('transform', `translate(${i*140},0)`);
        row.append('rect').attr('width',12).attr('height',12).attr('fill',colors(b));
        row.append('text').attr('x',18).attr('y',10).attr('fill','#cfd6ff').text(b);
      });

      // axis label
      svg.append('text').attr('x', margin.l + w/2).attr('y', H-6).attr('text-anchor','middle').attr('fill','#cfd6ff').text(metricKey.replace(/_/g,' '));
    }

    // initial metric
    let currentMetric = 'price_usd';
    render(currentMetric);

    // hook buttons
    const btnPrice = d3.select('#dist-price_usd');
    const btnSeller = d3.select('#dist-seller_price');

    function setActive(key){
      currentMetric = key;
      if(key === 'price_usd'){
        btnPrice.style('background','#1a2150').style('color','var(--ink)');
        btnSeller.style('background','transparent').style('color','var(--muted)');
      } else {
        btnSeller.style('background','#1a2150').style('color','var(--ink)');
        btnPrice.style('background','transparent').style('color','var(--muted)');
      }
      render(currentMetric);
    }

    btnPrice.on('click', ()=> setActive('price_usd'));
    btnSeller.on('click', ()=> setActive('seller_price'));

    // responsive
    let resizeTimer;
    window.addEventListener('resize', ()=>{
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(()=> render(currentMetric), 160);
    });

  }).catch(err => {
    container.selectAll('*').remove();
    container.append('div').style('color','var(--muted)').style('padding','12px').text('Failed to load distribution data');
    console.warn('vis6 load failed', err);
  });

})();
