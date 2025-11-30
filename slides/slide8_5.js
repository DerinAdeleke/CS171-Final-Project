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
				</div>
			</div>
		</section>
	`);

	window.createWorldMap = async function() {
		const tooltip = d3.select(".tooltip");
		const width = 1200;
		const height = 650;

		console.log("Creating world map...");

		try {
			// Load TopoJSON world map
			const world = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
			console.log("World data loaded:", world);
			const countries = topojson.feature(world, world.objects.countries);
			console.log("Countries features:", countries.features.length);

			// Parse geographic data
			const geoDataRaw = await d3.csv("data/geoMap (3).csv");
			const trafficData = await d3.csv("data/topcountriestraffic.csv");

			console.log("Raw geo data loaded:", geoDataRaw.length);
			console.log("First row:", geoDataRaw[0]);

			// Filter out header rows - the CSV has "Category: Shopping" as first row
			const geoData = geoDataRaw.filter(d => 
				d.Country && 
				d.Country !== 'Category: Shopping' &&
				d.Country !== 'Country'
			);

			console.log("Filtered geo data:", geoData.length);

			// Country name mapping (CSV name -> TopoJSON name)
			const countryNameMap = {
				'United States': 'United States of America',
				'United Kingdom': 'United Kingdom',
				'Russia': 'Russia',
				'Vietnam': 'Vietnam',
				'South Korea': 'South Korea',
				'Taiwan': 'Taiwan',
				'Hong Kong': 'Hong Kong S.A.R.',
				'China': 'China',
				'Czechia': 'Czech Republic',
				'Tanzania': 'United Republic of Tanzania'
			};

			// Create country lookup
			const countryMap = new Map();
			geoData.forEach(d => {
				const coachStr = d['Coach: (11/16/20 - 11/16/25)'];
				const gucciStr = d['Gucci: (11/16/20 - 11/16/25)'];
				const hermesStr = d['Hermès: (11/16/20 - 11/16/25)'];
				
				// Skip if no data
				if (!coachStr && !gucciStr && !hermesStr) return;
				
				// Parse percentages (remove % sign)
				const coachVal = coachStr ? parseFloat(coachStr.replace('%', '')) : 0;
				const gucciVal = gucciStr ? parseFloat(gucciStr.replace('%', '')) : 0;
				const hermesVal = hermesStr ? parseFloat(hermesStr.replace('%', '')) : 0;
				const total = coachVal + gucciVal + hermesVal;

				if (total > 0) {
					const dominant = gucciVal > coachVal && gucciVal > hermesVal ? 'Gucci' :
									 hermesVal > coachVal ? 'Hermès' : 'Coach';

					// Use mapped name if available, otherwise use original
					const mappedName = countryNameMap[d.Country] || d.Country;
					
					const countryInfo = {
						coach: coachVal,
						gucci: gucciVal,
						hermes: hermesVal,
						dominant: dominant,
						total: total
					};
					
					// Store with mapped name
					countryMap.set(mappedName, countryInfo);
					// Also store with original name for fallback
					if (mappedName !== d.Country) {
						countryMap.set(d.Country, countryInfo);
					}
				}
			});

			console.log("Country map size:", countryMap.size);
			console.log("Sample countries from CSV:", Array.from(countryMap.keys()).slice(0, 10));
			console.log("Sample TopoJSON country names:", countries.features.slice(0, 10).map(d => d.properties.name));

			const svg = d3.select("#world-map-viz")
				.append("svg")
				.attr("width", width)
				.attr("height", height);

			console.log("SVG created, element:", svg.node());

			// Create projection - use mercator for familiar view
			const projection = d3.geoMercator()
				.scale(180)
				.translate([width / 2, height / 1.5]);

			const path = d3.geoPath().projection(projection);

			// Color scales for each brand
			const brandColors = {
				'Hermès': '#d4af37',
				'Gucci': '#c41e3a',
				'Coach': '#8b4513'
			};

			// Draw countries
			const countryPaths = svg.selectAll(".country")
				.data(countries.features)
				.join("path")
				.attr("class", "country")
				.attr("d", path)
				.attr("fill", d => {
					const countryData = countryMap.get(d.properties.name);
					if (!countryData) return "#2a2a2a"; // No data
					return brandColors[countryData.dominant];
				})
				.attr("opacity", d => {
					const countryData = countryMap.get(d.properties.name);
					if (!countryData) return 0.2;
					// Opacity based on total market share
					return 0.3 + (countryData.total / 100) * 0.7; // Scale 0.3 to 1.0
				})
				.attr("stroke", "#0a0a0a")
				.attr("stroke-width", 0.5)
				.on("mouseover", function(event, d) {
					const countryData = countryMap.get(d.properties.name);
					if (!countryData) return;

					d3.select(this)
						.attr("stroke", "#d4af37")
						.attr("stroke-width", 2)
						.raise(); // Bring to front

					// Tooltip with breakdown
					tooltip.style("opacity", 1)
						.html(`
							<strong>${d.properties.name}</strong><br/>
							<span style="color: #8b4513">Coach: ${countryData.coach.toFixed(0)}%</span><br/>
							<span style="color: #c41e3a">Gucci: ${countryData.gucci.toFixed(0)}%</span><br/>
							<span style="color: #d4af37">Hermès: ${countryData.hermes.toFixed(0)}%</span><br/>
							<br/><strong>Dominant: ${countryData.dominant}</strong>
						`)
						.style("left", (event.pageX + 15) + "px")
						.style("top", (event.pageY - 28) + "px");
				})
				.on("mouseout", function() {
					d3.select(this)
						.attr("stroke", "#0a0a0a")
						.attr("stroke-width", 0.5);
					tooltip.style("opacity", 0);
				});

			console.log("Countries drawn:", countryPaths.size());
			
			// Count how many countries have data
			let countriesWithData = 0;
			countries.features.forEach(f => {
				if (countryMap.get(f.properties.name)) countriesWithData++;
			});
			console.log("Countries with data:", countriesWithData);

			// Add traffic volume circles for top countries
			const radiusScale = d3.scaleSqrt()
				.domain([0, 20]) // Max traffic share is ~20%
				.range([5, 40]);

			// Country name to coordinates lookup
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

			// Parse traffic data - skip header rows and get actual data
			const topTraffic = trafficData
				.filter(d => d[''] && d['Traffic share (%)'] && !d[''].includes('Top countries'))
				.slice(0, 10)
				.map(d => ({
					Country: d[''],
					TrafficShare: parseFloat(d['Traffic share (%)']) || 0
				}));

			svg.selectAll(".traffic-circle")
				.data(topTraffic)
				.join("circle")
				.attr("class", "traffic-circle")
				.attr("cx", d => {
					const coords = coordinates[d.Country];
					return coords ? projection(coords)[0] : 0;
				})
				.attr("cy", d => {
					const coords = coordinates[d.Country];
					return coords ? projection(coords)[1] : 0;
				})
				.attr("r", 0)
				.attr("fill", "none")
				.attr("stroke", "#d4af37")
				.attr("stroke-width", 2)
				.attr("opacity", 0.6)
				.transition()
				.duration(1000)
				.delay((d, i) => i * 100)
				.attr("r", d => radiusScale(d.TrafficShare));

			// Add legend
			const legend = svg.append("g")
				.attr("class", "map-legend")
				.attr("transform", `translate(50, 50)`);

			const legendData = [
				{brand: 'Hermès', color: '#d4af37'},
				{brand: 'Gucci', color: '#c41e3a'},
				{brand: 'Coach', color: '#8b4513'}
			];

			legend.selectAll(".legend-item")
				.data(legendData)
				.join("g")
				.attr("class", "legend-item")
				.attr("transform", (d, i) => `translate(0, ${i * 30})`)
				.each(function(d) {
					const g = d3.select(this);
					g.append("rect")
						.attr("width", 25)
						.attr("height", 25)
						.attr("fill", d.color)
						.attr("opacity", 0.7);
					g.append("text")
						.attr("x", 35)
						.attr("y", 17)
						.text(`${d.brand} Dominant`)
						.attr("fill", "#f5f5f5")
						.style("font-size", "14px");
				});

			// Add title
			svg.append("text")
				.attr("x", width / 2)
				.attr("y", 30)
				.attr("text-anchor", "middle")
				.attr("fill", "#d4af37")
				.style("font-size", "24px")
				.style("font-weight", "300")
				.style("letter-spacing", "0.1em")
				.text("GLOBAL BRAND DOMINANCE");

			// Brand filter functionality
			let currentFilter = 'all';
			
			d3.selectAll('.brand-filter-btn').on('click', function() {
				const brand = this.dataset.brand;
				currentFilter = brand;

				// Update button states
				d3.selectAll('.brand-filter-btn').classed('active', false);
				d3.select(this).classed('active', true);

				// Update country opacity
				countryPaths.transition()
					.duration(500)
					.attr("opacity", d => {
						const countryData = countryMap.get(d.properties.name);
						if (!countryData) return 0.2;

						if (brand === 'all') {
							return 0.3 + (countryData.total / 100) * 0.7;
						} else {
							// Show full opacity for dominant brand, dim others
							if (countryData.dominant === brand) {
								return 0.3 + (countryData.total / 100) * 0.7;
							} else {
								return 0.15;
							}
						}
					});
			});

		} catch (error) {
			console.error("Error creating world map:", error);
			d3.select("#world-map-viz")
				.append("div")
				.style("color", "#f5f5f5")
				.style("padding", "20px")
				.text("Error loading map data. Please check data files.");
		}
	};
})();
