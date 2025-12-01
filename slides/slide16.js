(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-vestiaire">
			<div class="slide-content">
				<h2 class="section-title">The Vestiaire Marketplace</h2>
				<p class="section-subtitle">Real-time pricing data from 62,000+ luxury resale items</p>
				
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
				
				<div class="viz-container">
					<div id="vestiaire-viz"></div>
				</div>

				<div class="vestiaire-controls">
					<button class="luxury-button active" data-vestiaire-view="violin">Price Distribution</button>
					<button class="luxury-button" data-vestiaire-view="condition">By Condition</button>
					<button class="luxury-button" data-vestiaire-view="volume">Market Volume</button>
				</div>
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
				sold: d.sold === "TRUE"
			}));

		// Match slide 15's dimensions exactly
		const margin = {top: 60, right: 120, bottom: 120, left: 100};
		const width = 1200 - margin.left - margin.right;
		const height = 500 - margin.top - margin.bottom;

		const svg = d3.select("#vestiaire-viz")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const tooltip = d3.select("#vestiaire-viz")
			.append("div")
			.attr("class", "traffic-tooltip")
			.style("opacity", 0);

		function updateVisualization(view) {
			svg.selectAll("*").remove();
			if (view === "violin") createViolinPlot();
			else if (view === "condition") createConditionChart();
			else if (view === "volume") createVolumeChart();
		}

		function createViolinPlot() {
			const brands = ["Coach", "Gucci", "Hermès"];
			const x = d3.scaleBand().domain(brands).range([0, width]).padding(0.3);
			const y = d3.scaleLinear().domain([0, 1000]).range([height, 0]);

			svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x))
				.selectAll("text").style("font-size", "14px").style("fill", "#b8b8b8");
			svg.append("g").call(d3.axisLeft(y).tickFormat(d => `$${d}`))
				.selectAll("text").style("font-size", "12px").style("fill", "#b8b8b8");
			svg.append("g").attr("class", "grid").attr("opacity", 0.1)
				.call(d3.axisLeft(y).tickSize(-width).tickFormat(""));

			brands.forEach(brand => {
				const brandData = allData.filter(d => d.brand === brand).map(d => d.price);
				const sorted = brandData.sort(d3.ascending);
				const q1 = d3.quantile(sorted, 0.25);
				const median = d3.quantile(sorted, 0.5);
				const q3 = d3.quantile(sorted, 0.75);
				const mean = d3.mean(sorted);
				const boxWidth = 40;
				const centerX = x(brand) + x.bandwidth() / 2;

				svg.append("rect")
					.attr("x", centerX - boxWidth/2).attr("y", y(q3))
					.attr("width", boxWidth).attr("height", y(q1) - y(q3))
					.attr("fill", brandColors[brand]).attr("opacity", 0.3)
					.attr("stroke", brandColors[brand]).attr("stroke-width", 2);

				svg.append("line")
					.attr("x1", centerX - boxWidth/2).attr("x2", centerX + boxWidth/2)
					.attr("y1", y(median)).attr("y2", y(median))
					.attr("stroke", brandColors[brand]).attr("stroke-width", 3);

				svg.append("circle")
					.attr("cx", centerX).attr("cy", y(mean)).attr("r", 5)
					.attr("fill", "#d4af37").attr("stroke", "#fff").attr("stroke-width", 2);

				svg.append("text")
					.attr("x", centerX).attr("y", y(q3) - 10)
					.attr("text-anchor", "middle")
					.style("font-size", "12px").style("fill", "#d4af37")
					.text(`$${Math.round(mean)}`);
			});

			const legend = svg.append("g").attr("transform", `translate(${width - 90}, 10)`);
			legend.append("circle").attr("r", 5).attr("fill", "#d4af37");
			legend.append("text").attr("x", 15).attr("y", 5)
				.style("font-size", "12px").style("fill", "#b8b8b8").text("Mean Price");

			svg.append("text").attr("x", width / 2).attr("y", -20)
				.attr("text-anchor", "middle").style("font-size", "16px")
				.style("fill", "#d4af37").text("Price Distribution by Brand");
		}

		function createConditionChart() {
			const conditions = ["Never worn", "Very good condition", "Good condition", "Fair condition"];
			const brands = ["Coach", "Gucci", "Hermès"];

			const conditionData = [];
			brands.forEach(brand => {
				conditions.forEach(condition => {
					const items = allData.filter(d => 
						d.brand === brand && 
						(d.condition === condition || d.condition === `${condition}, with tag`)
					);
					if (items.length > 0) {
						conditionData.push({
							brand,
							condition,
							count: items.length,
							avgPrice: d3.mean(items, d => d.price)
						});
					}
				});
			});

			const x0 = d3.scaleBand().domain(brands).range([0, width]).padding(0.2);
			const x1 = d3.scaleBand().domain(conditions).range([0, x0.bandwidth()]).padding(0.1);
			const y = d3.scaleLinear()
				.domain([0, d3.max(conditionData, d => d.avgPrice)])
				.range([height, 0]).nice();

			svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x0))
				.selectAll("text").style("font-size", "14px").style("fill", "#b8b8b8");
			svg.append("g").call(d3.axisLeft(y).tickFormat(d => `$${d}`))
				.selectAll("text").style("font-size", "12px").style("fill", "#b8b8b8");
			svg.append("g").attr("class", "grid").attr("opacity", 0.1)
				.call(d3.axisLeft(y).tickSize(-width).tickFormat(""));

			brands.forEach(brand => {
				const brandGroup = svg.append("g").attr("transform", `translate(${x0(brand)},0)`);

				conditions.forEach(condition => {
					const data = conditionData.find(d => d.brand === brand && d.condition === condition);
					if (data) {
						brandGroup.append("rect")
							.attr("x", x1(condition))
							.attr("y", height)
							.attr("width", x1.bandwidth())
							.attr("height", 0)
							.attr("fill", brandColors[brand])
							.attr("opacity", 0.7 - conditions.indexOf(condition) * 0.15)
							.attr("rx", 3)
							.on("mouseover", function(event) {
								d3.select(this).attr("opacity", 1);
								tooltip.style("opacity", 1)
									.html(`
										<div style="font-weight: bold; margin-bottom: 5px;">${brand}</div>
										<div>${condition}</div>
										<div style="color: #d4af37;">Avg: $${Math.round(data.avgPrice)}</div>
										<div style="font-size: 0.9em;">Count: ${data.count}</div>
									`)
									.style("left", (event.pageX + 10) + "px")
									.style("top", (event.pageY - 10) + "px");
							})
							.on("mouseout", function() {
								d3.select(this).attr("opacity", 0.7 - conditions.indexOf(condition) * 0.15);
								tooltip.style("opacity", 0);
							})
							.transition().duration(800).delay(conditions.indexOf(condition) * 50)
							.attr("y", y(data.avgPrice))
							.attr("height", height - y(data.avgPrice));
					}
				});
			});

			svg.append("text").attr("x", width / 2).attr("y", -20)
				.attr("text-anchor", "middle").style("font-size", "16px")
				.style("fill", "#d4af37").text("Average Price by Condition");
		}

		function createVolumeChart() {
			const brands = ["Coach", "Gucci", "Hermès"];
			const volumeData = brands.map(brand => ({
				brand,
				total: allData.filter(d => d.brand === brand).length,
				sold: allData.filter(d => d.brand === brand && d.sold).length,
				available: allData.filter(d => d.brand === brand && !d.sold).length
			}));

			const x = d3.scaleBand().domain(brands).range([0, width]).padding(0.3);
			const y = d3.scaleLinear()
				.domain([0, d3.max(volumeData, d => d.total)])
				.range([height, 0]).nice();

			svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x))
				.selectAll("text").style("font-size", "14px").style("fill", "#b8b8b8");
			svg.append("g").call(d3.axisLeft(y).tickFormat(d => d.toLocaleString()))
				.selectAll("text").style("font-size", "12px").style("fill", "#b8b8b8");
			svg.append("g").attr("class", "grid").attr("opacity", 0.1)
				.call(d3.axisLeft(y).tickSize(-width).tickFormat(""));

			volumeData.forEach(d => {
				const barX = x(d.brand);
				const barWidth = x.bandwidth();

				// Available items (bottom)
				svg.append("rect")
					.attr("x", barX).attr("y", height)
					.attr("width", barWidth).attr("height", 0)
					.attr("fill", brandColors[d.brand]).attr("opacity", 0.5).attr("rx", 3)
					.transition().duration(800)
					.attr("y", y(d.available))
					.attr("height", height - y(d.available));

				// Sold items (top)
				svg.append("rect")
					.attr("x", barX).attr("y", height)
					.attr("width", barWidth).attr("height", 0)
					.attr("fill", brandColors[d.brand]).attr("opacity", 0.9).attr("rx", 3)
					.on("mouseover", function(event) {
						tooltip.style("opacity", 1)
							.html(`
								<div style="font-weight: bold; margin-bottom: 5px;">${d.brand}</div>
								<div style="color: #4ade80;">Sold: ${d.sold.toLocaleString()}</div>
								<div>Available: ${d.available.toLocaleString()}</div>
								<div style="color: #d4af37; margin-top: 5px;">Total: ${d.total.toLocaleString()}</div>
							`)
							.style("left", (event.pageX + 10) + "px")
							.style("top", (event.pageY - 10) + "px");
					})
					.on("mouseout", function() {
						tooltip.style("opacity", 0);
					})
					.transition().duration(800).delay(400)
					.attr("y", y(d.total))
					.attr("height", y(d.available) - y(d.total));

				svg.append("text")
					.attr("x", barX + barWidth / 2).attr("y", y(d.total) - 10)
					.attr("text-anchor", "middle")
					.style("font-size", "14px").style("fill", "#d4af37")
					.style("font-weight", "500").text(d.total.toLocaleString())
					.style("opacity", 0)
					.transition().delay(1000).duration(500).style("opacity", 1);
			});

			const legend = svg.append("g").attr("transform", `translate(${width - 150}, 20)`);
			legend.append("rect").attr("x", 0).attr("y", 0).attr("width", 20).attr("height", 15)
				.attr("fill", "#d4af37").attr("opacity", 0.9);
			legend.append("text").attr("x", 25).attr("y", 12)
				.style("font-size", "12px").style("fill", "#b8b8b8").text("Sold");
			legend.append("rect").attr("x", 0).attr("y", 25).attr("width", 20).attr("height", 15)
				.attr("fill", "#d4af37").attr("opacity", 0.5);
			legend.append("text").attr("x", 25).attr("y", 37)
				.style("font-size", "12px").style("fill", "#b8b8b8").text("Available");

			svg.append("text").attr("x", width / 2).attr("y", -20)
				.attr("text-anchor", "middle").style("font-size", "16px")
				.style("fill", "#d4af37").text(`Market Volume: ${allData.length.toLocaleString()} Items`);
		}

		updateVisualization("violin");

		d3.selectAll("[data-vestiaire-view]").on("click", function() {
			const view = d3.select(this).attr("data-vestiaire-view");
			d3.selectAll("[data-vestiaire-view]").classed("active", false);
			d3.select(this).classed("active", true);
			updateVisualization(view);
		});
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
