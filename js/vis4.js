// Interactive segmented (stacked) bar chart for resale price data
console.log("vis4: starting segmented bar chart script");

d3.csv("data/resale_prices.csv").then(data => {
  console.log("vis4: data rows loaded:", data.length);

  // Parse prices
  data.forEach(d => {
    d.Average_Price_USD = +d.Average_Price_USD;
  });

  // Get unique brands and categories
  const brands = Array.from(new Set(data.map(d => d.Brand)));
  const categories = Array.from(new Set(data.map(d => d.Category)));

  // Stack data: each brand gets its categories stacked
  const stackData = brands.map(brand => {
    const brandData = { brand };
    categories.forEach(cat => {
      const row = data.find(d => d.Brand === brand && d.Category === cat);
      brandData[cat] = row ? row.Average_Price_USD : 0;
    });
    return brandData;
  });

  console.log("vis4: stack data:", stackData);

  const container = d3.select('#vis4');
  const M = {t: 60, r: 140, b: 80, l: 80};

  function render() {
    container.selectAll('*').remove();
    const W = container.node().clientWidth || 700;
    const H = container.node().clientHeight || 450;
    const svg = container.append('svg').attr('width', W).attr('height', H);

  // Scales
  const x = d3.scaleBand()
    .domain(brands)
    .range([M.l, W - M.r])
    .padding(0.25);

  const y = d3.scaleLinear()
    .domain([0, d3.max(stackData, d => d3.sum(categories, cat => d[cat]))])
    .nice()
    .range([H - M.b, M.t]);

  const color = d3.scaleOrdinal()
    .domain(categories)
    .range(["#6366f1", "#ec4899", "#f59e0b"]);

  // Stack generator
  const stack = d3.stack()
    .keys(categories);

  const series = stack(stackData);

  // Tooltip
  const tooltip = d3.select("body").append("div")
    .attr("class", "bar-tooltip")
    .style("position", "absolute")
    .style("background", "#0b1226")
    .style("border", "1px solid #2b3560")
    .style("padding", "8px 12px")
    .style("border-radius", "8px")
    .style("box-shadow", "0 6px 18px rgba(0,0,0,0.45)")
    .style("pointer-events", "none")
    .style("font-size", "14px")
    .style("color", "#e8ebff")
    .style("opacity", 0);

    // Draw stacked bars
    svg.append("g")
      .selectAll("g")
      .data(series)
      .enter()
      .append("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .enter()
      .append("rect")
      .attr("x", d => x(d.data.brand))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .attr("rx", 6)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        const category = d3.select(this.parentNode).datum().key;
        const value = d[1] - d[0];
        d3.select(this).attr("opacity", 0.8).attr("stroke", "#222").attr("stroke-width", 2);
        tooltip.transition().duration(100).style("opacity", 1);
        tooltip.html(`<strong>${d.data.brand}</strong><br/>${category}: $${value.toLocaleString()}`)
          .style("left", (event.pageX + 12) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mousemove", function(event) {
        tooltip.style("left", (event.pageX + 12) + "px")
               .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1).attr("stroke", null);
        tooltip.transition().duration(150).style("opacity", 0);
      });

  // Axes
    svg.append("g")
      .attr("transform", `translate(0, ${H - M.b})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("font-size", "13px")
      .attr("font-weight", 600)
      .attr('fill', '#cfd6ff');

    svg.append("g")
      .attr("transform", `translate(${M.l}, 0)`) 
      .call(d3.axisLeft(y).ticks(6).tickFormat(d => `$${d}`))
      .selectAll('text')
      .attr('fill', '#cfd6ff');

    // Title
    svg.append("text")
      .attr("x", W / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("font-weight", "700")
      .attr("font-size", "18px")
      .attr('fill', '#e8ebff')
      .text("Resale Prices by Brand & Category");

    // Legend
    const legend = svg.append("g")
      .attr("transform", `translate(${W - M.r + 10}, ${M.t})`);

    categories.forEach((cat, i) => {
      const row = legend.append("g")
        .attr("transform", `translate(0, ${i * 26})`);

      row.append("rect")
        .attr("width", 14)
        .attr("height", 14)
        .attr("rx", 4)
        .attr("fill", color(cat));

      row.append("text")
        .attr("x", 20)
        .attr("y", 11)
        .attr("font-size", "13px")
        .attr("font-weight", 600)
        .attr('fill', '#cfd6ff')
        .text(cat);
    });
  }

  // initial render and responsive redraw
  render();
  let resizeTimer4;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer4);
    resizeTimer4 = setTimeout(() => render(), 180);
  });

}).catch(err => {
  console.error("vis4: failed to load or render segmented bar chart:", err);
});
