(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-6-5">
			<div class="slide-content">
				<h2 class="section-title">Market Flow</h2>
				<p class="section-subtitle">Visualizing the ebb and flow of luxury brand dominance</p>
				
				<div class="viz-container" style="margin-top: 4vh;">
					<div id="streamgraph-chart"></div>
				</div>
			</div>
		</section>
	`);

	window.createStreamgraph = function() {
		const brandColors = window.brandColors;
		const revenueData = window.revenueData;
		const tooltip = d3.select(".tooltip");

		const width = 1200;
		const height = 500;
		const margin = {top: 40, right: 120, bottom: 60, left: 80};

		// Transform revenue data into stacked format
		const brands = ['Hermès', 'Gucci', 'Coach'];
		const years = d3.range(2012, 2025);

		// Prepare data for stack
		const data = years.map(year => {
			const obj = {year: year};
			brands.forEach(brand => {
				const yearData = revenueData.find(d => d.Year === year);
				obj[brand] = yearData ? yearData[brand] : 0;
			});
			return obj;
		});

		// Create stack layout with offset silhouette for centered streams
		const stack = d3.stack()
			.keys(brands)
			.order(d3.stackOrderNone)
			.offset(d3.stackOffsetSilhouette); // Creates the centered, flowing effect

		const series = stack(data);

		// Scales
		const x = d3.scaleLinear()
			.domain(d3.extent(years))
			.range([margin.left, width - margin.right]);

		const y = d3.scaleLinear()
			.domain([
				d3.min(series, s => d3.min(s, d => d[0])),
				d3.max(series, s => d3.max(s, d => d[1]))
			])
			.range([height - margin.bottom, margin.top]);

		// Brand colors
		const color = d3.scaleOrdinal()
			.domain(brands)
			.range([brandColors['Hermès'], brandColors['Gucci'], brandColors['Coach']]);

		// Area generator with curves for smooth flow
		const area = d3.area()
			.x(d => x(d.data.year))
			.y0(d => y(d[0]))
			.y1(d => y(d[1]))
			.curve(d3.curveBasis); // Smooth, flowing curves

		const svg = d3.select("#streamgraph-chart")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		// Create paths for each brand
		const paths = svg.selectAll("path")
			.data(series)
			.join("path")
			.attr("fill", d => color(d.key))
			.attr("d", area)
			.attr("opacity", 0.8)
			.on("mouseover", function(event, d) {
				d3.select(this)
					.attr("opacity", 1)
					.attr("stroke", "#d4af37")
					.attr("stroke-width", 2);
				
				tooltip.style("opacity", 1)
					.html(`<strong>${d.key}</strong><br/>Hover over chart for details`)
					.style("left", (event.pageX + 10) + "px")
					.style("top", (event.pageY - 28) + "px");
			})
			.on("mouseout", function(event, d) {
				d3.select(this)
					.attr("opacity", 0.8)
					.attr("stroke", "none");
				
				tooltip.style("opacity", 0);
			});

		// Animate entrance
		paths.each(function() {
			const totalLength = this.getTotalLength();
			d3.select(this)
				.attr("stroke-dasharray", totalLength + " " + totalLength)
				.attr("stroke-dashoffset", totalLength)
				.transition()
				.duration(2000)
				.attr("stroke-dashoffset", 0);
		});

		// Add axes
		svg.append("g")
			.attr("class", "axis")
			.attr("transform", `translate(0,${height - margin.bottom})`)
			.call(d3.axisBottom(x).tickFormat(d3.format("d")))
			.call(g => g.select(".domain").attr("stroke", "#d4af37"));

		// Add legend with brand labels
		const legend = svg.selectAll(".legend")
			.data(brands)
			.join("g")
			.attr("class", "legend")
			.attr("transform", (d, i) => `translate(${width - 100}, ${margin.top + i * 30})`);

		legend.append("rect")
			.attr("width", 20)
			.attr("height", 20)
			.attr("fill", d => color(d))
			.attr("opacity", 0.8);

		legend.append("text")
			.attr("x", 30)
			.attr("y", 15)
			.text(d => d)
			.attr("fill", "#f5f5f5")
			.style("font-size", "14px");

		// Interactive year scrubber
		const scrubberLine = svg.append("line")
			.attr("stroke", "#d4af37")
			.attr("stroke-width", 2)
			.attr("opacity", 0)
			.attr("y1", margin.top)
			.attr("y2", height - margin.bottom);

		const scrubberGroup = svg.append("g")
			.attr("class", "scrubber-labels")
			.attr("opacity", 0);

		const overlay = svg.append("rect")
			.attr("x", margin.left)
			.attr("y", margin.top)
			.attr("width", width - margin.left - margin.right)
			.attr("height", height - margin.top - margin.bottom)
			.attr("fill", "none")
			.attr("pointer-events", "all")
			.on("mousemove", function(event) {
				const [mouseX] = d3.pointer(event);
				const year = Math.round(x.invert(mouseX));
				
				if (year >= 2012 && year <= 2024) {
					scrubberLine
						.attr("opacity", 1)
						.attr("x1", x(year))
						.attr("x2", x(year));

					// Clear previous labels
					scrubberGroup.selectAll("*").remove();
					scrubberGroup.attr("opacity", 1);

					// Find data for this year
					const yearData = data.find(d => d.year === year);
					if (yearData) {
						// Add labels for each brand
						brands.forEach((brand, i) => {
							const labelG = scrubberGroup.append("g");
							
							labelG.append("rect")
								.attr("x", x(year) + 5)
								.attr("y", margin.top + i * 25)
								.attr("width", 120)
								.attr("height", 22)
								.attr("fill", "#1a1a1a")
								.attr("stroke", color(brand))
								.attr("stroke-width", 1)
								.attr("opacity", 0.9);

							labelG.append("text")
								.attr("x", x(year) + 10)
								.attr("y", margin.top + i * 25 + 15)
								.attr("fill", "#f5f5f5")
								.style("font-size", "12px")
								.text(`${brand}: $${yearData[brand].toLocaleString()}M`);
						});

						// Year label
						scrubberGroup.append("text")
							.attr("x", x(year))
							.attr("y", margin.top - 10)
							.attr("text-anchor", "middle")
							.attr("fill", "#d4af37")
							.style("font-size", "16px")
							.style("font-weight", "bold")
							.text(year);
					}
				}
			})
			.on("mouseout", function() {
				scrubberLine.attr("opacity", 0);
				scrubberGroup.attr("opacity", 0);
			});
	};
})();
