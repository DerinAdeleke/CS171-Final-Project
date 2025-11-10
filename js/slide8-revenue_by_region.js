(function () {

  const BRANDS = ["Hermes", "Gucci", "Coach"];
  const COLORS = d3.schemeTableau10;  // beautiful & consistent

  const pieRow = d3.select("#pie-row");

  // Create brand containers
  BRANDS.forEach(brand => {
    pieRow.append("div")
      .attr("class", "pie-cell")
      .attr("id", `pie-${brand}`)
      .style("width", "300px")
      .style("height", "300px");
  });

  // Load data -----------------------------------------------------
  d3.csv("data/region_category_clean_data.csv").then(raw => {
    const data = raw.map(d => ({
      brand: d.brand,
      region: d.region,
      year: +d.year,
      value: +d.millions_of_dollars
    }))
    .filter(d => d.region && d.region !== "NA" && d.region !== "Total" && d.region !== "Total Asia" && d.region !== "Total Europe");

    // Initial draw
    updateAll();

    // Slider interaction ------------------------------------------
    const s = document.getElementById("yearStart");
    const e = document.getElementById("yearEnd");

    s.oninput = () => {
      if (+s.value > +e.value) s.value = e.value;
      updateAll();
    };
    e.oninput = () => {
      if (+e.value < +s.value) e.value = s.value;
      updateAll();
    };

    // ----------------- Update all pies ---------------------------
    function updateAll() {
      const startYear = +document.getElementById("yearStart").value;
      const endYear = +document.getElementById("yearEnd").value;

      // update year labels
      document.getElementById("yearStartLabel").textContent = startYear;
      document.getElementById("yearEndLabel").textContent = endYear;

      BRANDS.forEach(brand => {
        updatePie(`#pie-${brand}`, brand, data, startYear, endYear);
      });
    }

    // --------------------------------------------------------
    // Pie chart drawing function
    // --------------------------------------------------------
    function updatePie(target, brand, fullData, startY, endY) {
      const container = d3.select(target);
      container.selectAll("*").remove();

      const filtered = fullData.filter(
        d => d.brand === brand && d.year >= startY && d.year <= endY
      );

      // Aggregate revenue by region over selected years
      const grouped = Array.from(
        d3.rollup(filtered, v => d3.sum(v, d => d.value), d => d.region),
        ([region, total]) => ({ region, total })
      );

      // Basic sizing
      const W = 300, H = 300;
      const R = Math.min(W, H) * 0.33;

      const svg = container.append("svg")
        .attr("width", W)
        .attr("height", H);

      svg.append("text")
        .attr("x", W / 2)
        .attr("y", 18)
        .attr("text-anchor", "middle")
        .style("font-weight", 600)
        .style("font-size", "16px")
        .text(`${brand} Revenue by Region (${startY}–${endY})`);

      const g = svg.append("g")
        .attr("transform", `translate(${W/2},${H/2 + 10})`);

      const color = d3.scaleOrdinal()
        .domain(grouped.map(d => d.region))
        .range(COLORS);

      const pie = d3.pie()
        .value(d => d.total)
        .sort(null);

      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(R);

      // Draw slices
      g.selectAll("path")
        .data(pie(grouped))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.region))
        .style("stroke", "#fff")
        .style("stroke-width", "2px")
        .append("title")
        .text(d => `${d.data.region}: ${d.data.total.toLocaleString()} M$`);

      // Legend
      const legend = svg.append("g")
        .attr("transform", `translate(${W - 110}, ${60})`);

      legend.selectAll("legend-item")
        .data(grouped)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(0, ${i * 18})`)
        .each(function (d) {
          const row = d3.select(this);
          row.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", color(d.region));
          row.append("text")
            .attr("x", 18)
            .attr("y", 10)
            .style("font-size", "12px")
            .style("fill", "#333")
            .text(d.region);
        });
    }

  });

})();
