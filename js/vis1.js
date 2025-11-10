// Multi-line chart comparing Gucci, Coach, and Hermes revenue
d3.csv("data/luxury_revenue.csv").then(data => {
  data.forEach(d => {
    d.Year = +d.Year;
    d.Gucci = +d.Gucci_Revenue_Million_USD;
    d.Coach = +d.Coach_Revenue_Million_USD;
    d.Hermes = +d.Hermes_Revenue_Million_USD;
  });

  const brands = ["Gucci", "Coach", "Hermes"];
  // Allow the presentation to control palette via CSS variables on the container.
  // Fallback to the original palette if variables are not provided.
  const container = d3.select('#vis1');
  const cs = container.node() ? getComputedStyle(container.node()) : null;
  const c1 = (cs && cs.getPropertyValue('--viz-1')) ? cs.getPropertyValue('--viz-1').trim() : '#c41e3a';
  const c2 = (cs && cs.getPropertyValue('--viz-2')) ? cs.getPropertyValue('--viz-2').trim() : '#9b870c';
  const c3 = (cs && cs.getPropertyValue('--viz-3')) ? cs.getPropertyValue('--viz-3').trim() : '#ff7f50';
  const colors = d3.scaleOrdinal()
    .domain(brands)
    .range([c1, c2, c3]);

  // Responsive drawing: compute width from container so svg fills its card
  // annotation paragraph lives outside the svg container; keep a persistent selection
  const annotation = d3.select('#vis1-annotation');
  // another paragraph in the Insights section that should share the same animation
  const insightsPara = d3.select('#insights-annotation');
  const radarPara = d3.select('#radar-annotation');
  // cache the original paragraph text so we can rebuild the animated spans after hiding
  const annotationText = annotation.empty() ? '' : annotation.text().trim();
  const insightsText = insightsPara.empty() ? '' : insightsPara.text().trim();
  const radarText = radarPara.empty() ? '' : radarPara.text().trim();
  function render() {
    container.selectAll('*').remove();
  const W = container.node().clientWidth || 760;
      // Respect the container's computed height (the CSS uses an aspect-ratio to keep the area rectangular).
      const containerHeight = container.node().clientHeight || 400;
      // Use the container height directly but ensure a sensible minimum/maximum so the chart doesn't become extreme
      const H = Math.max(320, Math.min(containerHeight, 1000));

      // Compute margins responsively so the chart keeps breathing room for axes/legend regardless of size
      const M = {
        t: Math.max(24, Math.round(H * 0.08)),
        r: Math.max(60, Math.round(W * 0.14)),
        b: Math.max(40, Math.round(H * 0.12)),
        l: Math.max(50, Math.round(W * 0.08))
      };
    

    const svg = container.append('svg')
      .attr('width', W)
      .attr('height', H)
      .attr('viewBox', `0 0 ${W} ${H}`);

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.Year))
      .range([M.l, W - M.r]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.Gucci, d.Coach, d.Hermes))])
      .nice()
      .range([H - M.b, M.t]);

    const line = brand => d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => x(d.Year))
      .y(d => y(d[brand]));

    // Draw brand lines with animated drawing (stroke-dashoffset)
    brands.forEach((brand, i) => {
      const path = svg.append('path')
        .datum(data)
        .attr('class', 'line-brand')
        .attr('data-brand', brand)
        .attr('fill', 'none')
        .attr('stroke', colors(brand))
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round')
        .attr('d', line(brand));

      try {
        const totalLength = path.node().getTotalLength();
        path
          .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .delay(i * 700)
          .duration(2200)
          .ease(d3.easeCubicOut)
          .attr('stroke-dashoffset', 0);
      } catch (e) {
        path.attr('opacity', 0).transition().duration(800).delay(i * 300).attr('opacity', 1);
      }
    });

    // Animate the explanatory annotation word-by-word while the lines are drawing
    if (!annotation.empty()) {
      const text = annotationText;
      const words = text.length ? text.split(/\s+/) : [];
      // make the parent visible (was initially opacity:0 in HTML)
      annotation.style('opacity', 1);
      annotation.html('');
      // create spans for each word
      const spans = annotation.selectAll('span.word')
        .data(words)
        .enter()
        .append('span')
        .attr('class', 'word')
        .style('display', 'inline-block')
        .style('opacity', 0)
        .style('transform', 'translateY(8px)')
        .style('white-space', 'pre')
        .text(d => d + ' ');

      const baseDelay = 400; // start shortly after lines begin
      const perWord = 80; // ms between words
      spans.each(function(d,i){
        d3.select(this)
          .transition()
          .delay(baseDelay + i * perWord)
          .duration(300)
          .ease(d3.easeCubicOut)
          .style('opacity', 1)
          .style('transform', 'translateY(0px)');
      });
    }

    // Animate the insights paragraph with the same style & timing (if present)
    if (!insightsPara.empty()) {
      const text2 = insightsText;
      const words2 = text2.length ? text2.split(/\s+/) : [];
      insightsPara.style('opacity', 1);
      insightsPara.html('');
      const spans2 = insightsPara.selectAll('span.word')
        .data(words2)
        .enter()
        .append('span')
        .attr('class', 'word')
        .style('display', 'inline-block')
        .style('opacity', 0)
        .style('transform', 'translateY(8px)')
        .style('white-space', 'pre')
        .text(d => d + ' ');

      const baseDelay2 = 400;
      const perWord2 = 80;
      spans2.each(function(d,i){
        d3.select(this)
          .transition()
          .delay(baseDelay2 + i * perWord2)
          .duration(300)
          .ease(d3.easeCubicOut)
          .style('opacity', 1)
          .style('transform', 'translateY(0px)');
      });
    }

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${H - M.b})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')))
      .selectAll('text')
      .attr('fill', (cs && cs.getPropertyValue('--viz-text')) ? cs.getPropertyValue('--viz-text').trim() : '#cfd6ff')
      .attr('font-weight', 600);

    svg.append('g')
      .attr('transform', `translate(${M.l},0)`)
      .call(d3.axisLeft(y))
      .selectAll('text')
      .attr('fill', (cs && cs.getPropertyValue('--viz-text')) ? cs.getPropertyValue('--viz-text').trim() : '#cfd6ff')
      .attr('font-weight', 600);

    // Legend inside chart (top-right)
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${M.l + 10}, ${M.t})`);

    brands.forEach((brand, i) => {
      const row = legend.append('g')
        .attr('transform', `translate(0, ${i * 22})`)
        .style('cursor', 'pointer')
        .on('mouseover', function() {
          svg.selectAll('.line-brand').attr('opacity', 0.2);
          svg.selectAll(`.line-brand[data-brand='${brand}']`).attr('opacity', 1).attr('stroke-width', 4);
        })
        .on('mouseout', function() {
          svg.selectAll('.line-brand').attr('opacity', 1).attr('stroke-width', 2.5);
        });

      row.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('rx', 3)
        .attr('fill', colors(brand));

      row.append('text')
        .attr('x', 18)
        .attr('y', 10)
        .attr('font-size', '13px')
        .attr('font-weight', 600)
        .attr('fill', (cs && cs.getPropertyValue('--viz-text')) ? cs.getPropertyValue('--viz-text').trim() : '#cfd6ff')
        .text(brand);
    });

    svg.append('text')
      .attr('x', W / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-weight', '600')
      .attr('fill', (cs && cs.getPropertyValue('--viz-title')) ? cs.getPropertyValue('--viz-title').trim() : '#e8ebff')
      .text('Luxury Brand Revenues Over Time');
  }

  // initial render and redraw on resize (debounced)
  render();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => render(), 180);
  });

  // Hide the chart and annotation when out of view and restart when scrolled back in.
  // We observe the chart container; when it intersects the viewport we re-render to
  // restart the drawing + text animations. When it leaves, we remove the SVG and
  // hide the annotation (clearing any in-progress transitions by removing nodes).
  try {
    const visNode = container.node();
    if (visNode) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // show and restart animations
            container.style('opacity', 1);
            // Small debounce to avoid thrash when user scrolls quickly
            setTimeout(() => {
              render();
            }, 60);
          } else {
            // hide and stop animations
            // remove svg contents to interrupt any transitions
            container.selectAll('*').remove();
            if (!annotation.empty()) {
              annotation.style('opacity', 0).html('');
            }
          }
        });
      }, { threshold: 0.15 });

      io.observe(visNode);
    }
  } catch (e) {
    // IntersectionObserver may not be supported in very old browsers; in that case do nothing.
    console.warn('vis1: IntersectionObserver not available, skipping scroll-hide behavior', e);
  }

  // Separate observer for the insights paragraph so it animates when that section
  // scrolls into view (independent from the vis1 container). This ensures the
  // short explanatory text above the combined card appears even if #vis1 is off-screen.
  try {
    const insightsNode = insightsPara.node();
    if (insightsNode) {
      const insightsIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // rebuild and animate the insights paragraph
            insightsPara.style('opacity', 1);
            insightsPara.html('');
            const words2 = insightsText.length ? insightsText.split(/\s+/) : [];
            const spans2 = insightsPara.selectAll('span.word')
              .data(words2)
              .enter()
              .append('span')
              .attr('class', 'word')
              .style('display', 'inline-block')
              .style('opacity', 0)
              .style('transform', 'translateY(8px)')
              .style('white-space', 'pre')
              .text(d => d + ' ');

            const baseDelay2 = 200; // start a bit earlier for this short line
            const perWord2 = 50;
            spans2.each(function(d,i){
              d3.select(this)
                .transition()
                .delay(baseDelay2 + i * perWord2)
                .duration(250)
                .ease(d3.easeCubicOut)
                .style('opacity', 1)
                .style('transform', 'translateY(0px)');
            });
          } else {
            insightsPara.style('opacity', 0).html('');
          }
        });
      }, { threshold: 0.15 });

      insightsIO.observe(insightsNode);
    }
  } catch (err) {
    console.warn('insights paragraph: IntersectionObserver not available', err);
  }

  // Separate observer for the radar paragraph to animate when the radar section scrolls into view
  try {
    const radarNode = radarPara.node();
    if (radarNode) {
      const radarIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            radarPara.style('opacity', 1);
            radarPara.html('');
            const words3 = radarText.length ? radarText.split(/\s+/) : [];
            const spans3 = radarPara.selectAll('span.word')
              .data(words3)
              .enter()
              .append('span')
              .attr('class', 'word')
              .style('display', 'inline-block')
              .style('opacity', 0)
              .style('transform', 'translateY(8px)')
              .style('white-space', 'pre')
              .text(d => d + ' ');

            const baseDelay3 = 240;
            const perWord3 = 52;
            spans3.each(function(d,i){
              d3.select(this)
                .transition()
                .delay(baseDelay3 + i * perWord3)
                .duration(300)
                .ease(d3.easeCubicOut)
                .style('opacity', 1)
                .style('transform', 'translateY(0px)');
            });
          } else {
            radarPara.style('opacity', 0).html('');
          }
        });
      }, { threshold: 0.12 });

      radarIO.observe(radarNode);
    }
  } catch (err) {
    console.warn('radar paragraph: IntersectionObserver not available', err);
  }
});
