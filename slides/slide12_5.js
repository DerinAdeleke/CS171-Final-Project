(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-12-5">
			<div class="slide-content">
				<h2 class="section-title">Category Performance Analysis</h2>
				<p class="section-subtitle">Select brands to compare revenue trends over time. Hover over charts to see detailed category breakdowns and year-over-year changes</p>
				
				<!-- Brand Selection Controls -->
				<div style="
					display: flex;
					justify-content: center;
					gap: 20px;
					margin: 20px 0 30px 0;
					flex-wrap: wrap;
				">
					<label class="brand-checkbox-label" style="
						display: flex;
						align-items: center;
						gap: 8px;
						padding: 10px 20px;
						background: rgba(139, 38, 53, 0.15);
						border: 2px solid rgba(139, 38, 53, 0.4);
						border-radius: 25px;
						cursor: pointer;
						transition: all 0.3s;
						font-size: 14px;
						color: #f5f5f5;
						letter-spacing: 0.05em;
					">
						<input type="checkbox" class="brand-selector" value="Hermes" checked style="
							width: 18px;
							height: 18px;
							cursor: pointer;
							accent-color: #8B2635;
						">
						<span>Hermès</span>
					</label>
					
					<label class="brand-checkbox-label" style="
						display: flex;
						align-items: center;
						gap: 8px;
						padding: 10px 20px;
						background: rgba(212, 175, 55, 0.15);
						border: 2px solid rgba(212, 175, 55, 0.4);
						border-radius: 25px;
						cursor: pointer;
						transition: all 0.3s;
						font-size: 14px;
						color: #f5f5f5;
						letter-spacing: 0.05em;
					">
						<input type="checkbox" class="brand-selector" value="Gucci" checked style="
							width: 18px;
							height: 18px;
							cursor: pointer;
							accent-color: #d4af37;
						">
						<span>Gucci</span>
					</label>
					
					<label class="brand-checkbox-label" style="
						display: flex;
						align-items: center;
						gap: 8px;
						padding: 10px 20px;
						background: rgba(139, 69, 19, 0.15);
						border: 2px solid rgba(139, 69, 19, 0.4);
						border-radius: 25px;
						cursor: pointer;
						transition: all 0.3s;
						font-size: 14px;
						color: #f5f5f5;
						letter-spacing: 0.05em;
					">
						<input type="checkbox" class="brand-selector" value="Coach" checked style="
							width: 18px;
							height: 18px;
							cursor: pointer;
							accent-color: #8b4513;
						">
						<span>Coach</span>
					</label>
				</div>
				
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
				
				<div id="category-viz-container" class="viz-container" style="margin-top: 20px;">
					<!-- Charts will be dynamically inserted here -->
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
	
	let selectedBrands = [...BRANDS]; // Initially all selected
	let globalData = null;

	// Brand-specific color palettes matching the luxury aesthetic
	const brandPalettes = {
		"Hermes": ["#8B2635", "#A63446", "#C14257", "#DC5068", "#F75E79"],
		"Gucci": ["#d4af37", "#c9a961", "#bfa47a", "#b89f6f", "#a89968"],
		"Coach": ["#8b4513", "#9a5425", "#a96337", "#b87249", "#c7815b"]
	};

	window.createCategoryAnalysis = function() {
		// Load data
		d3.csv("data/region_category_clean_data.csv").then(raw => {
			globalData = raw.map(d => ({
				brand: d.brand,
				category: d.category,
				year: +d.year,
				value: +d.millions_of_dollars
			})).filter(d => d.category && d.category !== "NA" && d.category !== "Total" && d.category !== "Total Coach");

			// Initial render
			renderCharts();
			
			// Add event listeners to checkboxes
			document.querySelectorAll('.brand-selector').forEach(checkbox => {
				checkbox.addEventListener('change', (e) => {
					const brand = e.target.value;
					if (e.target.checked) {
						if (!selectedBrands.includes(brand)) {
							selectedBrands.push(brand);
						}
					} else {
						selectedBrands = selectedBrands.filter(b => b !== brand);
					}
					
					// Ensure at least one brand is selected
					if (selectedBrands.length === 0) {
						e.target.checked = true;
						selectedBrands.push(brand);
						return;
					}
					
					renderCharts();
				});
			});
			
		}).catch(error => {
			console.error("Error loading category data:", error);
			d3.select("#category-viz-container")
				.append("div")
				.text("Failed to load data. Please check the CSV file.")
				.style("color", "#999")
				.style("text-align", "center")
				.style("padding", "20px");
		});
	};
	
	function renderCharts() {
		const container = d3.select("#category-viz-container");
		container.selectAll("*").remove();
		
		const count = selectedBrands.length;
		
		// Determine layout based on number of selected brands
		if (count === 1) {
			// Side by side: line and bar for single brand
			container.style("display", "flex")
				.style("justify-content", "center")
				.style("gap", "30px")
				.style("align-items", "flex-start")
				.style("flex-wrap", "wrap");
				
			const brand = selectedBrands[0];
			const lineDiv = container.append("div").attr("id", `line-${brand}`);
			const barDiv = container.append("div").attr("id", `bar-${brand}`);
			
			drawLineChart(`#line-${brand}`, brand, globalData, 400, 310);
			const defaultYear = d3.max(globalData.filter(d => d.brand === brand), d => d.year);
			drawBarChart(`#bar-${brand}`, brand, globalData, defaultYear, 400, 310);
			
		} else if (count === 2) {
			// Stacked: 4 graphs (2 brands × 2 charts each)
			// Each brand in a column, charts stacked vertically
			container.style("display", "flex")
				.style("flex-direction", "row")
				.style("gap", "40px")
				.style("justify-content", "center")
				.style("align-items", "flex-start");
				
			selectedBrands.forEach(brand => {
				const brandColumn = container.append("div")
					.style("display", "flex")
					.style("flex-direction", "column")
					.style("gap", "20px")
					.style("align-items", "center");
					
				brandColumn.append("div").attr("id", `line-${brand}`);
				brandColumn.append("div").attr("id", `bar-${brand}`);
				
				drawLineChart(`#line-${brand}`, brand, globalData, 420, 290);
				const defaultYear = d3.max(globalData.filter(d => d.brand === brand), d => d.year);
				drawBarChart(`#bar-${brand}`, brand, globalData, defaultYear, 420, 280);
			});
			
		} else {
			// All 3 brands: original layout (stacked rows)
			container.style("display", "flex")
				.style("flex-direction", "column")
				.style("gap", "15px");
				
			const lineRow = container.append("div")
				.attr("id", "brand-lines-row")
				.style("display", "flex")
				.style("gap", "20px")
				.style("justify-content", "center")
				.style("flex-wrap", "wrap");
				
			const barRow = container.append("div")
				.attr("id", "brand-bars-row")
				.style("display", "flex")
				.style("gap", "20px")
				.style("justify-content", "center")
				.style("flex-wrap", "wrap");
				
			selectedBrands.forEach(brand => {
				lineRow.append("div").attr("id", `line-${brand}`).style("flex", "1").style("min-width", "300px");
				barRow.append("div").attr("id", `bar-${brand}`).style("flex", "1").style("min-width", "300px");
				
				drawLineChart(`#line-${brand}`, brand, globalData, 350, 260);
				const defaultYear = d3.max(globalData.filter(d => d.brand === brand), d => d.year);
				drawBarChart(`#bar-${brand}`, brand, globalData, defaultYear, 350, 240);
			});
		}
	}

	// --------------------------------------------------------
	// LINE CHART FUNCTION
	// --------------------------------------------------------
	function drawLineChart(target, brand, fullData, width = 360, height = 280) {
		const data = fullData.filter(d => d.brand === brand);
		const years = [...new Set(data.map(d => d.year))].sort(d3.ascending);
		const categories = [...new Set(data.map(d => d.category))];

		const color = d3.scaleOrdinal()
			.domain(categories)
			.range(brandPalettes[brand] || d3.schemeSet2);

		const W = width;
		const H = height;
		const M = { top: 35, right: 25, bottom: 50, left: 55 };

		const container = d3.select(target);
		
		container.append("div")
			.style("text-align", "center")
			.style("font-weight", "300")
			.style("margin-bottom", "10px")
			.style("color", "#f5f5f5")
			.style("font-size", "14px")
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
			.call(d3.axisBottom(x).tickValues(years.filter((d, i) => i % 2 === 0)))
			.selectAll("text")
			.style("fill", "#888")
			.style("font-size", "9px")
			.style("font-weight", "300");

		g.append("g")
			.call(d3.axisLeft(y).ticks(5))
			.selectAll("text")
			.style("fill", "#888")
			.style("font-size", "9px")
			.style("font-weight", "300");

		// Axis labels
		g.append("text")
			.attr("x", innerW / 2)
			.attr("y", innerH + 38)
			.attr("text-anchor", "middle")
			.style("font-size", "10px")
			.style("fill", "#888")
			.text("Year");

		g.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -innerH / 2)
			.attr("y", -42)
			.attr("text-anchor", "middle")
			.style("font-size", "10px")
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

				drawBarChart(`#bar-${brand}`, brand, fullData, nearest, width, height - 20);
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
	function drawBarChart(target, brand, fullData, year = null, width = 360, height = 260) {
		const host = d3.select(target);
		host.selectAll("svg").remove(); // Only remove SVG, keep title

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

		const W = width;
		const H = height;
		const M = { top: 35, right: 20, bottom: 40, left: 100 };

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
			.attr("x", d => x(d.value) + 6)
			.attr("y", d => y(d.category) + y.bandwidth() / 2 + 3)
			.style("opacity", 0)
			.style("font-size", "10px")
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
			.style("font-size", "10px")
			.style("fill", "#b8b8b8")
			.style("font-weight", "300");

		g.append("g")
			.attr("transform", `translate(0,${innerH})`)
			.call(d3.axisBottom(x).ticks(4))
			.selectAll("text")
			.style("font-size", "9px")
			.style("fill", "#888");

		// Axis label
		svg.append("text")
			.attr("x", W / 2 + 25)
			.attr("y", H - 8)
			.attr("text-anchor", "middle")
			.style("font-size", "10px")
			.style("fill", "#888")
			.text("Revenue (M$)");

		// Title
		svg.append("text")
			.attr("x", W / 2)
			.attr("y", 20)
			.style("font-weight", "300")
			.style("font-size", "13px")
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
