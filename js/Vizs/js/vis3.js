console.log("vis3: starting bubble chart script");
d3.csv("data/Vizs/data/luxury_revenue.csv").then(data => {
  console.log("vis3: data rows loaded:", data.length);
  data.forEach(d => {
    d.Year = +d.Year;
    d.Gucci = +d.Gucci_Revenue_Million_USD;
    d.Coach = +d.Coach_Revenue_Million_USD;
    d.Hermes = +d.Hermes_Revenue_Million_USD;
  });

  // Convert wide → long format
  const bubbles = [];
  data.forEach(d => {
    bubbles.push({ year: d.Year, brand: "Gucci", revenue: d.Gucci });
    bubbles.push({ year: d.Year, brand: "Coach", revenue: d.Coach });
    bubbles.push({ year: d.Year, brand: "Hermes", revenue: d.Hermes });
  });

  const W = 700, H = 400, M = {t:40, r:40, b:60, l:60};
  const svg = d3.select("#vis3").append("svg")
    .attr("width", W)
    .attr("height", H);

  const x = d3.scaleLinear()
    .domain(d3.extent(bubbles, d => d.year))
    .range([M.l, W - M.r]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(bubbles, d => d.revenue)])
    .range([H - M.b, M.t]);

  const r = d3.scaleSqrt()
    .domain([0, d3.max(bubbles, d => d.revenue)])
    .range([2, 25]);

  const color = d3.scaleOrdinal()
    .domain(["Gucci", "Coach", "Hermes"])
    .range(["#c41e3a", "#9b870c", "#ff7f50"]);

  // Tooltip for bubbles
  const bubbleTip = d3.select("body").append("div")
    .attr("class", "bubble-tooltip")
    .style("position", "absolute")
    .style("background", "#fff")
    .style("border", "1px solid #ccc")
    .style("padding", "6px 8px")
    .style("border-radius", "6px")
    .style("box-shadow", "0 2px 6px rgba(0,0,0,0.12)")
    .style("pointer-events", "none")
    .style("font-size", "13px")
    .style("opacity", 0);

  svg.selectAll("circle")
    .data(bubbles)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.year))
    .attr("cy", d => y(d.revenue))
    .attr("r", d => r(d.revenue))
    .attr("fill", d => color(d.brand))
    .attr("opacity", 0.7)
    .style("cursor", "pointer")
    .on("mouseover", function(event, d) {
      d3.select(this).attr("stroke", "#111").attr("stroke-width", 1.8);
      bubbleTip.transition().duration(80).style("opacity", 1);
      bubbleTip.html(`<strong>${d.brand}</strong><br/>Year: ${d.year}<br/>Revenue: $${d.revenue.toLocaleString()}M`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mousemove", function(event) {
      bubbleTip.style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function() {
      d3.select(this).attr("stroke", null);
      bubbleTip.transition().duration(120).style("opacity", 0);
    });

  svg.append("g")
    .attr("transform", `translate(0,${H - M.b})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  svg.append("g")
    .attr("transform", `translate(${M.l},0)`)
    .call(d3.axisLeft(y));

  svg.append("text")
    .attr("x", W / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .attr("font-weight", "600")
    .text("Luxury Brand Revenue — Bubble Size = Revenue");
}).catch(err => {
  console.error("vis3: failed to load or render bubble chart:", err);
});
