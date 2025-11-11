(function () {

  const BRANDS = ["Hermes", "Gucci", "Coach"];

  const lineRow = d3.select("#brand-lines-row");
  const barRow  = d3.select("#brand-bars-row");

  // Load data
  d3.csv("data/region_category_clean_data.csv").then(raw => {
    const data = raw.map(d => ({
      brand: d.brand,
      category: d.category,
      year: +d.year,
      value: +d.millions_of_dollars
    })).filter(d => d.category && d.category !== "NA" && d.category !== "Total" && d.category !== "Total Coach");

    // Create 3 brand containers
    BRANDS.forEach(brand => {
      lineRow.append("div")
        .attr("class", "brand-cell")
        .attr("id", `line-${brand}`);

      barRow.append("div")
        .attr("class", "brand-cell")
        .attr("id", `bar-${brand}`);
    });

    // Draw charts
    BRANDS.forEach(brand => {
      drawLineChart(`#line-${brand}`, brand, data);
      const defaultYear = d3.max(data.filter(d => d.brand === brand), d => d.year);
      drawBarChart(`#bar-${brand}`, brand, data, defaultYear);
    });
  });

  // --------------------------------------------------------
  // LINE CHART FUNCTION
  // --------------------------------------------------------
  function drawLineChart(target, brand, fullData) {
    const data = fullData.filter(d => d.brand === brand);

    const years = [...new Set(data.map(d => d.year))].sort(d3.ascending);
    const categories = [...new Set(data.map(d => d.category))];

    let palette = d3.schemeSet2;
    if (brand === "Gucci") palette = d3.schemeTableau10;
    if (brand === "Coach") palette = d3.schemePastel1;

    const color = d3.scaleOrdinal().domain(categories).range(palette);

    // Sizing
    const W = 360;    // Each cell width fits 3 columns
    const H = 250;
    const M = { top: 30, right: 20, bottom: 50, left: 55 }; 
    

    // Insert a title above each line chart
    d3.select(target)
        .append("div")
        .style("text-align", "center")
        .style("font-weight", "700")
        .style("margin-bottom", "6px")
        .style("color", "var(--ink)")
        .style("font-size", "15px")
        .text(`${brand} — Revenue by Category (click a year)`);

    const svg = d3.select(target)
      .append("svg")
      .attr("width", W)
      .attr("height", H);

    const g = svg.append("g")
      .attr("transform", `translate(${M.left},${M.top})`);

    // container for the red click line
    const clickLine = g.append("line")
        .attr("class", "click-indicator")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4 4")
        .style("opacity", 0);


    const innerW = W - M.left - M.right;
    const innerH = H - M.top - M.bottom;

    const x = d3.scalePoint()
    .domain(years)
    .range([0, innerW]);

    const y = d3.scaleLinear()
    .domain([0, 7000])        // ✅ fixed for all brands
    .range([innerH, 0]);

    // ----------------------------
    // AXES
    // ----------------------------
    g.append("g")
    .attr("transform", `translate(0,${innerH})`)
    .call(d3.axisBottom(x).tickValues(years));

    g.append("g")
    .call(d3.axisLeft(y).ticks(6));

    // ----------------------------
    // AXIS LABELS
    // ----------------------------
    g.append("text")
    .attr("x", innerW / 2)
    .attr("y", innerH + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "#000")
    .text("Year");                        // ✅ X-axis label

    g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerH / 2)
    .attr("y", -45)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "#000")
    .text("Revenue (million $)");         // ✅ Y-axis label

    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.value));

    const grouped = d3.groups(data, d => d.category);

    g.selectAll(".cat-line")
      .data(grouped)
      .join("path")
      .attr("class", "cat-line")
      .attr("fill", "none")
      .attr("stroke", d => color(d[0]))
      .attr("stroke-width", 2.2)
      .attr("d", d => line(d[1].sort((a, b) => d3.ascending(a.year, b.year))));

    

    // Interaction: click year to update bar
    svg.on("click", event => {
        const [mx] = d3.pointer(event, svg.node());
        const xPos = mx - M.left;

        const nearest = years.reduce((a, b) =>
            Math.abs(x(a) - xPos) < Math.abs(x(b) - xPos) ? a : b
        );


        // move + show the red vertical dashed line
        clickLine
        .attr("x1", x(nearest))
        .attr("x2", x(nearest))
        .attr("y1", 0)
        .attr("y2", innerH)
        .style("opacity", 1);

        // update the bars
        drawBarChart(`#bar-${brand}`, brand, fullData, nearest);
    });


  }

  // --------------------------------------------------------
  // BAR CHART FUNCTION
  // --------------------------------------------------------
    function drawBarChart(target, brand, fullData, year = null) {
    const host = d3.select(target);
    host.selectAll("*").remove();

    const data = fullData.filter(d => d.brand === brand);

    if (!year) {
        year = d3.max(data, d => d.year);
    }

    const rows = data.filter(d => d.year === year);
    if (!rows.length) return;

    const categories = rows.map(d => d.category);

    // choose palette
    let palette = d3.schemeSet2;
    if (brand === "Gucci") palette = d3.schemeTableau10;
    if (brand === "Coach") palette = d3.schemePastel1;

    const color = d3.scaleOrdinal().domain(categories).range(palette);

    // chart size
    const W = 350;
    const H = 240;
    const M = { top: 25, right: 20, bottom: 35, left: 180 };
    

    const svg = host.append("svg")
        .attr("width", W)
        .attr("height", H);

    const innerW = W - M.left - M.right;
    const innerH = H - M.top - M.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${M.left},${M.top})`);

    const x = d3.scaleLinear()
        .domain([0, 7000])   // ✅ FIXED RANGE for all bar charts
        .range([0, innerW]);

    const y = d3.scaleBand()
        .domain(categories)
        .range([0, innerH])
        .padding(0.25);

    // ----- BAR ANIMATION -----
    const bars = g.selectAll(".bar-item")
        .data(rows)
        .join("rect")
        .attr("class", "bar-item")
        .attr("x", 0)
        .attr("y", d => y(d.category))
        .attr("height", y.bandwidth())
        .attr("fill", d => color(d.category))
        .attr("width", 0);                        // ← start collapsed

    bars
        .transition()
        .duration(650)
        .ease(d3.easeCubicOut)
        .attr("width", d => x(d.value));

    // ----- LABEL FADE-IN AFTER BARS GROW -----
    g.selectAll(".bar-label")
        .data(rows)
        .join("text")
        .attr("class", "bar-label")
        .attr("x", d => x(d.value) + 6)
        .attr("y", d => y(d.category) + y.bandwidth() * 0.67)
        .style("opacity", 0)
        .style("font-size", "11px")
        .style("fill", "#000")
        .text(d => d3.format(".1f")(d.value))
        .transition()
        .delay(650)
        .duration(350)
        .style("opacity", 1);

    // axes
    g.append("g")
        .call(d3.axisLeft(y).tickSize(0))
        .selectAll("text")
        .style("font-size", "11px")
        .style("fill", "#000");

    // Bottom axis
    g.append("g")
    .attr("transform", `translate(0,${innerH})`)
    .call(d3.axisBottom(x).ticks(4))
    .selectAll("text")
    .style("font-size", "10px")
    .style("fill", "#000");

    // Axis label
    svg.append("text")
    .attr("x", W * 0.75)
    .attr("y", H - 5)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "#000")
    .text("Revenue (million $)");     // ✅ x label for bar chart


    svg.append("text")
        .attr("x", W / 2)
        .attr("y", 18)
        .style("font-weight", 700)
        .style("font-size", "14px")
        .style("fill", "#000")
        .attr("text-anchor", "middle")
        .text(`${brand} — ${year} Category Breakdown`);
    }


})();
