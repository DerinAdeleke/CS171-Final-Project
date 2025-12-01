(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-12-5">
			<div class="slide-content">
				<h2 class="section-title">Category Performance Analysis</h2>
				<p class="section-subtitle">Interactive revenue trends and year-over-year category breakdown by brand</p>
				
				<!-- Insight Lightbulb Button -->
				<button id="insights-btn-category" style="
					position: absolute;
					top: 20px;
					right: 20px;
					width: 50px;
					height: 50px;
					border-radius: 50%;
					background: linear-gradient(135deg, #d4af37 0%, #f0c55d 100%);
					border: 2px solid #d4af37;
					cursor: pointer;
					box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
					animation: pulse 2s infinite;
					z-index: 100;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 24px;
					transition: all 0.3s;
				" title="View Category Insights">💡</button>
				
				<div class="viz-container" style="margin-top: 40px;">
					<div id="brand-lines-row" style="display: flex; gap: 30px; justify-content: center; margin-bottom: 30px; flex-wrap: wrap;"></div>
					
					<div class="decorative-line" style="margin: 20px auto;"></div>
					
					<div id="brand-bars-row" style="display: flex; gap: 30px; justify-content: center; flex-wrap: wrap;"></div>
				</div>
			</div>
		</section>
		
		<!-- Insights Modal -->
		<div id="insights-modal-category" style="
			display: none;
			position: fixed;
			z-index: 1000;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.85);
			align-items: center;
			justify-content: center;
		">
			<div style="
				background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
				border: 2px solid #d4af37;
				border-radius: 20px;
				padding: 40px;
				max-width: 700px;
				width: 90%;
				max-height: 80vh;
				overflow-y: auto;
				box-shadow: 0 0 50px rgba(212, 175, 55, 0.5);
				position: relative;
			">
				<button class="close-insights" style="
					position: absolute;
					top: 20px;
					right: 25px;
					font-size: 35px;
					font-weight: bold;
					color: #d4af37;
					background: none;
					border: none;
					cursor: pointer;
					transition: color 0.3s;
				">&times;</button>
				
				<h2 style="
					color: #d4af37;
					font-size: 32px;
					margin-bottom: 30px;
					text-align: center;
					font-family: 'Playfair Display', serif;
				">Category Performance Insights</h2>
				
				<div style="display: flex; flex-direction: column; gap: 25px;">
					<div style="
						background: rgba(212, 175, 55, 0.1);
						border-left: 4px solid #8B2635;
						padding: 20px;
						border-radius: 8px;
					">
						<h3 style="color: #8B2635; margin-bottom: 10px; font-size: 22px;">📈 Hermès' Steady Climb</h3>
						<p style="color: #e0e0e0; line-height: 1.6; font-size: 16px;">
							Hermès shows consistent growth across all categories with accessories leading the charge. 
							Their leather goods category has seen a 185% increase from 2012-2024, demonstrating the 
							power of scarcity and artisanal craftsmanship. Each bar tells a story of controlled expansion 
							without sacrificing exclusivity.
						</p>
					</div>
					
					<div style="
						background: rgba(212, 175, 55, 0.1);
						border-left: 4px solid #d4af37;
						padding: 20px;
						border-radius: 8px;
					">
						<h3 style="color: #d4af37; margin-bottom: 10px; font-size: 22px;">👟 Gucci's Category Dominance</h3>
						<p style="color: #e0e0e0; line-height: 1.6; font-size: 16px;">
							Gucci's diversified approach shows strength across shoes, accessories, and apparel. Notice how 
							their revenue distribution is more balanced compared to Hermès' accessory focus. This multi-category 
							strategy creates resilience—when one category slows, others compensate. The line graphs reveal 
							volatility in recent years as they navigate market shifts.
						</p>
					</div>
					
					<div style="
						background: rgba(212, 175, 55, 0.1);
						border-left: 4px solid #8b4513;
						padding: 20px;
						border-radius: 8px;
					">
						<h3 style="color: #8b4513; margin-bottom: 10px; font-size: 22px;">💼 Coach's Evolution Story</h3>
						<p style="color: #e0e0e0; line-height: 1.6; font-size: 16px;">
							Coach's accessible luxury positioning shows in their smaller but stable revenue streams. 
							Accessories dominate (as expected for a heritage leather brand), but recent diversification 
							into footwear and apparel signals strategic evolution. The year-over-year bars show they're 
							holding ground in a competitive mid-luxury market.
						</p>
					</div>
				</div>
			</div>
		</div>
	`);

	const BRANDS = ["Hermes", "Gucci", "Coach"];

	// Brand-specific color palettes matching the luxury aesthetic
	const brandPalettes = {
		"Hermes": ["#8B2635", "#A63446", "#C14257", "#DC5068", "#F75E79"],
		"Gucci": ["#d4af37", "#c9a961", "#bfa47a", "#b89f6f", "#a89968"],
		"Coach": ["#8b4513", "#9a5425", "#a96337", "#b87249", "#c7815b"]
	};

	window.createCategoryAnalysis = function() {
		const lineRow = d3.select("#brand-lines-row");
		const barRow = d3.select("#brand-bars-row");

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
					.attr("id", `line-${brand}`)
					.style("flex", "1")
					.style("min-width", "320px");

				barRow.append("div")
					.attr("class", "brand-cell")
					.attr("id", `bar-${brand}`)
					.style("flex", "1")
					.style("min-width", "320px");
			});

			// Draw charts
			BRANDS.forEach(brand => {
				drawLineChart(`#line-${brand}`, brand, data);
				const defaultYear = d3.max(data.filter(d => d.brand === brand), d => d.year);
				drawBarChart(`#bar-${brand}`, brand, data, defaultYear);
			});
		}).catch(error => {
			console.error("Error loading category data:", error);
			lineRow.append("div")
				.text("Failed to load data. Please check the CSV file.")
				.style("color", "#999")
				.style("text-align", "center")
				.style("padding", "20px");
		});
	};

	// --------------------------------------------------------
	// LINE CHART FUNCTION
	// --------------------------------------------------------
	function drawLineChart(target, brand, fullData) {
		const data = fullData.filter(d => d.brand === brand);
		const years = [...new Set(data.map(d => d.year))].sort(d3.ascending);
		const categories = [...new Set(data.map(d => d.category))];

		const color = d3.scaleOrdinal()
			.domain(categories)
			.range(brandPalettes[brand] || d3.schemeSet2);

		const W = 360;
		const H = 280;
		const M = { top: 40, right: 30, bottom: 60, left: 65 };

		const container = d3.select(target);
		
		container.append("div")
			.style("text-align", "center")
			.style("font-weight", "300")
			.style("margin-bottom", "15px")
			.style("color", "#f5f5f5")
			.style("font-size", "16px")
			.style("letter-spacing", "0.1em")
			.text(brand);

		const svg = container
			.append("svg")
			.attr("width", W)
			.attr("height", H)
			.style("background", "rgba(255, 255, 255, 0.02)")
			.style("border-radius", "10px")
			.style("border", "1px solid rgba(212, 175, 55, 0.2)");

		const g = svg.append("g")
			.attr("transform", `translate(${M.left},${M.top})`);

		const clickLine = g.append("line")
			.attr("class", "click-indicator")
			.attr("stroke", "#d4af37")
			.attr("stroke-width", 2)
			.attr("stroke-dasharray", "4 4")
			.style("opacity", 0);

		const innerW = W - M.left - M.right;
		const innerH = H - M.top - M.bottom;

		const x = d3.scalePoint().domain(years).range([0, innerW]);
		const y = d3.scaleLinear().domain([0, 7000]).range([innerH, 0]);

		// Grid lines
		g.append("g")
			.attr("class", "grid")
			.attr("opacity", 0.1)
			.call(d3.axisLeft(y).tickSize(-innerW).tickFormat(""));

		// Axes
		g.append("g")
			.attr("transform", `translate(0,${innerH})`)
			.call(d3.axisBottom(x).tickValues(years.filter((y, i) => i % 2 === 0)))
			.selectAll("text")
			.style("fill", "#888")
			.style("font-size", "10px");

		g.append("g")
			.call(d3.axisLeft(y).ticks(5))
			.selectAll("text")
			.style("fill", "#888")
			.style("font-size", "10px");

		// Axis labels
		g.append("text")
			.attr("x", innerW / 2)
			.attr("y", innerH + 45)
			.attr("text-anchor", "middle")
			.style("font-size", "11px")
			.style("fill", "#888")
			.text("Year");

		g.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -innerH / 2)
			.attr("y", -50)
			.attr("text-anchor", "middle")
			.style("font-size", "11px")
			.style("fill", "#888")
			.text("Revenue (M$)");

		const line = d3.line()
			.x(d => x(d.year))
			.y(d => y(d.value))
			.curve(d3.curveMonotoneX);

		const grouped = d3.groups(data, d => d.category);

		// Draw lines
		g.selectAll(".cat-line")
			.data(grouped)
			.join("path")
			.attr("class", "cat-line")
			.attr("fill", "none")
			.attr("stroke", d => color(d[0]))
			.attr("stroke-width", 2.5)
			.attr("d", d => line(d[1].sort((a, b) => d3.ascending(a.year, b.year))))
			.style("opacity", 0.8);

		// Click interaction
		svg.style("cursor", "pointer")
			.on("click", event => {
				const [mx] = d3.pointer(event, svg.node());
				const xPos = mx - M.left;

				const nearest = years.reduce((a, b) =>
					Math.abs(x(a) - xPos) < Math.abs(x(b) - xPos) ? a : b
				);

				clickLine
					.attr("x1", x(nearest))
					.attr("x2", x(nearest))
					.attr("y1", 0)
					.attr("y2", innerH)
					.style("opacity", 1);

				drawBarChart(`#bar-${brand}`, brand, fullData, nearest);
			});

		// Legend
		const legend = svg.append("g")
			.attr("transform", `translate(${M.left + 10}, ${M.top - 25})`);

		categories.forEach((cat, i) => {
			const legendItem = legend.append("g")
				.attr("transform", `translate(${i * 80}, 0)`);

			legendItem.append("line")
				.attr("x1", 0)
				.attr("x2", 15)
				.attr("y1", 0)
				.attr("y2", 0)
				.attr("stroke", color(cat))
				.attr("stroke-width", 2.5);

			legendItem.append("text")
				.attr("x", 20)
				.attr("y", 4)
				.style("font-size", "9px")
				.style("fill", "#999")
				.text(cat);
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

		const color = d3.scaleOrdinal()
			.domain(categories)
			.range(brandPalettes[brand] || d3.schemeSet2);

		const W = 360;
		const H = 260;
		const M = { top: 40, right: 30, bottom: 45, left: 120 };

		const svg = host.append("svg")
			.attr("width", W)
			.attr("height", H)
			.style("background", "rgba(255, 255, 255, 0.02)")
			.style("border-radius", "10px")
			.style("border", "1px solid rgba(212, 175, 55, 0.2)");

		const innerW = W - M.left - M.right;
		const innerH = H - M.top - M.bottom;

		const g = svg.append("g")
			.attr("transform", `translate(${M.left},${M.top})`);

		const x = d3.scaleLinear()
			.domain([0, 7000])
			.range([0, innerW]);

		const y = d3.scaleBand()
			.domain(categories)
			.range([0, innerH])
			.padding(0.3);

		// Bars
		const bars = g.selectAll(".bar-item")
			.data(rows)
			.join("rect")
			.attr("class", "bar-item")
			.attr("x", 0)
			.attr("y", d => y(d.category))
			.attr("height", y.bandwidth())
			.attr("fill", d => color(d.category))
			.attr("rx", 3)
			.attr("width", 0)
			.style("opacity", 0.8);

		bars
			.transition()
			.duration(650)
			.ease(d3.easeCubicOut)
			.attr("width", d => x(d.value));

		// Labels
		g.selectAll(".bar-label")
			.data(rows)
			.join("text")
			.attr("class", "bar-label")
			.attr("x", d => x(d.value) + 8)
			.attr("y", d => y(d.category) + y.bandwidth() / 2 + 4)
			.style("opacity", 0)
			.style("font-size", "11px")
			.style("fill", "#b8b8b8")
			.style("font-weight", "300")
			.text(d => `$${d3.format(",.0f")(d.value)}M`)
			.transition()
			.delay(650)
			.duration(350)
			.style("opacity", 1);

		// Axes
		g.append("g")
			.call(d3.axisLeft(y).tickSize(0))
			.selectAll("text")
			.style("font-size", "11px")
			.style("fill", "#b8b8b8")
			.style("font-weight", "300");

		g.append("g")
			.attr("transform", `translate(0,${innerH})`)
			.call(d3.axisBottom(x).ticks(4))
			.selectAll("text")
			.style("font-size", "10px")
			.style("fill", "#888");

		// Axis label
		svg.append("text")
			.attr("x", W / 2 + 30)
			.attr("y", H - 10)
			.attr("text-anchor", "middle")
			.style("font-size", "11px")
			.style("fill", "#888")
			.text("Revenue (M$)");

		// Title
		svg.append("text")
			.attr("x", W / 2)
			.attr("y", 22)
			.style("font-weight", "300")
			.style("font-size", "14px")
			.style("fill", "#d4af37")
			.style("letter-spacing", "0.05em")
			.attr("text-anchor", "middle")
			.text(`${brand} ${year}`);
	}
	
	// Insights modal functionality
	const insightsBtn = document.getElementById('insights-btn-category');
	const insightsModal = document.getElementById('insights-modal-category');
	const closeBtn = insightsModal?.querySelector('.close-insights');

	if (insightsBtn && insightsModal) {
		insightsBtn.addEventListener('click', () => {
			insightsModal.style.display = 'flex';
		});

		if (closeBtn) {
			closeBtn.addEventListener('click', () => {
				insightsModal.style.display = 'none';
			});
		}

		window.addEventListener('click', (e) => {
			if (e.target === insightsModal) {
				insightsModal.style.display = 'none';
			}
		});
	}
})();
