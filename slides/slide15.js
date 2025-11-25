(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-12">
			<div class="slide-content">
				<h2 class="section-title">Resale Market</h2>
				<p class="section-subtitle">Secondary market reveals brand value retention and desirability</p>
				
				<div class="viz-container">
					<div id="resale-chart"></div>
				</div>
				
				<div class="controls">
					<button class="luxury-button active" data-category="all">All Categories</button>
					<button class="luxury-button" data-category="Accessories">Accessories</button>
					<button class="luxury-button" data-category="Apparel">Apparel</button>
					<button class="luxury-button" data-category="Shoes">Shoes</button>
				</div>
			</div>
		</section>
	`);

	window.createResaleChart = function() {
		const brandColors = window.brandColors;
		const resaleData = window.resaleData;
		const tooltip = d3.select(".tooltip");

		const margin = {top: 60, right: 120, bottom: 120, left: 100};
		const width = 1200 - margin.left - margin.right;
		const height = 500 - margin.top - margin.bottom;

		const svg = d3.select("#resale-chart")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const originalPrices = {
			"Coach": {"Accessories": 95, "Apparel": 350, "Shoes": 180},
			"Gucci": {"Accessories": 420, "Apparel": 1200, "Shoes": 650},
			"Hermès": {"Accessories": 1200, "Apparel": 2800, "Shoes": 980}
		};

		const combinedData = resaleData.map(d => ({
			...d,
			originalPrice: originalPrices[d.brand][d.category],
			resalePrice: d.mean,
			retentionRate: ((d.mean / originalPrices[d.brand][d.category]) * 100).toFixed(0)
		}));

		const brands = ["Coach", "Gucci", "Hermès"];
		const categories = ["Accessories", "Apparel", "Shoes"];

		const x0 = d3.scaleBand().domain(brands).range([0, width]).padding(0.3);
		const x1 = d3.scaleBand().domain(categories).range([0, x0.bandwidth()]).padding(0.1);
		const x2 = d3.scaleBand().domain(["original", "resale"]).range([0, x1.bandwidth()]).padding(0.05);
		
		const y = d3.scaleLinear()
			.domain([0, 3000])
			.range([height, 0])
			.nice();

		svg.append("g").attr("class", "grid").attr("opacity", 0.1)
			.call(d3.axisLeft(y).tickSize(-width).tickFormat(""));

		const brandGroups = svg.selectAll(".brand-group")
			.data(brands).enter().append("g")
			.attr("class", "brand-group")
			.attr("transform", d => `translate(${x0(d)},0)`);

		brandGroups.each(function(brand) {
			const brandGroup = d3.select(this);
			
			categories.forEach(category => {
				const item = combinedData.find(d => d.brand === brand && d.category === category);
				if (!item) return;

				const categoryGroup = brandGroup.append("g")
					.attr("class", "category-group")
					.attr("transform", `translate(${x1(category)},0)`);

				// Original price bar
				categoryGroup.append("rect")
					.attr("x", x2("original"))
					.attr("y", height)
					.attr("width", x2.bandwidth())
					.attr("height", 0)
					.attr("fill", brandColors[brand])
					.attr("opacity", 0.4)
					.attr("rx", 3)
					.on("mouseover", function(event) {
						d3.select(this).transition().duration(200).attr("opacity", 0.6);
						tooltip.style("opacity", 1)
							.html(`<strong>${brand} - ${category}</strong><br><span style="color: rgba(212, 175, 55, 0.6)">● Original Retail</span><br>Price: $${item.originalPrice.toFixed(2)}`)
							.style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 28) + "px");
					})
					.on("mouseout", function() {
						d3.select(this).transition().duration(200).attr("opacity", 0.4);
						tooltip.style("opacity", 0);
					})
					.transition().duration(1000).delay(100)
					.attr("y", y(item.originalPrice))
					.attr("height", height - y(item.originalPrice));

				// Resale price bar
				categoryGroup.append("rect")
					.attr("x", x2("resale"))
					.attr("y", height)
					.attr("width", x2.bandwidth())
					.attr("height", 0)
					.attr("fill", brandColors[brand])
					.attr("opacity", 0.9)
					.attr("rx", 3)
					.on("mouseover", function(event) {
						d3.select(this).transition().duration(200).attr("opacity", 1);
						tooltip.style("opacity", 1)
							.html(`<strong>${brand} - ${category}</strong><br><span style="color: #d4af37">● Resale Price</span><br>Avg: $${item.resalePrice.toFixed(2)}<br>Items: ${item.count.toLocaleString()}<br><span style="color: #4ade80">Value Retention: ${item.retentionRate}%</span>`)
							.style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 28) + "px");
					})
					.on("mouseout", function() {
						d3.select(this).transition().duration(200).attr("opacity", 0.9);
						tooltip.style("opacity", 0);
					})
					.transition().duration(1000).delay(200)
					.attr("y", y(item.resalePrice))
					.attr("height", height - y(item.resalePrice));

				// Display retention percentage on all bars in green
				categoryGroup.append("text")
					.attr("x", x2("resale") + x2.bandwidth() / 2)
					.attr("y", y(item.resalePrice) - 10)
					.attr("text-anchor", "middle")
					.style("font-size", "10px")
					.style("fill", "#4ade80")
					.style("font-weight", "bold")
					.style("opacity", 0)
					.text(`${item.retentionRate}%`)
					.transition().duration(500).delay(1200).style("opacity", 1);
			});
		});

		svg.append("g").attr("class", "axis")
			.attr("transform", `translate(0,${height + 35})`)
			.call(d3.axisBottom(x0))
			.selectAll("text")
			.style("font-size", "15px")
			.style("fill", "#b8b8b8")
			.style("font-weight", "400");

		svg.append("g").attr("class", "axis").call(d3.axisLeft(y).tickFormat(d => `$${d}`));

		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -height / 2)
			.attr("y", -60)
			.attr("text-anchor", "middle")
			.style("font-size", "14px")
			.style("fill", "#b8b8b8")
			.text("Price (USD)");

		const legend = svg.append("g").attr("transform", `translate(${width - 110}, 10)`);
		legend.append("rect").attr("x", 0).attr("y", 0).attr("width", 20).attr("height", 12).attr("fill", "#d4af37").attr("opacity", 0.4).attr("rx", 2);
		legend.append("text").attr("x", 25).attr("y", 10).style("font-size", "12px").style("fill", "#b8b8b8").text("Original Retail");
		legend.append("rect").attr("x", 0).attr("y", 20).attr("width", 20).attr("height", 12).attr("fill", "#d4af37").attr("opacity", 0.9).attr("rx", 2);
		legend.append("text").attr("x", 25).attr("y", 30).style("font-size", "12px").style("fill", "#b8b8b8").text("Resale Price");

		brandGroups.each(function(brand, brandIndex) {
			const brandGroup = d3.select(this);
			categories.forEach((category, catIndex) => {
				brandGroup.append("text")
					.attr("x", x1(category) + x1.bandwidth() / 2)
					.attr("y", height + 25)
					.attr("text-anchor", "middle")
					.style("font-size", "10px")
					.style("fill", "#888")
					.style("opacity", 0)
					.text(category)
					.transition().duration(500).delay(brandIndex * 300 + catIndex * 100).style("opacity", 1);
			});
		});

		// svg.append("text")
		// 	.attr("x", width / 2)
		// 	.attr("y", height + 100)
		// 	.attr("text-anchor", "middle")
		// 	.style("font-size", "18px")
		// 	.style("font-style", "italic")
		// 	.style("fill", "#888")
		// 	.text("Hermès items retain exceptional value, often exceeding 70% of original retail price");

		// Filter functionality
		d3.selectAll(".controls .luxury-button").on("click", function() {
			const category = d3.select(this).attr("data-category");
			d3.selectAll(".controls .luxury-button").classed("active", false);
			d3.select(this).classed("active", true);

			brandGroups.selectAll(".category-group")
				.transition().duration(500)
				.style("opacity", function() {
					const transform = d3.select(this).attr("transform");
					const match = transform.match(/translate\(([^,]+)/);
					if (!match) return 1;
					const xPos = parseFloat(match[1]);
					let catIdx = -1;
					categories.forEach((cat, idx) => {
						if (Math.abs(x1(cat) - xPos) < 1) catIdx = idx;
					});
					if (category === "all") return 1;
					return catIdx >= 0 && categories[catIdx] === category ? 1 : 0.15;
				});
		});
	};
})();
