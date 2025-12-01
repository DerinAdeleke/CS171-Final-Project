(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-vestiaire">
			<div class="slide-content">
				<h2 class="section-title">The Vestiaire Marketplace Dashboard</h2>
				<p class="section-subtitle">Interactive exploration of 62,000+ luxury resale items</p>
				
				<!-- Insight Lightbulb Button -->
				<button id="insights-btn-vestiaire" style="
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
				" title="View Value of Legacy Insights">💡</button>
				
				<!-- Filter Controls -->
				<div style="
					display: flex;
					justify-content: center;
					gap: 15px;
					margin: 15px 0;
					flex-wrap: wrap;
					align-items: center;
				">
					<div style="display: flex; gap: 10px; align-items: center;">
						<span style="color: #999; font-size: 13px; letter-spacing: 0.05em;">BRANDS:</span>
						<label class="vestiaire-filter-label">
							<input type="checkbox" class="brand-filter" value="Hermès" checked>
							<span style="color: #8B2635;">Hermès</span>
						</label>
						<label class="vestiaire-filter-label">
							<input type="checkbox" class="brand-filter" value="Gucci" checked>
							<span style="color: #d4af37;">Gucci</span>
						</label>
						<label class="vestiaire-filter-label">
							<input type="checkbox" class="brand-filter" value="Coach" checked>
							<span style="color: #8b4513;">Coach</span>
						</label>
					</div>
					
					<div style="display: flex; gap: 10px; align-items: center;">
						<span style="color: #999; font-size: 13px; letter-spacing: 0.05em;">CATEGORY:</span>
						<label class="vestiaire-filter-label">
							<input type="checkbox" class="category-filter" value="Accessories" checked>
							<span>Accessories</span>
						</label>
						<label class="vestiaire-filter-label">
							<input type="checkbox" class="category-filter" value="Apparel" checked>
							<span>Apparel</span>
						</label>
					</div>
					
					<button id="reset-filters" style="
						padding: 8px 18px;
						background: rgba(212, 175, 55, 0.15);
						border: 1px solid rgba(212, 175, 55, 0.4);
						border-radius: 20px;
						color: #d4af37;
						cursor: pointer;
						font-size: 12px;
						letter-spacing: 0.05em;
						transition: all 0.3s;
					">RESET</button>
				</div>
				
				<!-- Dashboard Grid -->
				<div id="vestiaire-dashboard" style="
					display: grid;
					grid-template-columns: 1fr 1fr;
					grid-template-rows: auto auto;
					gap: 20px;
					margin-top: 15px;
				">
					<div class="dashboard-panel" id="price-distribution-panel"></div>
					<div class="dashboard-panel" id="condition-breakdown-panel"></div>
					<div class="dashboard-panel" id="category-volume-panel"></div>
					<div class="dashboard-panel" id="price-range-panel"></div>
				</div>
				
				<!-- Selection Summary -->
				<div id="selection-summary" style="
					margin-top: 15px;
					text-align: center;
					color: #999;
					font-size: 12px;
					letter-spacing: 0.05em;
				"></div>
			</div>
		</section>
		
		<!-- Insights Modal -->
		<div id="insights-modal-vestiaire" style="
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
				">The Value of Legacy</h2>
				
				<div style="display: flex; flex-direction: column; gap: 25px;">
					<div style="
						background: rgba(212, 175, 55, 0.1);
						border-left: 4px solid #8B2635;
						padding: 20px;
						border-radius: 8px;
					">
						<h3 style="color: #8B2635; margin-bottom: 10px; font-size: 22px;">💰 52% - Hermès Holds Value</h3>
						<p style="color: #e0e0e0; line-height: 1.6; font-size: 16px;">
							An Hermès accessory retains over half its retail price on the resale market. 
							Some rare pieces even appreciate. This isn't fashion—it's investment-grade luxury. 
							While other brands depreciate rapidly, Hermès products maintain their value like fine art, 
							proving that true craftsmanship creates lasting financial worth.
						</p>
					</div>
					
					<div style="
						background: rgba(212, 175, 55, 0.1);
						border-left: 4px solid #d4af37;
						padding: 20px;
						border-radius: 8px;
					">
						<h3 style="color: #d4af37; margin-bottom: 10px; font-size: 22px;">📈 $1,181 - Apparel Premium</h3>
						<p style="color: #e0e0e0; line-height: 1.6; font-size: 16px;">
							Hermès apparel resells at $1,181 average—42% retention from $2,800 retail. 
							Meanwhile, Coach accessories average just $104. Brand equity translates directly to resale power. 
							The pricing data from Vestiaire reveals a stark hierarchy: ultra-luxury maintains premium positioning 
							even in the secondary market.
						</p>
					</div>
					
					<div style="
						background: rgba(212, 175, 55, 0.1);
						border-left: 4px solid #8b4513;
						padding: 20px;
						border-radius: 8px;
					">
						<h3 style="color: #8b4513; margin-bottom: 10px; font-size: 22px;">♻️ Sustainability - New Value Model</h3>
						<p style="color: #e0e0e0; line-height: 1.6; font-size: 16px;">
							The resale market isn't cannibalizing sales—it's creating new luxury consumers. 
							A $622 pre-owned Hermès bag is someone's entry point to the brand ecosystem. 
							Vestiaire's 62,000+ items represent a thriving circular economy where sustainability meets aspiration, 
							and pre-loved becomes prestigious.
						</p>
					</div>
				</div>
			</div>
		</div>
	`);

	window.createVestiaireViz = async function() {
		const brandColors = window.brandColors;
		
		const [coachData, gucciData, hermesData] = await Promise.all([
			d3.csv("data/vestiaire-coach.csv"),
			d3.csv("data/vestiaire-gucci.csv"),
			d3.csv("data/vestiaire-hermes.csv")
		]);

		coachData.forEach(d => d.brand = "Coach");
		gucciData.forEach(d => d.brand = "Gucci");
		hermesData.forEach(d => d.brand = "Hermès");

		const allData = [...coachData, ...gucciData, ...hermesData]
			.filter(d => d.price_usd && +d.price_usd > 0 && +d.price_usd < 10000)
			.map(d => ({
				brand: d.brand,
				price: +d.price_usd,
				condition: d.product_condition,
				category: d.product_category === "Women Clothing" ? "Apparel" : "Accessories",
				material: d.product_material,
				sold: d.sold === "TRUE",
				type: d.product_type
			}));

		// Global filter state
		let filters = {
			brands: new Set(["Hermès", "Gucci", "Coach"]),
			categories: new Set(["Accessories", "Apparel"]),
			priceRange: null,
			condition: null,
			clickedBrand: null
		};

		// Tooltip
		const tooltip = d3.select("body")
			.append("div")
			.attr("class", "vestiaire-tooltip")
			.style("position", "absolute")
			.style("background", "rgba(10, 10, 10, 0.95)")
			.style("border", "1px solid #d4af37")
			.style("border-radius", "8px")
			.style("padding", "12px")
			.style("color", "#f5f5f5")
			.style("font-size", "12px")
			.style("pointer-events", "none")
			.style("opacity", 0)
			.style("z-index", 1000);

		// Filter data based on current filters
		function getFilteredData() {
			return allData.filter(d => {
				if (!filters.brands.has(d.brand)) return false;
				if (!filters.categories.has(d.category)) return false;
				if (filters.priceRange && (d.price < filters.priceRange[0] || d.price > filters.priceRange[1])) return false;
				if (filters.condition && d.condition !== filters.condition) return false;
				if (filters.clickedBrand && d.brand !== filters.clickedBrand) return false;
				return true;
			});
		}

		// Update all visualizations
		function updateAllViews() {
			const filteredData = getFilteredData();
			createPriceDistribution(filteredData);
			createConditionBreakdown(filteredData);
			createCategoryVolume(filteredData);
			createPriceRangeSelector(filteredData);
			updateSummary(filteredData);
		}

		// 1. Price Distribution (Box Plot with Violin)
		function createPriceDistribution(data) {
			const panel = d3.select("#price-distribution-panel");
			panel.selectAll("*").remove();
			
			// Add expand button
			const expandBtn = panel.append("div")
				.attr("class", "expand-panel-btn")
				.html("⛶")
				.on("click", () => expandPanel("price-distribution", data));
			
			const width = 520;
			const height = 240;
			const margin = {top: 30, right: 20, bottom: 50, left: 60};
			
			const svg = panel.append("svg")
				.attr("width", width)
				.attr("height", height);
				
			const g = svg.append("g")
				.attr("transform", `translate(${margin.left},${margin.top})`);
				
			const innerW = width - margin.left - margin.right;
			const innerH = height - margin.top - margin.bottom;
			
			const activeBrands = Array.from(filters.brands).filter(b => 
				data.some(d => d.brand === b)
			);
			
			if (activeBrands.length === 0) {
				panel.append("div").style("padding", "80px").style("text-align", "center")
					.style("color", "#666").text("No data for selected filters");
				return;
			}
			
			// Calculate actual max from quartiles instead of raw max to avoid outliers
			const allPrices = data.map(d => d.price).sort(d3.ascending);
			const q95 = d3.quantile(allPrices, 0.95);
			const maxPrice = Math.min(d3.max(data, d => d.price), q95 * 1.3);
			
			const x = d3.scaleBand().domain(activeBrands).range([0, innerW]).padding(0.3);
			const y = d3.scaleLinear().domain([0, maxPrice]).range([innerH, 0]);
			
			// Grid
			g.append("g").attr("class", "grid").attr("opacity", 0.1)
				.call(d3.axisLeft(y).tickSize(-innerW).tickFormat(""));
			
			// Axes
			g.append("g").attr("transform", `translate(0,${innerH})`)
				.call(d3.axisBottom(x))
				.selectAll("text")
				.style("font-size", "11px")
				.style("fill", "#b8b8b8");
				
			g.append("g").call(d3.axisLeft(y).ticks(5).tickFormat(d => `$${d}`))
				.selectAll("text")
				.style("font-size", "10px")
				.style("fill", "#888");
			
			// Box plots for each brand
			activeBrands.forEach(brand => {
				const brandData = data.filter(d => d.brand === brand).map(d => d.price).sort(d3.ascending);
				if (brandData.length === 0) return;
				
				const q1 = d3.quantile(brandData, 0.25);
				const median = d3.quantile(brandData, 0.5);
				const q3 = d3.quantile(brandData, 0.75);
				const mean = d3.mean(brandData);
				const min = d3.min(brandData);
				const max = d3.max(brandData);
				
				const centerX = x(brand) + x.bandwidth() / 2;
				const boxWidth = x.bandwidth() * 0.6;
				
				// Whiskers
				g.append("line")
					.attr("x1", centerX).attr("x2", centerX)
					.attr("y1", y(min)).attr("y2", y(q1))
					.attr("stroke", brandColors[brand])
					.attr("stroke-width", 1.5)
					.attr("stroke-dasharray", "3,3");
					
				g.append("line")
					.attr("x1", centerX).attr("x2", centerX)
					.attr("y1", y(q3)).attr("y2", y(max))
					.attr("stroke", brandColors[brand])
					.attr("stroke-width", 1.5)
					.attr("stroke-dasharray", "3,3");
				
				// Box
				g.append("rect")
					.attr("x", centerX - boxWidth/2)
					.attr("y", y(q3))
					.attr("width", boxWidth)
					.attr("height", y(q1) - y(q3))
					.attr("fill", brandColors[brand])
					.attr("opacity", filters.clickedBrand === brand ? 0.7 : 0.3)
					.attr("stroke", brandColors[brand])
					.attr("stroke-width", 2)
					.style("cursor", "pointer")
					.on("click", function() {
						filters.clickedBrand = filters.clickedBrand === brand ? null : brand;
						updateAllViews();
					})
					.on("mouseover", function(event) {
						d3.select(this).attr("opacity", 0.8);
						tooltip.style("opacity", 1)
							.html(`
								<div style="font-weight: bold; color: ${brandColors[brand]};">${brand}</div>
								<div>Count: ${brandData.length}</div>
								<div>Mean: $${Math.round(mean)}</div>
								<div>Median: $${Math.round(median)}</div>
								<div>Q1: $${Math.round(q1)} | Q3: $${Math.round(q3)}</div>
								<div style="margin-top: 5px; font-size: 10px; color: #999;">Click to filter</div>
							`)
							.style("left", (event.pageX + 10) + "px")
							.style("top", (event.pageY - 10) + "px");
					})
					.on("mouseout", function() {
						d3.select(this).attr("opacity", filters.clickedBrand === brand ? 0.7 : 0.3);
						tooltip.style("opacity", 0);
					});
				
				// Median line
				g.append("line")
					.attr("x1", centerX - boxWidth/2)
					.attr("x2", centerX + boxWidth/2)
					.attr("y1", y(median))
					.attr("y2", y(median))
					.attr("stroke", "#fff")
					.attr("stroke-width", 2.5);
				
				// Mean dot
				g.append("circle")
					.attr("cx", centerX)
					.attr("cy", y(mean))
					.attr("r", 4)
					.attr("fill", "#d4af37")
					.attr("stroke", "#fff")
					.attr("stroke-width", 1.5);
			});
			
			// Title
			svg.append("text")
				.attr("x", width / 2)
				.attr("y", 18)
				.attr("text-anchor", "middle")
				.style("font-size", "13px")
				.style("fill", "#d4af37")
				.style("font-weight", "500")
				.text("Price Distribution by Brand");
		}

		// 2. Condition Breakdown (Stacked Bar)
		function createConditionBreakdown(data) {
			const panel = d3.select("#condition-breakdown-panel");
			panel.selectAll("*").remove();
			
			// Add expand button
			const expandBtn = panel.append("div")
				.attr("class", "expand-panel-btn")
				.html("⛶")
				.on("click", () => expandPanel("condition-breakdown", data));
			
			const width = 520;
			const height = 240;
			const margin = {top: 30, right: 80, bottom: 50, left: 60};
			
			const svg = panel.append("svg")
				.attr("width", width)
				.attr("height", height);
				
			const g = svg.append("g")
				.attr("transform", `translate(${margin.left},${margin.top})`);
				
			const innerW = width - margin.left - margin.right;
			const innerH = height - margin.top - margin.bottom;
			
			const conditions = ["Never worn", "Very good condition", "Good condition", "Fair condition"];
			const activeBrands = Array.from(filters.brands).filter(b => data.some(d => d.brand === b));
			
			if (activeBrands.length === 0) {
				panel.append("div").style("padding", "80px").style("text-align", "center")
					.style("color", "#666").text("No data for selected filters");
				return;
			}
			
			// Prepare data
			const conditionData = [];
			activeBrands.forEach(brand => {
				const brandTotal = data.filter(d => d.brand === brand).length;
				conditions.forEach(condition => {
					const count = data.filter(d => d.brand === brand && d.condition?.includes(condition)).length;
					if (count > 0) {
						conditionData.push({
							brand,
							condition,
							count,
							percentage: (count / brandTotal) * 100
						});
					}
				});
			});
			
			const x = d3.scaleBand().domain(activeBrands).range([0, innerW]).padding(0.2);
			const y = d3.scaleLinear().domain([0, 100]).range([innerH, 0]);
			
			// Grid
			g.append("g").attr("class", "grid").attr("opacity", 0.1)
				.call(d3.axisLeft(y).tickSize(-innerW).tickFormat(""));
			
			// Axes
			g.append("g").attr("transform", `translate(0,${innerH})`)
				.call(d3.axisBottom(x))
				.selectAll("text")
				.style("font-size", "11px")
				.style("fill", "#b8b8b8");
				
			g.append("g").call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`))
				.selectAll("text")
				.style("font-size", "10px")
				.style("fill", "#888");
			
			// Stacked bars
			activeBrands.forEach(brand => {
				let cumulativeY = 0;
				conditions.forEach((condition, i) => {
					const dataPoint = conditionData.find(d => d.brand === brand && d.condition === condition);
					if (dataPoint) {
						const barHeight = (innerH - y(dataPoint.percentage));
						
						g.append("rect")
							.attr("x", x(brand))
							.attr("y", innerH - cumulativeY - barHeight)
							.attr("width", x.bandwidth())
							.attr("height", barHeight)
							.attr("fill", brandColors[brand])
							.attr("opacity", 0.8 - i * 0.15)
							.attr("stroke", "rgba(255,255,255,0.1)")
							.attr("stroke-width", 1)
							.style("cursor", "pointer")
							.on("click", function() {
								filters.condition = filters.condition === condition ? null : condition;
								updateAllViews();
							})
							.on("mouseover", function(event) {
								d3.select(this).attr("opacity", 1);
								tooltip.style("opacity", 1)
									.html(`
										<div style="font-weight: bold; color: ${brandColors[brand]};">${brand}</div>
										<div>${condition}</div>
										<div>Count: ${dataPoint.count}</div>
										<div>${dataPoint.percentage.toFixed(1)}% of brand</div>
										<div style="margin-top: 5px; font-size: 10px; color: #999;">Click to filter</div>
									`)
									.style("left", (event.pageX + 10) + "px")
									.style("top", (event.pageY - 10) + "px");
							})
							.on("mouseout", function() {
								d3.select(this).attr("opacity", 0.8 - i * 0.15);
								tooltip.style("opacity", 0);
							});
						
						cumulativeY += barHeight;
					}
				});
			});
			
			// Legend
			const legend = svg.append("g").attr("transform", `translate(${width - margin.right + 5}, ${margin.top})`);
			conditions.forEach((condition, i) => {
				const shortLabel = condition.replace(" condition", "").replace("Very ", "V.");
				legend.append("rect")
					.attr("x", 0)
					.attr("y", i * 20)
					.attr("width", 12)
					.attr("height", 12)
					.attr("fill", "#999")
					.attr("opacity", 0.8 - i * 0.15);
				legend.append("text")
					.attr("x", 16)
					.attr("y", i * 20 + 10)
					.style("font-size", "9px")
					.style("fill", "#999")
					.text(shortLabel);
			});
			
			// Title
			svg.append("text")
				.attr("x", width / 2)
				.attr("y", 18)
				.attr("text-anchor", "middle")
				.style("font-size", "13px")
				.style("fill", "#d4af37")
				.style("font-weight", "500")
				.text("Condition Breakdown (%)");
		}

		// 3. Category Volume (Donut Chart)
		function createCategoryVolume(data) {
			const panel = d3.select("#category-volume-panel");
			panel.selectAll("*").remove();
			
			// Add expand button
			const expandBtn = panel.append("div")
				.attr("class", "expand-panel-btn")
				.html("⛶")
				.on("click", () => expandPanel("category-volume", data));
			
			const width = 520;
			const height = 240;
			const radius = Math.min(width, height) / 2 - 40;
			
			const svg = panel.append("svg")
				.attr("width", width)
				.attr("height", height);
				
			const g = svg.append("g")
				.attr("transform", `translate(${width/2},${height/2 + 10})`);
			
			const activeBrands = Array.from(filters.brands).filter(b => data.some(d => d.brand === b));
			
			if (activeBrands.length === 0) {
				panel.append("div").style("padding", "80px").style("text-align", "center")
					.style("color", "#666").text("No data for selected filters");
				return;
			}
			
			// Prepare data
			const volumeData = activeBrands.map(brand => ({
				brand,
				count: data.filter(d => d.brand === brand).length
			}));
			
			const pie = d3.pie().value(d => d.count).sort(null);
			const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);
			const labelArc = d3.arc().innerRadius(radius * 0.7).outerRadius(radius * 0.7);
			
			const arcs = g.selectAll(".arc")
				.data(pie(volumeData))
				.join("g")
				.attr("class", "arc");
			
			arcs.append("path")
				.attr("d", arc)
				.attr("fill", d => brandColors[d.data.brand])
				.attr("opacity", 0.7)
				.attr("stroke", "#0a0a0a")
				.attr("stroke-width", 2)
				.style("cursor", "pointer")
				.on("click", function(event, d) {
					filters.clickedBrand = filters.clickedBrand === d.data.brand ? null : d.data.brand;
					updateAllViews();
				})
				.on("mouseover", function(event, d) {
					d3.select(this).attr("opacity", 1);
					const percentage = ((d.data.count / data.length) * 100).toFixed(1);
					tooltip.style("opacity", 1)
						.html(`
							<div style="font-weight: bold; color: ${brandColors[d.data.brand]};">${d.data.brand}</div>
							<div>Items: ${d.data.count.toLocaleString()}</div>
							<div>${percentage}% of selection</div>
							<div style="margin-top: 5px; font-size: 10px; color: #999;">Click to filter</div>
						`)
						.style("left", (event.pageX + 10) + "px")
						.style("top", (event.pageY - 10) + "px");
				})
				.on("mouseout", function() {
					d3.select(this).attr("opacity", 0.7);
					tooltip.style("opacity", 0);
				})
				.transition()
				.duration(800)
				.attrTween("d", function(d) {
					const interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
					return function(t) { return arc(interpolate(t)); };
				});
			
			arcs.append("text")
				.attr("transform", d => `translate(${labelArc.centroid(d)})`)
				.attr("text-anchor", "middle")
				.style("font-size", "11px")
				.style("fill", "#f5f5f5")
				.style("font-weight", "500")
				.style("opacity", 0)
				.text(d => d.data.count.toLocaleString())
				.transition()
				.delay(800)
				.duration(400)
				.style("opacity", 1);
			
			// Center text
			g.append("text")
				.attr("text-anchor", "middle")
				.attr("y", -5)
				.style("font-size", "24px")
				.style("fill", "#d4af37")
				.style("font-weight", "500")
				.text(data.length.toLocaleString());
				
			g.append("text")
				.attr("text-anchor", "middle")
				.attr("y", 15)
				.style("font-size", "11px")
				.style("fill", "#999")
				.text("Total Items");
			
			// Title
			svg.append("text")
				.attr("x", width / 2)
				.attr("y", 18)
				.attr("text-anchor", "middle")
				.style("font-size", "13px")
				.style("fill", "#d4af37")
				.style("font-weight", "500")
				.text("Market Volume by Brand");
		}

		// 4. Price Range Selector (Histogram with Brush)
		function createPriceRangeSelector(data) {
			const panel = d3.select("#price-range-panel");
			panel.selectAll("*").remove();
			
			// Add expand button
			const expandBtn = panel.append("div")
				.attr("class", "expand-panel-btn")
				.html("⛶")
				.on("click", () => expandPanel("price-range", data));
			
			const width = 520;
			const height = 240;
			const margin = {top: 30, right: 20, bottom: 50, left: 60};
			
			const svg = panel.append("svg")
				.attr("width", width)
				.attr("height", height);
				
			const g = svg.append("g")
				.attr("transform", `translate(${margin.left},${margin.top})`);
				
			const innerW = width - margin.left - margin.right;
			const innerH = height - margin.top - margin.bottom;
			
			if (data.length === 0) {
				panel.append("div").style("padding", "80px").style("text-align", "center")
					.style("color", "#666").text("No data for selected filters");
				return;
			}
			
			// Use 95th percentile to avoid extreme outliers compressing the view
			const allPrices = data.map(d => d.price).sort(d3.ascending);
			const q95 = d3.quantile(allPrices, 0.95);
			const maxPrice = Math.min(d3.max(data, d => d.price), q95 * 1.2);
			
			// Create histogram bins
			const x = d3.scaleLinear()
				.domain([0, maxPrice])
				.range([0, innerW]);
				
			const histogram = d3.histogram()
				.value(d => d.price)
				.domain(x.domain())
				.thresholds(x.ticks(30));
				
			const bins = histogram(data);
			
			const y = d3.scaleLinear()
				.domain([0, d3.max(bins, d => d.length)])
				.range([innerH, 0]);
			
			// Grid
			g.append("g").attr("class", "grid").attr("opacity", 0.1)
				.call(d3.axisLeft(y).tickSize(-innerW).tickFormat(""));
			
			// Axes
			g.append("g").attr("transform", `translate(0,${innerH})`)
				.call(d3.axisBottom(x).ticks(8).tickFormat(d => `$${d}`))
				.selectAll("text")
				.style("font-size", "10px")
				.style("fill", "#888");
				
			g.append("g").call(d3.axisLeft(y).ticks(5))
				.selectAll("text")
				.style("font-size", "10px")
				.style("fill", "#888");
			
			// Bars
			g.selectAll(".hist-bar")
				.data(bins)
				.join("rect")
				.attr("class", "hist-bar")
				.attr("x", d => x(d.x0) + 1)
				.attr("y", d => y(d.length))
				.attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 2))
				.attr("height", d => innerH - y(d.length))
				.attr("fill", "#d4af37")
				.attr("opacity", 0.6)
				.attr("stroke", "rgba(255,255,255,0.1)")
				.attr("stroke-width", 1);
			
			// Brush
			const brush = d3.brushX()
				.extent([[0, 0], [innerW, innerH]])
				.on("end", function(event) {
					if (!event.selection) {
						filters.priceRange = null;
					} else {
						const [x0, x1] = event.selection;
						filters.priceRange = [x.invert(x0), x.invert(x1)];
					}
					updateAllViews();
				});
			
			g.append("g")
				.attr("class", "brush")
				.call(brush);
			
			// Styling brush
			g.selectAll(".brush .selection")
				.attr("fill", "#d4af37")
				.attr("opacity", 0.3);
			
			// Title
			svg.append("text")
				.attr("x", width / 2)
				.attr("y", 18)
				.attr("text-anchor", "middle")
				.style("font-size", "13px")
				.style("fill", "#d4af37")
				.style("font-weight", "500")
				.text("Price Range Selector (Brush to Filter)");
		}

		// Update summary
		function updateSummary(data) {
			const summary = d3.select("#selection-summary");
			const brands = Array.from(filters.brands).join(", ");
			const categories = Array.from(filters.categories).join(", ");
			let text = `Showing ${data.length.toLocaleString()} items | Brands: ${brands} | Categories: ${categories}`;
			
			if (filters.priceRange) {
				text += ` | Price: $${Math.round(filters.priceRange[0])}-$${Math.round(filters.priceRange[1])}`;
			}
			if (filters.condition) {
				text += ` | Condition: ${filters.condition}`;
			}
			if (filters.clickedBrand) {
				text += ` | Focus: ${filters.clickedBrand}`;
			}
			
			summary.text(text);
		}

		// Expand panel to fullscreen modal
		function expandPanel(panelType, data) {
			const modal = d3.select("body").append("div")
				.attr("class", "panel-modal")
				.style("opacity", 0);
			
			const modalContent = modal.append("div")
				.attr("class", "panel-modal-content");
			
			const closeBtn = modalContent.append("div")
				.attr("class", "modal-close-btn")
				.html("×")
				.on("click", () => {
					modal.transition().duration(300).style("opacity", 0)
						.on("end", () => modal.remove());
				});
			
			const expandedPanel = modalContent.append("div")
				.attr("id", `expanded-${panelType}`);
			
			// Render larger version based on panel type
			if (panelType === "price-distribution") {
				renderExpandedPriceDistribution(expandedPanel, data);
			} else if (panelType === "condition-breakdown") {
				renderExpandedConditionBreakdown(expandedPanel, data);
			} else if (panelType === "category-volume") {
				renderExpandedCategoryVolume(expandedPanel, data);
			} else if (panelType === "price-range") {
				renderExpandedPriceRange(expandedPanel, data);
			}
			
			modal.transition().duration(300).style("opacity", 1);
			
			// Close on background click
			modal.on("click", function(event) {
				if (event.target === modal.node()) {
					modal.transition().duration(300).style("opacity", 0)
						.on("end", () => modal.remove());
				}
			});
		}

		// Expanded versions (larger, more detailed)
		function renderExpandedPriceDistribution(container, data) {
			const width = 900;
			const height = 600;
			const margin = {top: 60, right: 40, bottom: 80, left: 100};
			
			const svg = container.append("svg")
				.attr("width", width)
				.attr("height", height);
				
			const g = svg.append("g")
				.attr("transform", `translate(${margin.left},${margin.top})`);
				
			const innerW = width - margin.left - margin.right;
			const innerH = height - margin.top - margin.bottom;
			
			const activeBrands = Array.from(filters.brands).filter(b => data.some(d => d.brand === b));
			const allPrices = data.map(d => d.price).sort(d3.ascending);
			const q95 = d3.quantile(allPrices, 0.95);
			const maxPrice = Math.min(d3.max(data, d => d.price), q95 * 1.3);
			
			const x = d3.scaleBand().domain(activeBrands).range([0, innerW]).padding(0.3);
			const y = d3.scaleLinear().domain([0, maxPrice]).range([innerH, 0]);
			
			g.append("g").attr("class", "grid").attr("opacity", 0.1)
				.call(d3.axisLeft(y).tickSize(-innerW).tickFormat(""));
			
			g.append("g").attr("transform", `translate(0,${innerH})`)
				.call(d3.axisBottom(x))
				.selectAll("text")
				.style("font-size", "16px")
				.style("fill", "#b8b8b8");
				
			g.append("g").call(d3.axisLeft(y).ticks(10).tickFormat(d => `$${d}`))
				.selectAll("text")
				.style("font-size", "14px")
				.style("fill", "#888");
			
			activeBrands.forEach(brand => {
				const brandData = data.filter(d => d.brand === brand).map(d => d.price).sort(d3.ascending);
				const q1 = d3.quantile(brandData, 0.25);
				const median = d3.quantile(brandData, 0.5);
				const q3 = d3.quantile(brandData, 0.75);
				const mean = d3.mean(brandData);
				const min = d3.min(brandData);
				const max = Math.min(d3.max(brandData), maxPrice);
				
				const centerX = x(brand) + x.bandwidth() / 2;
				const boxWidth = x.bandwidth() * 0.6;
				
				g.append("line")
					.attr("x1", centerX).attr("x2", centerX)
					.attr("y1", y(min)).attr("y2", y(q1))
					.attr("stroke", brandColors[brand])
					.attr("stroke-width", 2)
					.attr("stroke-dasharray", "4,4");
					
				g.append("line")
					.attr("x1", centerX).attr("x2", centerX)
					.attr("y1", y(q3)).attr("y2", y(max))
					.attr("stroke", brandColors[brand])
					.attr("stroke-width", 2)
					.attr("stroke-dasharray", "4,4");
				
				g.append("rect")
					.attr("x", centerX - boxWidth/2)
					.attr("y", y(q3))
					.attr("width", boxWidth)
					.attr("height", y(q1) - y(q3))
					.attr("fill", brandColors[brand])
					.attr("opacity", 0.3)
					.attr("stroke", brandColors[brand])
					.attr("stroke-width", 3);
				
				g.append("line")
					.attr("x1", centerX - boxWidth/2)
					.attr("x2", centerX + boxWidth/2)
					.attr("y1", y(median))
					.attr("y2", y(median))
					.attr("stroke", "#fff")
					.attr("stroke-width", 4);
				
				g.append("circle")
					.attr("cx", centerX)
					.attr("cy", y(mean))
					.attr("r", 6)
					.attr("fill", "#d4af37")
					.attr("stroke", "#fff")
					.attr("stroke-width", 2);
			});
			
			svg.append("text")
				.attr("x", width / 2)
				.attr("y", 30)
				.attr("text-anchor", "middle")
				.style("font-size", "20px")
				.style("fill", "#d4af37")
				.style("font-weight", "500")
				.text("Price Distribution by Brand");
		}

	function renderExpandedConditionBreakdown(container, data) {
		const width = 900;
		const height = 600;
		const margin = {top: 60, right: 120, bottom: 80, left: 100};
		
		const svg = container.append("svg")
			.attr("width", width)
			.attr("height", height);
			
		const g = svg.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);
			
		const innerW = width - margin.left - margin.right;
		const innerH = height - margin.top - margin.bottom;
		
		const conditions = ["Never worn", "Very good condition", "Good condition", "Fair condition"];
		const activeBrands = Array.from(filters.brands).filter(b => data.some(d => d.brand === b));
		
		const conditionData = [];
		activeBrands.forEach(brand => {
			const brandTotal = data.filter(d => d.brand === brand).length;
			conditions.forEach(condition => {
				const count = data.filter(d => d.brand === brand && d.condition?.includes(condition)).length;
				if (count > 0) {
					conditionData.push({
						brand,
						condition,
						count,
						percentage: (count / brandTotal) * 100
					});
				}
			});
		});
		
		const x = d3.scaleBand().domain(activeBrands).range([0, innerW]).padding(0.2);
		const y = d3.scaleLinear().domain([0, 100]).range([innerH, 0]);
		
		g.append("g").attr("class", "grid").attr("opacity", 0.1)
			.call(d3.axisLeft(y).tickSize(-innerW).tickFormat(""));
		
		g.append("g").attr("transform", `translate(0,${innerH})`)
			.call(d3.axisBottom(x))
			.selectAll("text")
			.style("font-size", "16px")
			.style("fill", "#b8b8b8");
			
		g.append("g").call(d3.axisLeft(y).ticks(10).tickFormat(d => `${d}%`))
			.selectAll("text")
			.style("font-size", "14px")
			.style("fill", "#888");
		
		activeBrands.forEach(brand => {
			let cumulativeY = 0;
			conditions.forEach((condition, i) => {
				const dataPoint = conditionData.find(d => d.brand === brand && d.condition === condition);
				if (dataPoint) {
					const barHeight = (innerH - y(dataPoint.percentage));
					
					g.append("rect")
						.attr("x", x(brand))
						.attr("y", innerH - cumulativeY - barHeight)
						.attr("width", x.bandwidth())
						.attr("height", barHeight)
						.attr("fill", brandColors[brand])
						.attr("opacity", 0.8 - i * 0.15)
						.attr("stroke", "rgba(255,255,255,0.1)")
						.attr("stroke-width", 1);
					
					// Add percentage labels for larger segments
					if (dataPoint.percentage > 8) {
						g.append("text")
							.attr("x", x(brand) + x.bandwidth() / 2)
							.attr("y", innerH - cumulativeY - barHeight/2)
							.attr("text-anchor", "middle")
							.attr("dominant-baseline", "middle")
							.style("font-size", "12px")
							.style("fill", "#fff")
							.style("font-weight", "500")
							.text(`${dataPoint.percentage.toFixed(1)}%`);
					}
					
					cumulativeY += barHeight;
				}
			});
		});
		
		const legend = svg.append("g").attr("transform", `translate(${width - margin.right + 10}, ${margin.top})`);
		conditions.forEach((condition, i) => {
			const shortLabel = condition.replace(" condition", "").replace("Very ", "V.");
			legend.append("rect")
				.attr("x", 0)
				.attr("y", i * 25)
				.attr("width", 16)
				.attr("height", 16)
				.attr("fill", "#999")
				.attr("opacity", 0.8 - i * 0.15);
			legend.append("text")
				.attr("x", 22)
				.attr("y", i * 25 + 13)
				.style("font-size", "12px")
				.style("fill", "#999")
				.text(condition);
		});
		
		svg.append("text")
			.attr("x", width / 2)
			.attr("y", 30)
			.attr("text-anchor", "middle")
			.style("font-size", "20px")
			.style("fill", "#d4af37")
			.style("font-weight", "500")
			.text("Condition Breakdown by Brand (%)");
	}	function renderExpandedCategoryVolume(container, data) {
		const width = 900;
		const height = 600;
		const radius = Math.min(width, height) / 2 - 80;
		
		const svg = container.append("svg")
			.attr("width", width)
			.attr("height", height);
			
		const g = svg.append("g")
			.attr("transform", `translate(${width/2},${height/2 + 20})`);
		
		const activeBrands = Array.from(filters.brands).filter(b => data.some(d => d.brand === b));
		
		const volumeData = activeBrands.map(brand => ({
			brand,
			count: data.filter(d => d.brand === brand).length
		}));
		
		const pie = d3.pie().value(d => d.count).sort(null);
		const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);
		const labelArc = d3.arc().innerRadius(radius * 0.75).outerRadius(radius * 0.75);
		const outerArc = d3.arc().innerRadius(radius * 1.1).outerRadius(radius * 1.1);
		
		const arcs = g.selectAll(".arc")
			.data(pie(volumeData))
			.join("g")
			.attr("class", "arc");
		
		arcs.append("path")
			.attr("d", arc)
			.attr("fill", d => brandColors[d.data.brand])
			.attr("opacity", 0.7)
			.attr("stroke", "#0a0a0a")
			.attr("stroke-width", 3)
			.transition()
			.duration(800)
			.attrTween("d", function(d) {
				const interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
				return function(t) { return arc(interpolate(t)); };
			});
		
		// Count labels inside arcs
		arcs.append("text")
			.attr("transform", d => `translate(${labelArc.centroid(d)})`)
			.attr("text-anchor", "middle")
			.style("font-size", "16px")
			.style("fill", "#f5f5f5")
			.style("font-weight", "500")
			.style("opacity", 0)
			.text(d => d.data.count.toLocaleString())
			.transition()
			.delay(800)
			.duration(400)
			.style("opacity", 1);
		
		// Brand labels with polylines
		arcs.append("polyline")
			.attr("points", function(d) {
				const pos = outerArc.centroid(d);
				const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
				pos[0] = radius * 1.15 * (midAngle < Math.PI ? 1 : -1);
				return [labelArc.centroid(d), outerArc.centroid(d), pos];
			})
			.attr("stroke", d => brandColors[d.data.brand])
			.attr("stroke-width", 2)
			.attr("fill", "none")
			.style("opacity", 0)
			.transition()
			.delay(1000)
			.duration(400)
			.style("opacity", 0.6);
		
		arcs.append("text")
			.attr("transform", function(d) {
				const pos = outerArc.centroid(d);
				const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
				pos[0] = radius * 1.18 * (midAngle < Math.PI ? 1 : -1);
				return `translate(${pos})`;
			})
			.attr("text-anchor", function(d) {
				const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
				return midAngle < Math.PI ? "start" : "end";
			})
			.style("font-size", "16px")
			.style("fill", d => brandColors[d.data.brand])
			.style("font-weight", "500")
			.style("opacity", 0)
			.each(function(d) {
				const percentage = ((d.data.count / data.length) * 100).toFixed(1);
				d3.select(this).append("tspan")
					.text(d.data.brand)
					.attr("x", 0);
				d3.select(this).append("tspan")
					.text(`${percentage}%`)
					.attr("x", 0)
					.attr("dy", "1.2em")
					.style("font-size", "14px")
					.style("fill", "#999");
			})
			.transition()
			.delay(1000)
			.duration(400)
			.style("opacity", 1);
		
		// Center text
		g.append("text")
			.attr("text-anchor", "middle")
			.attr("y", -10)
			.style("font-size", "36px")
			.style("fill", "#d4af37")
			.style("font-weight", "500")
			.text(data.length.toLocaleString());
			
		g.append("text")
			.attr("text-anchor", "middle")
			.attr("y", 25)
			.style("font-size", "16px")
			.style("fill", "#999")
			.text("Total Items");
		
		svg.append("text")
			.attr("x", width / 2)
			.attr("y", 30)
			.attr("text-anchor", "middle")
			.style("font-size", "20px")
			.style("fill", "#d4af37")
			.style("font-weight", "500")
			.text("Market Volume by Brand");
	}		function renderExpandedPriceRange(container, data) {
			const width = 900;
			const height = 600;
			const margin = {top: 60, right: 40, bottom: 80, left: 100};
			
			const svg = container.append("svg")
				.attr("width", width)
				.attr("height", height);
				
			const g = svg.append("g")
				.attr("transform", `translate(${margin.left},${margin.top})`);
				
			const innerW = width - margin.left - margin.right;
			const innerH = height - margin.top - margin.bottom;
			
			const allPrices = data.map(d => d.price).sort(d3.ascending);
			const q95 = d3.quantile(allPrices, 0.95);
			const maxPrice = Math.min(d3.max(data, d => d.price), q95 * 1.2);
			
			const x = d3.scaleLinear().domain([0, maxPrice]).range([0, innerW]);
			const histogram = d3.histogram()
				.value(d => d.price)
				.domain(x.domain())
				.thresholds(x.ticks(50));
				
			const bins = histogram(data);
			const y = d3.scaleLinear()
				.domain([0, d3.max(bins, d => d.length)])
				.range([innerH, 0]);
			
			g.append("g").attr("class", "grid").attr("opacity", 0.1)
				.call(d3.axisLeft(y).tickSize(-innerW).tickFormat(""));
			
			g.append("g").attr("transform", `translate(0,${innerH})`)
				.call(d3.axisBottom(x).ticks(12).tickFormat(d => `$${d}`))
				.selectAll("text")
				.style("font-size", "14px")
				.style("fill", "#888");
				
			g.append("g").call(d3.axisLeft(y).ticks(10))
				.selectAll("text")
				.style("font-size", "14px")
				.style("fill", "#888");
			
			g.selectAll(".hist-bar")
				.data(bins)
				.join("rect")
				.attr("class", "hist-bar")
				.attr("x", d => x(d.x0) + 1)
				.attr("y", d => y(d.length))
				.attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 2))
				.attr("height", d => innerH - y(d.length))
				.attr("fill", "#d4af37")
				.attr("opacity", 0.6)
				.attr("stroke", "rgba(255,255,255,0.1)")
				.attr("stroke-width", 1);
			
			svg.append("text")
				.attr("x", width / 2)
				.attr("y", 30)
				.attr("text-anchor", "middle")
				.style("font-size", "20px")
				.style("fill", "#d4af37")
				.style("font-weight", "500")
				.text("Price Range Distribution (Detailed View)");
		}

		// Event listeners for filters
		document.querySelectorAll('.brand-filter').forEach(checkbox => {
			checkbox.addEventListener('change', (e) => {
				if (e.target.checked) {
					filters.brands.add(e.target.value);
				} else {
					filters.brands.delete(e.target.value);
				}
				if (filters.brands.size === 0) {
					e.target.checked = true;
					filters.brands.add(e.target.value);
					return;
				}
				updateAllViews();
			});
		});

		document.querySelectorAll('.category-filter').forEach(checkbox => {
			checkbox.addEventListener('change', (e) => {
				if (e.target.checked) {
					filters.categories.add(e.target.value);
				} else {
					filters.categories.delete(e.target.value);
				}
				if (filters.categories.size === 0) {
					e.target.checked = true;
					filters.categories.add(e.target.value);
					return;
				}
				updateAllViews();
			});
		});

		document.getElementById('reset-filters').addEventListener('click', () => {
			filters.brands = new Set(["Hermès", "Gucci", "Coach"]);
			filters.categories = new Set(["Accessories", "Apparel"]);
			filters.priceRange = null;
			filters.condition = null;
			filters.clickedBrand = null;
			
			document.querySelectorAll('.brand-filter, .category-filter').forEach(cb => cb.checked = true);
			updateAllViews();
		});

		// Initial render
		updateAllViews();
	};
	
	// Insights modal functionality
	const insightsBtn = document.getElementById('insights-btn-vestiaire');
	const insightsModal = document.getElementById('insights-modal-vestiaire');
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
