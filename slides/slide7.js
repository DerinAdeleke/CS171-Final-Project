(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-6">
			<div class="slide-content">
				<h2 class="section-title">Market Overview</h2>
				<p class="section-subtitle">The luxury fashion market spans decades of heritage and billions in revenue</p>
				
				<div class="stats-grid">
					<div class="stat-card">
						<div class="stat-number">$42.6B</div>
						<div class="stat-label">Total Revenue 2024</div>
					</div>
					<div class="stat-card">
						<div class="stat-number">42K+</div>
						<div class="stat-label">Resale Items</div>
					</div>
					<div class="stat-card">
						<div class="stat-number">13 Years</div>
						<div class="stat-label">Historical Data</div>
					</div>
				</div>

				<div class="viz-container" style="margin-top: 60px;">
					<div id="overview-chart"></div>
				</div>
			</div>
		</section>
	`);

	window.createOverviewChart = function() {
		const brandColors = window.brandColors;
		const revenueData = window.revenueData;
		const tooltip = d3.select(".tooltip");

		const margin = {top: 40, right: 100, bottom: 60, left: 80};
		const width = 1200 - margin.left - margin.right;
		const height = 400 - margin.top - margin.bottom;

		const svg = d3.select("#overview-chart")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const brands = ["Hermès", "Gucci", "Coach"];
		const x = d3.scaleLinear().domain([2012, 2024]).range([0, width]);
		const y = d3.scaleLinear().domain([0, 20000]).range([height, 0]);

		svg.append("g").attr("class", "grid").attr("opacity", 0.1)
			.call(d3.axisLeft(y).tickSize(-width).tickFormat(""));

		brands.forEach((brand, i) => {
			const line = d3.line()
				.x(d => x(d.Year))
				.y(d => y(d[brand]))
				.curve(d3.curveMonotoneX);

			const path = svg.append("path")
				.datum(revenueData)
				.attr("fill", "none")
				.attr("stroke", brandColors[brand])
				.attr("stroke-width", 3)
				.attr("d", line)
				.attr("opacity", 0.8);

			const totalLength = path.node().getTotalLength();
			path.attr("stroke-dasharray", totalLength + " " + totalLength)
				.attr("stroke-dashoffset", totalLength)
				.transition().duration(2000).delay(i * 300)
				.attr("stroke-dashoffset", 0);

			svg.selectAll(`.dot-${i}`)
				.data(revenueData).enter().append("circle")
				.attr("cx", d => x(d.Year))
				.attr("cy", d => y(d[brand]))
				.attr("r", 0)
				.attr("fill", brandColors[brand])
				.attr("stroke", "#0a0a0a")
				.attr("stroke-width", 2)
				.on("mouseover", function(event, d) {
					d3.select(this).transition().duration(200).attr("r", 8);
					tooltip.style("opacity", 1)
						.html(`<strong>${brand}</strong><br>Year: ${d.Year}<br>Revenue: $${d[brand].toLocaleString()}M`)
						.style("left", (event.pageX + 10) + "px")
						.style("top", (event.pageY - 28) + "px");
				})
				.on("mouseout", function() {
					d3.select(this).transition().duration(200).attr("r", 5);
					tooltip.style("opacity", 0);
				})
				.transition().duration(500).delay((d, j) => i * 300 + j * 50 + 2000)
				.attr("r", 5);
		});

		svg.append("g").attr("class", "axis")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(x).tickFormat(d3.format("d")));

		svg.append("g").attr("class", "axis")
			.call(d3.axisLeft(y).tickFormat(d => `$${d/1000}B`));

		const legend = svg.append("g").attr("transform", `translate(${width + 20}, 20)`);
		brands.forEach((brand, i) => {
			const legendRow = legend.append("g").attr("transform", `translate(0, ${i * 30})`);
			legendRow.append("line")
				.attr("x1", 0).attr("x2", 30).attr("y1", 0).attr("y2", 0)
				.attr("stroke", brandColors[brand]).attr("stroke-width", 3);
			legendRow.append("text")
				.attr("x", 40).attr("y", 5)
				.style("font-size", "13px").style("fill", "#b8b8b8")
				.text(brand);
		});
	};
})();
