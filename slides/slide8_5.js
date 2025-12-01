/**
 * Global Brand Dominance Map Visualization
 * Shows which luxury brand (Hermès, Gucci, Coach) dominates in each country
 */

(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-7-5">
			<div class="slide-content">
				<h2 class="section-title">Global Brand Dominance</h2>
				<p class="section-subtitle">Which luxury brand dominates each market worldwide</p>
				
				<div class="viz-container" style="width: 100%; max-width: 1200px; margin: 0 auto;">
					<div id="world-map-viz" style="width: 100%; display: flex; justify-content: center;"></div>
					<div class="map-controls" style="margin-top: 20px; text-align: center;">
						<button class="brand-filter-btn active" data-brand="all">All Brands</button>
						<button class="brand-filter-btn" data-brand="Hermès">Hermès</button>
						<button class="brand-filter-btn" data-brand="Gucci">Gucci</button>
						<button class="brand-filter-btn" data-brand="Coach">Coach</button>
					</div>
					<div id="map-stats" style="margin-top: 15px; text-align: center; font-size: 0.9rem; color: #999;"></div>
				</div>
			</div>
		</section>
	`);

	async function createWorldMap() {
		console.log("🗺️ Initializing World Map Visualization");

		// Select the container
		const container = d3.select("#world-map-viz");

		if (container.empty()) {
			console.error("❌ Container #world-map-viz not found!");
			return;
		}

		// Clear any existing content
		container.html("");

		const tooltip = d3.select(".tooltip");
		const width = 1200;
		const height = 650;

		// Show loading state
		container.append("div")
			.attr("class", "loading-indicator")
			.style("text-align", "center")
			.style("padding", "37px")
			.style("color", "#d4af37")
			.style("font-size", "1.1rem")
			.text("Loading world map...");

		try {
			// 1. Load TopoJSON world map from CDN
			console.log("📡 Loading world atlas...");
			const world = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
			console.log("✓ World atlas loaded");

			const countries = topojson.feature(world, world.objects.countries);
			console.log(`✓ Extracted ${countries.features.length} countries`);

			// 2. Load local CSV data
			console.log("📊 Loading data files...");

			// Load CSV as text first to handle the weird header format
			const geoText = await d3.text("data/geoMap (3).csv");
			const trafficData = await d3.csv("data/topcountriestraffic.csv");

			console.log("✓ CSV text loaded, processing...");

			// The CSV has "Category: Shopping" as first line, skip it and the blank line
			const lines = geoText.split('\n');
			console.log(`📄 Total lines in CSV: ${lines.length}`);
			console.log(`📄 First 5 lines:`);
			lines.slice(0, 5).forEach((line, i) => console.log(`  ${i}: "${line}"`));

			// Skip first 2 rows (Category: Shopping and blank line)
			const cleanCSV = lines.slice(2).join('\n');

			// Now parse the cleaned CSV
			const geoDataRaw = d3.csvParse(cleanCSV);
			console.log(`✓ Data loaded: ${geoDataRaw.length} geo rows, ${trafficData.length} traffic rows`);

			// Check if we got any data
			if (!geoDataRaw || geoDataRaw.length === 0) {
				throw new Error("CSV file is empty or failed to load!");
			}

			// Debug: Log the actual column names
			console.log("=".repeat(60));
			console.log("CSV DATA ANALYSIS");
			console.log("=".repeat(60));
			const columnNames = Object.keys(geoDataRaw[0]);
			console.log("📋 CSV Column names:", columnNames);
			console.log("📋 Total columns:", columnNames.length);

			console.log("\n📋 Sample rows (first 5):");
			geoDataRaw.slice(0, 5).forEach((row, i) => {
				console.log(`  Row ${i}:`, row);
			});

			// 3. Get column names from raw data (before filtering)
			const columns = Object.keys(geoDataRaw[0]);

			console.log("\n🔍 Searching for brand columns:");
			console.log("  All columns:", columns);

			const coachCol = columns.find(col => col.toLowerCase().includes('coach'));
			const gucciCol = columns.find(col => col.toLowerCase().includes('gucci'));
			const hermesCol = columns.find(col => col.toLowerCase().includes('hermès') || col.toLowerCase().includes('hermes'));

			console.log(`\n📊 FOUND COLUMNS:`);
			console.log(`  Coach: "${coachCol}" (${coachCol ? 'FOUND' : 'NOT FOUND'})`);
			console.log(`  Gucci: "${gucciCol}" (${gucciCol ? 'FOUND' : 'NOT FOUND'})`);
			console.log(`  Hermès: "${hermesCol}" (${hermesCol ? 'FOUND' : 'NOT FOUND'})`);

			if (!coachCol || !gucciCol || !hermesCol) {
				console.error("❌ MISSING COLUMNS!");
				console.log("Available columns:", columns);
				throw new Error(`Missing required columns! Coach:${!!coachCol}, Gucci:${!!gucciCol}, Hermès:${!!hermesCol}`);
			}

			// Filter data - keep rows with actual country names
			const geoData = geoDataRaw.filter((d, idx) => {
				// Skip the header rows
				if (!d.Country) {
					if (idx < 5) console.log(`  Skipping row ${idx}: no Country field`);
					return false;
				}
				if (d.Country === 'Category: Shopping') return false;
				if (d.Country === 'Country') return false;
				if (d.Country.trim() === '') return false;

				// Keep all rows with country names (even if they have empty data)
				// We'll filter for actual data values later
				return true;
			});

			console.log(`✓ Filtered to ${geoData.length} valid country rows (from ${geoDataRaw.length} total)`);

			if (geoData.length === 0) {
				console.error("❌ No countries found in CSV!");
				console.log("First 10 raw rows:", geoDataRaw.slice(0, 10));
				throw new Error("No valid data found in CSV after filtering!");
			}

			// Country name mapping (CSV → TopoJSON)
			const countryNameMap = {
				'United States': 'United States of America',
				'United Kingdom': 'United Kingdom',
				'South Korea': 'Republic of Korea',
				'Hong Kong': 'China',
				'Czechia': 'Czechia',
				'Czech Republic': 'Czechia',
				'Tanzania': 'United Republic of Tanzania',
				'UAE': 'United Arab Emirates',
				'United Arab Emirates': 'United Arab Emirates'
			};

			// Build country data map
			const countryMap = new Map();

			let processedCount = 0;
			let skippedCount = 0;

			geoData.forEach((d, index) => {
				// Parse values, handling empty strings
				const coachStr = d[coachCol] || '';
				const gucciStr = d[gucciCol] || '';
				const hermesStr = d[hermesCol] || '';

				const coachVal = coachStr.trim() ? parseFloat(coachStr.replace('%', '')) : 0;
				const gucciVal = gucciStr.trim() ? parseFloat(gucciStr.replace('%', '')) : 0;
				const hermesVal = hermesStr.trim() ? parseFloat(hermesStr.replace('%', '')) : 0;
				const total = coachVal + gucciVal + hermesVal;

				// Debug first few rows
				if (index < 5) {
					console.log(`Row ${index}: "${d.Country}" - Coach:"${coachStr}"=${coachVal}% Gucci:"${gucciStr}"=${gucciVal}% Hermès:"${hermesStr}"=${hermesVal}% Total:${total}%`);
				}

				if (total > 0) {
					processedCount++;
					const dominant = gucciVal > coachVal && gucciVal > hermesVal ? 'Gucci' :
									 hermesVal > coachVal ? 'Hermès' : 'Coach';

					const mappedName = countryNameMap[d.Country] || d.Country;

					const countryInfo = {
						coach: coachVal,
						gucci: gucciVal,
						hermes: hermesVal,
						dominant: dominant,
						total: total
					};

					countryMap.set(mappedName, countryInfo);
					if (mappedName !== d.Country) {
						countryMap.set(d.Country, countryInfo);
					}
				} else {
					skippedCount++;
				}
			});

			console.log(`✓ Processed ${processedCount} countries with data, skipped ${skippedCount} empty (map size: ${countryMap.size})`);

			if (processedCount === 0) {
				console.error("❌ No countries have percentage data!");
				console.log("Sample data values:");
				geoData.slice(0, 3).forEach((d, i) => {
					console.log(`  ${i}: ${d.Country} -> Coach: "${d[coachCol]}", Gucci: "${d[gucciCol]}", Hermès: "${d[hermesCol]}"`);
				});
				throw new Error("No countries with valid percentage data found!");
			}

			// 4. Remove loading indicator and create SVG
			container.select(".loading-indicator").remove();

			const svg = container.append("svg")
				.attr("width", width)
				.attr("height", height)
				.attr("viewBox", `0 0 ${width} ${height}`)
				.attr("preserveAspectRatio", "xMidYMid meet")
				.style("max-width", "100%")
				.style("height", "auto");

			// Add zoom behavior
			const g = svg.append("g");

			const zoom = d3.zoom()
				.scaleExtent([1, 8])
				.on("zoom", (event) => {
					g.attr("transform", event.transform);
				});

			svg.call(zoom);

			// Add zoom controls
			const zoomControls = container.append("div")
				.attr("class", "zoom-controls")
				.style("position", "absolute")
				.style("top", "20px")
				.style("right", "20px")
				.style("display", "flex")
				.style("flex-direction", "column")
				.style("gap", "10px")
				.style("z-index", "10");

			zoomControls.append("button")
				.attr("class", "zoom-btn")
				.style("width", "40px")
				.style("height", "40px")
				.style("background", "rgba(10, 10, 10, 0.8)")
				.style("border", "1px solid rgba(212, 175, 55, 0.5)")
				.style("border-radius", "5px")
				.style("color", "#d4af37")
				.style("font-size", "20px")
				.style("cursor", "pointer")
				.text("+")
				.on("click", () => {
					svg.transition().duration(500).call(zoom.scaleBy, 1.5);
				});

			zoomControls.append("button")
				.attr("class", "zoom-btn")
				.style("width", "40px")
				.style("height", "40px")
				.style("background", "rgba(10, 10, 10, 0.8)")
				.style("border", "1px solid rgba(212, 175, 55, 0.5)")
				.style("border-radius", "5px")
				.style("color", "#d4af37")
				.style("font-size", "20px")
				.style("cursor", "pointer")
				.text("−")
				.on("click", () => {
					svg.transition().duration(500).call(zoom.scaleBy, 0.67);
				});

			zoomControls.append("button")
				.attr("class", "zoom-btn")
				.style("width", "40px")
				.style("height", "40px")
				.style("background", "rgba(10, 10, 10, 0.8)")
				.style("border", "1px solid rgba(212, 175, 55, 0.5)")
				.style("border-radius", "5px")
				.style("color", "#d4af37")
				.style("font-size", "14px")
				.style("cursor", "pointer")
				.text("⟲")
				.on("click", () => {
					svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
				});

			// 5. Setup projection and path
			const projection = d3.geoMercator()
				.scale(180)
				.translate([width / 2, height / 1.5]);

			const path = d3.geoPath().projection(projection);

			// 6. Brand colors
			const brandColors = {
				'Hermès': '#8B2635',  // Burgundy
				'Gucci': '#d4af37',   // Gold
				'Coach': '#8b4513'    // Brown
			};

			// 7. Draw countries
			console.log("🎨 Drawing map...");
			const countryPaths = g.selectAll(".country")
				.data(countries.features)
				.join("path")
				.attr("class", "country")
				.attr("d", path)
				.attr("fill", d => {
					const countryData = countryMap.get(d.properties.name);
					return countryData ? brandColors[countryData.dominant] : "#3a3a3a";
				})
				.attr("opacity", 0)
				.attr("stroke", d => {
					const countryData = countryMap.get(d.properties.name);
					return countryData ? "#0a0a0a" : "#5a5a5a";
				})
				.attr("stroke-width", 0.8)
				.on("mouseover", function(event, d) {
					const countryData = countryMap.get(d.properties.name);
					if (!countryData) return;

					d3.select(this)
						.attr("stroke", "#d4af37")
						.attr("stroke-width", 1)
						.raise();

					const dominantBrand = countryData.dominant;
					tooltip.style("opacity", 1)
						.html(`
							<strong>${d.properties.name}</strong>
							<div style="margin-top: 12px; font-size: 15px;">
								<div style="margin: 6px 0; padding: 4px 0;">
									<span style="color: #cd9a6a; font-weight: 500;">●</span>
									<span style="color: #ffffff;">Coach:</span>
									<span style="color: #ffd700; font-weight: 600;">${countryData.coach.toFixed(1)}%</span>
								</div>
								<div style="margin: 6px 0; padding: 4px 0;">
									<span style="color: #d4af37; font-weight: 500;">●</span>
									<span style="color: #ffffff;">Gucci:</span>
									<span style="color: #ffd700; font-weight: 600;">${countryData.gucci.toFixed(1)}%</span>
								</div>
								<div style="margin: 6px 0; padding: 4px 0;">
									<span style="color: #ff8c94; font-weight: 500;">●</span>
									<span style="color: #ffffff;">Hermès:</span>
									<span style="color: #ffd700; font-weight: 600;">${countryData.hermes.toFixed(1)}%</span>
								</div>
							</div>
							<div style="margin-top: 14px; padding-top: 12px; border-top: 2px solid rgba(212,175,55,0.5); text-align: center;">
								<span style="color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">Dominant Brand</span><br>
								<span style="color: #ffffff; font-size: 20px; font-weight: 600; text-shadow: 0 0 10px ${brandColors[dominantBrand]};">${dominantBrand}</span>
							</div>
						`)
						.style("left", (event.pageX + 15) + "px")
						.style("top", (event.pageY - 28) + "px");
				})
			.on("mouseout", function() {
				d3.select(this)
					.attr("stroke", d => {
						const countryData = countryMap.get(d.properties.name);
						return countryData ? "#0a0a0a" : "#5a5a5a";
					})
					.attr("stroke-width", 0.8);
				tooltip.style("opacity", 0);
			});

		// 8. Animate countries
		countryPaths.transition()
			.duration(1000)
			.delay((d, i) => i * 3)
			.attr("opacity", d => {
				const countryData = countryMap.get(d.properties.name);
				if (!countryData) return 0.5;
				return 0.3 + (countryData.total / 100) * 0.7;
			});			// 9. Parse and visualize traffic data
			console.log("📊 Loading traffic data...");
			
			// Parse traffic data - skip header rows
			const topTraffic = trafficData
				.filter(d => d[''] && d['Traffic share (%)'] && !d[''].includes('Top countries'))
				.slice(0, 10)
				.map(d => ({
					Country: d[''],
					TrafficShare: parseFloat(d['Traffic share (%)']) || 0,
					TrafficGrowth: parseFloat(d['Traffic growth YoY (%)*']) || 0,
					TotalVisits: d['Total visits'] || 'N/A'
				}));

			console.log("✓ Loaded traffic data for", topTraffic.length, "countries");

			// Country coordinates for traffic circles
			const coordinates = {
				'United States': [-95.7129, 37.0902],
				'India': [78.9629, 20.5937],
				'Japan': [138.2529, 36.2048],
				'United Kingdom': [-3.4359, 55.3781],
				'Russia': [105.3188, 61.5240],
				'Turkey': [35.2433, 38.9637],
				'Germany': [10.4515, 51.1657],
				'France': [2.2137, 46.6034],
				'Vietnam': [108.2772, 14.0583],
				'Poland': [19.1451, 51.9194]
			};

			// Add traffic circles
			const radiusScale = d3.scaleSqrt()
				.domain([0, 20])
				.range([8, 30]);

			const trafficCircles = g.selectAll(".traffic-circle")
				.data(topTraffic.filter(d => coordinates[d.Country]))
				.join("g")
				.attr("class", "traffic-circle-group")
				.attr("transform", d => {
					const coords = coordinates[d.Country];
					const [x, y] = projection(coords);
					return `translate(${x}, ${y})`;
				});

			// Outer pulse circle
			trafficCircles.append("circle")
				.attr("class", "traffic-pulse")
				.attr("r", 0)
				.attr("fill", "none")
				.attr("stroke", "#ffd700")
				.attr("stroke-width", 2)
				.attr("opacity", 0.8)
				.transition()
				.duration(2000)
				.delay((d, i) => i * 100)
				.attr("r", d => radiusScale(d.TrafficShare) * 1.5)
				.attr("opacity", 0);

			// Main circle
			trafficCircles.append("circle")
				.attr("class", "traffic-circle")
				.attr("r", 0)
				.attr("fill", "#ffd700")
				.attr("stroke", "#d4af37")
				.attr("stroke-width", 2)
				.attr("opacity", 0.7)
				.style("cursor", "pointer")
				.transition()
				.duration(1000)
				.delay((d, i) => i * 100)
				.attr("r", d => radiusScale(d.TrafficShare));

			// Add click handlers for traffic circles
			trafficCircles.on("click", function(event, d) {
				event.stopPropagation();
				
				// Find the country feature
				const countryFeature = countries.features.find(f => 
					f.properties.name === d.Country || 
					(d.Country === 'United States' && f.properties.name === 'United States of America')
				);
				
				if (countryFeature) {
					const bounds = path.bounds(countryFeature);
					const dx = bounds[1][0] - bounds[0][0];
					const dy = bounds[1][1] - bounds[0][1];
					const x = (bounds[0][0] + bounds[1][0]) / 2;
					const y = (bounds[0][1] + bounds[1][1]) / 2;
					const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
					const translate = [width / 2 - scale * x, height / 2 - scale * y];

					svg.transition()
						.duration(750)
						.call(
							zoom.transform,
							d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
						);
				}
			})
			.on("mouseover", function(event, d) {
				d3.select(this).select(".traffic-circle")
					.transition()
					.duration(200)
					.attr("r", radiusScale(d.TrafficShare) * 1.2)
					.attr("opacity", 1);

				const countryData = countryMap.get(d.Country) || 
								   countryMap.get('United States of America');
				
				tooltip.style("opacity", 1)
					.html(`
						<div style="text-align: center; margin-bottom: 10px;">
							<strong style="font-size: 18px; color: #ffd700;">${d.Country}</strong>
							<div style="font-size: 12px; color: #d4af37; margin-top: 4px;">TOP TRAFFIC MARKET</div>
						</div>
						<div style="border-top: 2px solid rgba(212,175,55,0.3); padding-top: 10px; margin-top: 10px;">
							<div style="margin: 8px 0;">
								<span style="color: #999;">Traffic Share:</span>
								<span style="color: #ffd700; font-weight: 600; float: right;">${d.TrafficShare}%</span>
							</div>
							<div style="margin: 8px 0;">
								<span style="color: #999;">YoY Growth:</span>
								<span style="color: ${d.TrafficGrowth > 15 ? '#4ade80' : '#ffd700'}; font-weight: 600; float: right;">+${d.TrafficGrowth}%</span>
							</div>
							<div style="margin: 8px 0;">
								<span style="color: #999;">Total Visits:</span>
								<span style="color: #ffd700; font-weight: 600; float: right;">${d.TotalVisits}</span>
							</div>
						</div>
						${countryData ? `
							<div style="border-top: 2px solid rgba(212,175,55,0.3); padding-top: 10px; margin-top: 10px;">
								<div style="text-align: center; margin-bottom: 8px; color: #d4af37; font-size: 12px;">BRAND DOMINANCE</div>
								<div style="margin: 6px 0;">
									<span style="color: #cd9a6a;">●</span>
									<span style="color: #fff;">Coach:</span>
									<span style="color: #ffd700; font-weight: 600; float: right;">${countryData.coach.toFixed(1)}%</span>
								</div>
								<div style="margin: 6px 0;">
									<span style="color: #d4af37;">●</span>
									<span style="color: #fff;">Gucci:</span>
									<span style="color: #ffd700; font-weight: 600; float: right;">${countryData.gucci.toFixed(1)}%</span>
								</div>
								<div style="margin: 6px 0;">
									<span style="color: #ff8c94;">●</span>
									<span style="color: #fff;">Hermès:</span>
									<span style="color: #ffd700; font-weight: 600; float: right;">${countryData.hermes.toFixed(1)}%</span>
								</div>
							</div>
						` : ''}
						<div style="margin-top: 12px; text-align: center; font-size: 11px; color: #666;">
							Click to zoom to country
						</div>
					`)
					.style("left", (event.pageX + 15) + "px")
					.style("top", (event.pageY - 28) + "px");
			})
			.on("mouseout", function(event, d) {
				d3.select(this).select(".traffic-circle")
					.transition()
					.duration(200)
					.attr("r", radiusScale(d.TrafficShare))
					.attr("opacity", 0.7);
				tooltip.style("opacity", 0);
			});

			// Continuous pulse animation for traffic circles
			function pulseTrafficCircles() {
				trafficCircles.selectAll(".traffic-pulse")
					.attr("r", d => radiusScale(d.TrafficShare))
					.attr("opacity", 0.8)
					.transition()
					.duration(2000)
					.attr("r", d => radiusScale(d.TrafficShare) * 1.5)
					.attr("opacity", 0)
					.on("end", pulseTrafficCircles);
			}
			pulseTrafficCircles();

			// 10. Calculate statistics
			let countriesWithData = 0;
			let brandDominance = { 'Hermès': 0, 'Gucci': 0, 'Coach': 0 };

			countries.features.forEach(f => {
				const data = countryMap.get(f.properties.name);
				if (data) {
					countriesWithData++;
					brandDominance[data.dominant]++;
				}
			});

			// 11. Display statistics
			d3.select("#map-stats").html(`
				<span style="color: #d4af37;">Countries: ${countriesWithData}</span> |
				<span style="color: #8B2635;">Hermès: ${brandDominance['Hermès']}</span> |
				<span style="color: #d4af37;">Gucci: ${brandDominance['Gucci']}</span> |
				<span style="color: #8b4513;">Coach: ${brandDominance['Coach']}</span> |
				<span style="color: #ffd700;">⭐ Top Traffic Markets</span>
			`);

			// 12. Add legend - positioned to avoid map overlap
			const legend = g.append("g")
				.attr("class", "map-legend")
				.attr("transform", `translate(${width - 180}, 50)`); // Move to top-right

			const legendData = [
				{brand: 'Hermès', color: '#8B2635'},
				{brand: 'Gucci', color: '#d4af37'},
				{brand: 'Coach', color: '#8b4513'}
			];

			// Add background to legend for better visibility
			legend.append("rect")
				.attr("x", -10)
				.attr("y", -10)
				.attr("width", 170)
				.attr("height", 110)
				.attr("fill", "rgba(10, 10, 10, 0.85)")
				.attr("stroke", "rgba(212, 175, 55, 0.3)")
				.attr("stroke-width", 1)
				.attr("rx", 8);

			legend.selectAll(".legend-item")
				.data(legendData)
				.join("g")
				.attr("class", "legend-item")
				.attr("transform", (d, i) => `translate(0, ${i * 32})`)
				.each(function(d) {
					const g = d3.select(this);
					g.append("rect")
						.attr("width", 22)
						.attr("height", 22)
						.attr("fill", d.color)
						.attr("opacity", 0.8)
						.attr("rx", 3);
					g.append("text")
						.attr("x", 30)
						.attr("y", 16)
						.text(`${d.brand} Dominant`)
						.attr("fill", "#f5f5f5")
						.style("font-size", "13px")
						.style("font-weight", "300");
				});

			// 13. Add title at top-left to balance legend on right
			g.append("text")
				.attr("x", 30)
				.attr("y", 35)
				.attr("text-anchor", "start")
				.attr("fill", "#d4af37")
				.style("font-size", "22px")
				.style("font-weight", "300")
				.style("letter-spacing", "0.1em")
				.text("BRAND DOMINANCE MAP");

			// Brand filter buttons
			d3.selectAll('.brand-filter-btn').on('click', function() {
				const brand = this.dataset.brand;

				d3.selectAll('.brand-filter-btn').classed('active', false);
				d3.select(this).classed('active', true);

				countryPaths.transition()
					.duration(500)
					.attr("opacity", d => {
						const countryData = countryMap.get(d.properties.name);
						if (!countryData) return 0.5;

						if (brand === 'all') {
							return 0.3 + (countryData.total / 100) * 0.7;
						} else {
							return countryData.dominant === brand ?
								0.3 + (countryData.total / 100) * 0.7 : 0.15;
						}
					});
			});

			console.log("✅ Map visualization complete!");

		} catch (error) {
			console.error("❌ Error creating map:", error);

			container.select(".loading-indicator").remove();

			container.append("div")
				.attr("class", "error-message")
				.style("color", "#c41e3a")
				.style("background", "rgba(196, 30, 58, 0.1)")
				.style("padding", "30px")
				.style("border-radius", "10px")
				.style("border", "1px solid rgba(196, 30, 58, 0.3)")
				.style("text-align", "center")
				.html(`
					<div style="font-size: 1.2rem; margin-bottom: 10px;">⚠ Unable to load map</div>
					<div style="font-size: 0.9rem; color: #999;">
						Error: ${error.message}<br>
						Please check the console for details.
					</div>
				`);
		}
	}

	// Make function available globally
	window.createWorldMap = createWorldMap;
	console.log("✓ slide8_5.js loaded");
})();
