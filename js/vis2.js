// Bar chart: Total revenue per brand (latest year)
d3.csv("data/luxury_revenue.csv").then(data => {
  const latest = data[data.length - 1]; // 2024
  const bars = [
    {brand: "Gucci", revenue: +latest.Gucci_Revenue_Million_USD},
    {brand: "Coach", revenue: +latest.Coach_Revenue_Million_USD},
    {brand: "Hermes", revenue: +latest.Hermes_Revenue_Million_USD}
  ];

  const container = d3.select('#vis2');
  const M = {t:30, r:30, b:60, l:60};

  function render() {
    container.selectAll('*').remove();
    const W = container.node().clientWidth || 600;
    const H = container.node().clientHeight || 400;
    const svg = container.append('svg').attr('width', W).attr('height', H);

  const x = d3.scaleBand().domain(bars.map(d => d.brand))
    .range([M.l, W - M.r]).padding(0.3);

  const y = d3.scaleLinear().domain([0, d3.max(bars, d => d.revenue)]).nice()
    .range([H - M.b, M.t]);

  // Tooltip for bars
  const barTip = d3.select("body").append("div")
    .attr("class", "bar-tooltip")
    .style("position", "absolute")
    .style("background", "#0b1226")
    .style("border", "1px solid #2b3560")
    .style("padding", "6px 8px")
    .style("border-radius", "6px")
    .style("box-shadow", "0 6px 18px rgba(0,0,0,0.5)")
    .style("pointer-events", "none")
    .style("font-size", "13px")
    .style("color", "#e8ebff")
    .style("opacity", 0);

    svg.selectAll("rect")
    .data(bars)
    .enter().append("rect")
    .attr("x", d => x(d.brand))
    .attr("y", d => y(d.revenue))
    .attr("width", x.bandwidth())
    .attr("height", d => H - M.b - y(d.revenue))
    .attr("fill", (d, i) => ["#c41e3a", "#9b870c", "#ff7f50"][i])
    .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        // highlight bar and show tooltip
        d3.select(this).attr("opacity", 0.8).attr("stroke", "#333").attr("stroke-width", 1.5);
        barTip.transition().duration(80).style("opacity", 1);
        barTip.html(`<strong>${d.brand}</strong><br/>Revenue: $${d.revenue.toLocaleString()}M`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");

        // dispatch selection on hover so the category chart updates
        try {
          window.dispatchEvent(new CustomEvent('brandSelected', { detail: d.brand }));
        } catch (e) {
          if (window.showCategory) window.showCategory(d.brand);
        }
      })
      .on("mousemove", function(event) {
        barTip.style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("opacity", 1).attr("stroke", null);
        barTip.transition().duration(120).style("opacity", 0);
      });

      // when the mouse leaves the entire svg, reset the category holder to the placeholder
      const holder = d3.select('#viz-category-holder');
      svg.on('mouseleave', () => {
        // reset bar visuals
        svg.selectAll('rect').attr('opacity', 1).attr('stroke', null).attr('stroke-width', null);
        // reset the right-hand holder to the placeholder message
        if (!holder.empty()) {
          holder.selectAll('*').remove();
          holder.append('div')
            .attr('id', 'viz-category-placeholder')
            .style('text-align', 'center')
            .style('padding', '8px')
            .style('color', 'var(--muted)')
            .text('Select a company by hovering over its revenue bar');
        }
      });

  // note: selection now happens on hover; click handler removed to avoid conflict

    svg.append("g")
      .attr("transform", `translate(0,${H - M.b})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('fill', '#cfd6ff').attr('font-weight', 600);

    // style y axis
    svg.append("g")
      .attr("transform", `translate(${M.l},0)`) 
      .call(d3.axisLeft(y))
      .selectAll('text')
      .attr('fill', '#cfd6ff').attr('font-weight', 600);

    svg.append("text")
      .attr("x", W / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .attr("font-weight", "600")
      .attr('fill', '#e8ebff')
      .text("2024 Revenue Comparison (Million USD)");
  }

  // initial render and make responsive
  render();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => render(), 160);
  });

});

