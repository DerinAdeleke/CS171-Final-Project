(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-6">
			<div class="slide-content">
				<h2 class="section-title">Market Overview</h2>
				<p class="section-subtitle">Drag or click the timeline slider below to explore how revenue evolved across categories from 2012-2024</p>
				
				<div class="stats-grid" style="margin-bottom: 1.5vh;">
					<div class="stat-card">
						<div class="stat-number" id="total-revenue-stat">$42.6B</div>
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

				<div class="viz-container" style="margin-top: 1vh; max-height: none; overflow: visible; padding: 1.5vh 2vw;">
					<!-- Brand filter toggles -->
					<div style="text-align: center; margin-bottom: 1vh;">
						<button class="brand-toggle-btn active" data-brand="Hermès" style="
							background: linear-gradient(135deg, #8B2635 0%, #a83545 100%);
							border: 2px solid #8B2635;
							color: white;
							padding: 8px 20px;
							margin: 0 6px;
							border-radius: 20px;
							cursor: pointer;
							font-size: 13px;
							font-weight: 500;
							transition: all 0.3s;
							box-shadow: 0 3px 10px rgba(139, 38, 53, 0.3);
						">Hermès</button>
						<button class="brand-toggle-btn active" data-brand="Gucci" style="
							background: linear-gradient(135deg, #d4af37 0%, #f0c55d 100%);
							border: 2px solid #d4af37;
							color: #0a0a0a;
							padding: 8px 20px;
							margin: 0 6px;
							border-radius: 20px;
							cursor: pointer;
							font-size: 13px;
							font-weight: 500;
							transition: all 0.3s;
							box-shadow: 0 3px 10px rgba(212, 175, 55, 0.3);
						">Gucci</button>
						<button class="brand-toggle-btn active" data-brand="Coach" style="
							background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
							border: 2px solid #8b4513;
							color: white;
							padding: 8px 20px;
							margin: 0 6px;
							border-radius: 20px;
							cursor: pointer;
							font-size: 13px;
							font-weight: 500;
							transition: all 0.3s;
							box-shadow: 0 3px 10px rgba(139, 69, 19, 0.3);
						">Coach</button>
					</div>

					<div id="overview-chart"></div>

					<!-- Timeline scrubber -->
					<div style="margin-top: 1.5vh; padding: 0 4vw;">
						<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1vh;">
							<div style="color: #d4af37; font-size: 13px; font-weight: 500;">
								<span id="year-range-display">2012 - 2024</span>
							</div>
							<div style="display: flex; gap: 8px;">
								<button id="play-animation" style="
									background: linear-gradient(135deg, #d4af37 0%, #f0c55d 100%);
									border: none;
									color: #0a0a0a;
									padding: 6px 16px;
									border-radius: 16px;
									cursor: pointer;
									font-size: 12px;
									font-weight: 600;
									box-shadow: 0 3px 8px rgba(212, 175, 55, 0.3);
									transition: all 0.3s;
								">▶ Play Timeline</button>
								<button id="reset-timeline" style="
									background: rgba(255, 255, 255, 0.1);
									border: 1px solid rgba(212, 175, 55, 0.3);
									color: #d4af37;
									padding: 6px 16px;
									border-radius: 16px;
									cursor: pointer;
									font-size: 12px;
									font-weight: 500;
									transition: all 0.3s;
								">Reset</button>
							</div>
						</div>
						<div id="timeline-scrubber" style="
							position: relative;
							height: 50px;
							background: linear-gradient(to right, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.2));
							border-radius: 8px;
							border: 1px solid rgba(212, 175, 55, 0.3);
							cursor: pointer;
							overflow: visible;
						"></div>
					</div>
				</div>
			</div>
		</section>
	`);

	window.createOverviewChart = function() {
		const brandColors = window.brandColors;
		const revenueData = window.revenueData;
		const tooltip = d3.select(".tooltip");

		const margin = {top: 30, right: 100, bottom: 50, left: 70};
		const width = 1000 - margin.left - margin.right;
		const height = 320 - margin.top - margin.bottom;

		const svg = d3.select("#overview-chart")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.style("background", "transparent")
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const brands = ["Hermès", "Gucci", "Coach"];
		let activeBrands = new Set(brands);
		let yearRange = [2012, 2024];
		let animationInterval = null;

		// Scales - will be updated dynamically
		let x = d3.scaleLinear().domain([2012, 2024]).range([0, width]);
		let y = d3.scaleLinear().domain([0, 20000]).range([height, 0]);

		// Gradient definitions
		const defs = svg.append("defs");
		brands.forEach(brand => {
			const gradient = defs.append("linearGradient")
				.attr("id", `gradient-${brand.replace('è', 'e')}`)
				.attr("x1", "0%").attr("y1", "0%")
				.attr("x2", "0%").attr("y2", "100%");
			
			gradient.append("stop")
				.attr("offset", "0%")
				.attr("stop-color", brandColors[brand])
				.attr("stop-opacity", 0.4);
			
			gradient.append("stop")
				.attr("offset", "100%")
				.attr("stop-color", brandColors[brand])
				.attr("stop-opacity", 0.05);
		});

		// Grid
		svg.append("g")
			.attr("class", "grid")
			.attr("opacity", 0.15)
			.call(d3.axisLeft(y)
				.tickSize(-width)
				.tickFormat("")
			);

		// Area and line groups
		const areaGroup = svg.append("g").attr("class", "areas");
		const lineGroup = svg.append("g").attr("class", "lines");
		const dotGroup = svg.append("g").attr("class", "dots");

		// Line and area generators
		const line = d3.line()
			.x(d => x(d.Year))
			.y(d => y(d.value))
			.curve(d3.curveCardinal.tension(0.5));

		const area = d3.area()
			.x(d => x(d.Year))
			.y0(height)
			.y1(d => y(d.value))
			.curve(d3.curveCardinal.tension(0.5));

		// Function to update visualization
		function updateChart(animate = false, isTimelinePlay = false) {
			const filteredData = revenueData.filter(d => 
				d.Year >= yearRange[0] && d.Year <= yearRange[1]
			);

			// Update scales based on filtered data
			x.domain([yearRange[0], yearRange[1]]);
			
			// Calculate dynamic y domain based on visible data
			const maxValue = d3.max(filteredData, d => 
				Math.max(...Array.from(activeBrands).map(brand => d[brand]))
			) || 20000;
			y.domain([0, maxValue * 1.1]); // Add 10% padding

			// CONSISTENT ANIMATION TIMING
			const OPACITY_DURATION = animate ? 0 : (isTimelinePlay ? 800 : 300);
			const AXES_DURATION = animate ? 0 : (isTimelinePlay ? 800 : 400);

			// Update axes with smooth transition
			xAxis.transition()
				.duration(AXES_DURATION)
				.call(d3.axisBottom(x)
					.tickFormat(d3.format("d"))
					.ticks(Math.min(filteredData.length, 13))
				);

			yAxis.transition()
				.duration(AXES_DURATION)
				.call(d3.axisLeft(y)
					.tickFormat(d => `$${(d/1000).toFixed(1)}B`)
					.ticks(8)
				);

			// Update grid
			svg.select(".grid")
				.transition()
				.duration(AXES_DURATION)
				.call(d3.axisLeft(y)
					.tickSize(-width)
					.tickFormat("")
					.ticks(8)
				);

			brands.forEach((brand, i) => {
				const brandData = filteredData.map(d => ({
					Year: d.Year,
					value: d[brand]
				}));

				const isActive = activeBrands.has(brand);
				const opacity = isActive ? 1 : 0.1;

				// Area - animate during timeline play, update immediately otherwise
				const areaPath = areaGroup.selectAll(`.area-${i}`)
					.data([brandData]);

				const areaEnter = areaPath.enter()
					.append("path")
					.attr("class", `area-${i}`)
					.attr("d", area)
					.attr("fill", `url(#gradient-${brand.replace('è', 'e')})`)
					.attr("opacity", 0);

				const areaMerged = areaEnter.merge(areaPath);

				if (isTimelinePlay) {
					// Animate path change during timeline play
					areaMerged
						.transition()
						.duration(OPACITY_DURATION)
						.attr("d", area)
						.attr("opacity", opacity);
				} else if (animate) {
					// Initial load animation
					areaMerged
						.attr("d", area)
						.transition()
						.duration(1500)
						.delay(i * 200)
						.attr("opacity", opacity);
				} else {
					// Brand toggle - update immediately, animate opacity only
					areaMerged
						.attr("d", area)
						.transition()
						.duration(OPACITY_DURATION)
						.attr("opacity", opacity);
				}

				// Line - smooth transitions during timeline play
				const linePath = lineGroup.selectAll(`.line-${i}`)
					.data([brandData]);

				const lineEnter = linePath.enter()
					.append("path")
					.attr("class", `line-${i}`)
					.attr("fill", "none")
					.attr("stroke", brandColors[brand])
					.attr("stroke-width", 4)
					.attr("stroke-linecap", "round")
					.attr("filter", "drop-shadow(0 0 8px " + brandColors[brand] + ")");

				const lineUpdate = lineEnter.merge(linePath);

				if (animate) {
					// Initial load animation with drawing effect
					lineUpdate
						.attr("d", line)
						.attr("opacity", 0)
						.transition()
						.duration(300)
						.attr("opacity", opacity)
						.transition()
						.duration(1500)
						.delay(i * 200)
						.attrTween("stroke-dasharray", function() {
							const length = this.getTotalLength();
							return d3.interpolate(`0,${length}`, `${length},${length}`);
						});
				} else if (isTimelinePlay) {
					// Smooth path morphing during timeline play
					lineUpdate
						.transition()
						.duration(OPACITY_DURATION)
						.ease(d3.easeCubicInOut) // Match dot easing
						.attr("d", line)
						.attr("opacity", opacity);
				} else {
					// Immediate update for brand toggle
					lineUpdate
						.attr("d", line)
						.transition()
						.duration(OPACITY_DURATION)
						.attr("opacity", opacity);
				}

				// Dots - SMOOTH transitions during timeline play
				const dots = dotGroup.selectAll(`.dots-${i}`)
					.data(brandData, d => d.Year);

				// Remove old dots with fade
				dots.exit()
					.transition()
					.duration(isTimelinePlay ? 400 : 150) // Longer fade for timeline
					.attr("r", 0)
					.attr("opacity", 0)
					.remove();

				// Add new dots
				const dotsEnter = dots.enter()
					.append("circle")
					.attr("class", `dots-${i}`)
					.attr("r", 0)
					.attr("fill", brandColors[brand])
					.attr("stroke", "#0a0a0a")
					.attr("stroke-width", 2)
					.style("cursor", "pointer")
					.attr("filter", "drop-shadow(0 0 6px " + brandColors[brand] + ")")
					.attr("cx", d => x(d.Year))
					.attr("cy", d => y(d.value))
					.attr("opacity", 0);

				// Merge and update ALL dots
				const allDots = dotsEnter.merge(dots);

				// Update positions with smooth transition during timeline play
				if (isTimelinePlay) {
					allDots
						.transition()
						.duration(OPACITY_DURATION)
						.ease(d3.easeCubicInOut) // Smooth easing
						.attr("cx", d => x(d.Year))
						.attr("cy", d => y(d.value))
						.attr("r", isActive ? 6 : 2)
						.attr("opacity", opacity);
				} else {
					// Immediate position update for brand toggle
					allDots
						.attr("cx", d => x(d.Year))
						.attr("cy", d => y(d.value));
					
					// Then animate radius and opacity
					allDots
						.transition()
						.duration(animate ? 600 : OPACITY_DURATION)
						.delay(animate ? (d, j) => i * 200 + j * 80 + 1500 : 0)
						.attr("r", isActive ? 6 : 2)
						.attr("opacity", opacity);
				}

				// Mouse events
				allDots
					.on("mouseover", function(event, d) {
						if (!isActive) return;
						d3.select(this)
							.transition().duration(200)
							.attr("r", 10)
							.attr("stroke-width", 3);
						
						tooltip.style("opacity", 1)
							.html(`
								<div style="text-align: center;">
									<strong style="color: ${brandColors[brand]}; font-size: 16px;">${brand}</strong>
									<div style="margin: 8px 0; padding: 8px 0; border-top: 1px solid rgba(255,255,255,0.2);">
										<div style="color: #999; font-size: 12px;">Year</div>
										<div style="color: #fff; font-size: 18px; font-weight: 600;">${d.Year}</div>
									</div>
									<div style="padding: 8px 0; border-top: 1px solid rgba(255,255,255,0.2);">
										<div style="color: #999; font-size: 12px;">Revenue</div>
										<div style="color: #d4af37; font-size: 20px; font-weight: 700;">$${d.value.toLocaleString()}M</div>
									</div>
								</div>
							`)
							.style("left", (event.pageX + 15) + "px")
							.style("top", (event.pageY - 28) + "px");
					})
					.on("mouseout", function() {
						d3.select(this)
							.transition().duration(200)
							.attr("r", 6)
							.attr("stroke-width", 2);
						tooltip.style("opacity", 0);
					});
			});

			// Update stat
			const latestYear = filteredData[filteredData.length - 1];
			if (latestYear) {
				const total = (latestYear.Hermès + latestYear.Gucci + latestYear.Coach) / 1000;
				d3.select("#total-revenue-stat")
					.transition()
					.duration(AXES_DURATION)
					.tween("text", function() {
						const currentVal = parseFloat(this.textContent.replace(/[$B]/g, '')) || total;
						const interpolator = d3.interpolate(currentVal, total);
						return function(t) {
							this.textContent = `$${interpolator(t).toFixed(1)}B`;
						};
					});
			}
		}

		// Axes
		const xAxis = svg.append("g")
			.attr("class", "axis")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(x)
				.tickFormat(d3.format("d"))
				.ticks(13)
			)
			.style("font-size", "12px")
			.style("color", "#b8b8b8");

		const yAxis = svg.append("g")
			.attr("class", "axis")
			.call(d3.axisLeft(y)
				.tickFormat(d => `$${d/1000}B`)
				.ticks(8)
			)
			.style("font-size", "12px")
			.style("color", "#b8b8b8");

		// Axis labels
		svg.append("text")
			.attr("x", width / 2)
			.attr("y", height + 40)
			.attr("text-anchor", "middle")
			.style("fill", "#d4af37")
			.style("font-size", "12px")
			.style("font-weight", "500")
			.text("Year");

		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -height / 2)
			.attr("y", -50)
			.attr("text-anchor", "middle")
			.style("fill", "#d4af37")
			.style("font-size", "12px")
			.style("font-weight", "500")
			.text("Revenue (Billions USD)");

		// Brand toggle buttons
		d3.selectAll(".brand-toggle-btn").on("click", function() {
			const brand = this.dataset.brand;
			
			const FADE_DURATION = 300; // Consistent fade time
			
			if (activeBrands.has(brand)) {
				// CRITICAL: Prevent removing the last brand
				if (activeBrands.size === 1) {
					console.log("Cannot remove last active brand");
					return; // Do nothing if only one brand is active
				}
				
				// Removing a brand
				activeBrands.delete(brand);
				this.style.opacity = "0.3";
				this.style.filter = "grayscale(100%)";
				
				// First: animate brand removal (opacity to 0)
				updateChartRemoveBrand(brand, FADE_DURATION);
				
				// Then: after animation completes, update scales and remaining brands
				setTimeout(() => {
					updateChart(false);
					updateLegend();
				}, FADE_DURATION + 50); // Wait for fade-out + buffer
				
			} else {
				// Adding a brand
				activeBrands.add(brand);
				this.style.opacity = "1";
				this.style.filter = "grayscale(0%)";
				
				// Update scales first, then animate brand appearance
				updateChart(false);
				updateLegend();
			}
		});

		function updateLegend() {
			brands.forEach((brand, i) => {
				const isActive = activeBrands.has(brand);
				
				// CRITICAL: Prevent the last active brand from being clicked
				const legendRow = legend.select(`g:nth-child(${i + 1})`);
				if (activeBrands.size === 1 && isActive) {
					legendRow.style("cursor", "not-allowed")
						.style("opacity", "0.8");
				} else {
					legendRow.style("cursor", "pointer")
						.style("opacity", "1");
				}
				
				legend.select(`.legend-rect-${i}`)
					.transition()
					.duration(200)
					.attr("opacity", isActive ? 1 : 0.3);
				legend.select(`.legend-text-${i}`)
					.transition()
					.duration(200)
					.style("fill", isActive ? "#f5f5f5" : "#666");
			});
		}

		// Legend
		const legend = svg.append("g")
			.attr("transform", `translate(${width + 15}, 10)`);

		brands.forEach((brand, i) => {
			const legendRow = legend.append("g")
				.attr("transform", `translate(0, ${i * 30})`)
				.style("cursor", "pointer")
				.on("click", function() {
					// CRITICAL: Prevent removing the last brand
					if (activeBrands.has(brand) && activeBrands.size === 1) {
						console.log("Cannot remove last active brand from legend");
						return;
					}
					
					if (activeBrands.has(brand)) {
						activeBrands.delete(brand);
					} else {
						activeBrands.add(brand);
					}
					updateChart(false);
					updateLegend();
				});

			legendRow.append("rect")
				.attr("class", `legend-rect-${i}`)
				.attr("width", 30)
				.attr("height", 5)
				.attr("rx", 2)
				.attr("fill", brandColors[brand])
				.attr("filter", "drop-shadow(0 0 3px " + brandColors[brand] + ")");

			legendRow.append("text")
				.attr("class", `legend-text-${i}`)
				.attr("x", 38)
				.attr("y", 6)
				.style("font-size", "12px")
				.style("fill", "#f5f5f5")
				.style("font-weight", "500")
				.text(brand);
		});

		// Timeline scrubber
		const scrubberContainer = d3.select("#timeline-scrubber");
		const scrubberWidth = scrubberContainer.node().offsetWidth;
		const scrubberScale = d3.scaleLinear()
			.domain([2012, 2024])
			.range([10, scrubberWidth - 10]);

		const scrubberSvg = scrubberContainer.append("svg")
			.attr("width", "100%")
			.attr("height", 50)
			.style("position", "absolute")
			.style("top", 0)
			.style("left", 0);

		// Year markers
		revenueData.forEach(d => {
			scrubberSvg.append("line")
				.attr("x1", scrubberScale(d.Year))
				.attr("x2", scrubberScale(d.Year))
				.attr("y1", 12)
				.attr("y2", 20)
				.attr("stroke", "rgba(212, 175, 55, 0.4)")
				.attr("stroke-width", 1);

			scrubberSvg.append("text")
				.attr("x", scrubberScale(d.Year))
				.attr("y", 35)
				.attr("text-anchor", "middle")
				.style("fill", "#999")
				.style("font-size", "9px")
				.text(d.Year);
		});

		// Clickable background track for easy positioning
		const trackBackground = scrubberSvg.append("rect")
			.attr("x", 10)
			.attr("y", 6)
			.attr("width", scrubberWidth - 20)
			.attr("height", 20)
			.attr("fill", "transparent")
			.style("cursor", "pointer")
			.on("click", function(event) {
				const [mouseX] = d3.pointer(event);
				const clickedYear = Math.round(scrubberScale.invert(mouseX));
				
				// Determine which handle is closer
				const dist1 = Math.abs(clickedYear - yearRange[0]);
				const dist2 = Math.abs(clickedYear - yearRange[1]);
				
				if (dist1 < dist2) {
					// Move start handle
					const clampedYear = Math.max(2012, Math.min(clickedYear, yearRange[1]));
					yearRange[0] = clampedYear;
					handle1.transition().duration(200).attr("cx", scrubberScale(clampedYear));
				} else {
					// Move end handle
					const clampedYear = Math.min(2024, Math.max(clickedYear, yearRange[0]));
					yearRange[1] = clampedYear;
					handle2.transition().duration(200).attr("cx", scrubberScale(clampedYear));
				}
				
				updateRangeBar();
				updateChart(false);
				d3.select("#year-range-display").text(`${yearRange[0]} - ${yearRange[1]}`);
			});

		// Range selector
		let handle1 = scrubberSvg.append("circle")
			.attr("cx", scrubberScale(2012))
			.attr("cy", 16)
			.attr("r", 8)
			.attr("fill", "#d4af37")
			.attr("stroke", "#0a0a0a")
			.attr("stroke-width", 2)
			.style("cursor", "ew-resize")
			.call(d3.drag()
				.on("start", function() {
					d3.select(this)
						.attr("r", 10)
						.attr("fill", "#f5d88a");
				})
				.on("drag", function(event) {
					const newYear = Math.round(scrubberScale.invert(event.x));
					const clampedYear = Math.max(2012, Math.min(newYear, yearRange[1]));
					yearRange[0] = clampedYear;
					d3.select(this).attr("cx", scrubberScale(clampedYear));
					updateRangeBar();
					updateChart(false);
					d3.select("#year-range-display").text(`${yearRange[0]} - ${yearRange[1]}`);
				})
				.on("end", function() {
					d3.select(this)
						.transition()
						.duration(150)
						.attr("r", 8)
						.attr("fill", "#d4af37");
				})
			)
			.on("click", function(event) {
				event.stopPropagation(); // Prevent track click
			});

		let handle2 = scrubberSvg.append("circle")
			.attr("cx", scrubberScale(2024))
			.attr("cy", 16)
			.attr("r", 8)
			.attr("fill", "#d4af37")
			.attr("stroke", "#0a0a0a")
			.attr("stroke-width", 2)
			.style("cursor", "ew-resize")
			.call(d3.drag()
				.on("start", function() {
					d3.select(this)
						.attr("r", 10)
						.attr("fill", "#f5d88a");
				})
				.on("drag", function(event) {
					const newYear = Math.round(scrubberScale.invert(event.x));
					const clampedYear = Math.min(2024, Math.max(newYear, yearRange[0]));
					yearRange[1] = clampedYear;
					d3.select(this).attr("cx", scrubberScale(clampedYear));
					updateRangeBar();
					updateChart(false);
					d3.select("#year-range-display").text(`${yearRange[0]} - ${yearRange[1]}`);
				})
				.on("end", function() {
					d3.select(this)
						.transition()
						.duration(150)
						.attr("r", 8)
						.attr("fill", "#d4af37");
				})
			)
			.on("click", function(event) {
				event.stopPropagation(); // Prevent track click
			});

		let rangeBar = scrubberSvg.append("rect")
			.attr("class", "range-bar")
			.attr("x", scrubberScale(2012))
			.attr("y", 13)
			.attr("width", scrubberScale(2024) - scrubberScale(2012))
			.attr("height", 6)
			.attr("fill", "#d4af37")
			.attr("opacity", 0.5)
			.attr("rx", 3);

		function updateRangeBar() {
			rangeBar
				.attr("x", scrubberScale(yearRange[0]))
				.attr("width", scrubberScale(yearRange[1]) - scrubberScale(yearRange[0]));
		}

		// Play animation
		d3.select("#play-animation").on("click", function() {
			if (animationInterval) {
				clearInterval(animationInterval);
				animationInterval = null;
				this.innerHTML = "▶ Play Timeline";
				return;
			}

			this.innerHTML = "⏸ Pause";
			
			// Store the target ending year when animation starts
			const targetEndYear = yearRange[1];
			let currentYear = yearRange[0];
			
			animationInterval = setInterval(() => {
				// Stop if we've reached the user-selected ending year OR absolute max (2024)
				if (currentYear >= targetEndYear || currentYear >= 2024) {
					clearInterval(animationInterval);
					animationInterval = null;
					d3.select("#play-animation").html("▶ Play Timeline");
					return;
				}

				currentYear++;
				yearRange[1] = currentYear;
				
				handle2.transition()
					.duration(600) // Increased from 400ms to 600ms
					.attr("cx", scrubberScale(currentYear));
				
				updateRangeBar();
				updateChart(false, true); // Pass isTimelinePlay = true
				d3.select("#year-range-display").text(`${yearRange[0]} - ${yearRange[1]}`);
			}, 800); 
		});

		// Reset timeline
		d3.select("#reset-timeline").on("click", function() {
			// CRITICAL: Stop animation FIRST before resetting state
			if (animationInterval) {
				clearInterval(animationInterval);
				animationInterval = null;
				d3.select("#play-animation").html("▶ Play Timeline");
			}

			// Reset year range
			yearRange = [2012, 2024];
			activeBrands = new Set(brands);
			
			// Reset ALL brand buttons to active state
			d3.selectAll(".brand-toggle-btn")
				.style("opacity", "1")
				.style("filter", "grayscale(0%)");
			
			// Stop any ongoing transitions before starting new ones
			handle1.interrupt();
			handle2.interrupt();
			rangeBar.interrupt();
			
			// Move handles back to start/end positions
			handle1.transition().duration(500).attr("cx", scrubberScale(2012));
			handle2.transition().duration(500).attr("cx", scrubberScale(2024));
			
			// Update range bar
			rangeBar.transition().duration(500)
				.attr("x", scrubberScale(2012))
				.attr("width", scrubberScale(2024) - scrubberScale(2012));
			
			// Update chart AFTER transitions complete
			setTimeout(() => {
				updateChart(false);
				updateLegend();
			}, 550);
			
			d3.select("#year-range-display").text("2012 - 2024");
		});

		// Brand toggle buttons — fixed (prevents misalignment of dots & lines)
		d3.selectAll(".brand-toggle-btn").on("click", async function () {
			const brand = this.dataset.brand;
			const FADE_DURATION = 300;

			// Prevent hiding last remaining brand
			if (activeBrands.has(brand) && activeBrands.size === 1) return;

			// Toggle button UI state
			if (activeBrands.has(brand)) {
				activeBrands.delete(brand);
				this.style.opacity = "0.3";
				this.style.filter = "grayscale(100%)";

				// 1️⃣ Fade removed brand ONLY — NO scale updates yet
				await fadeOutBrand(brand, FADE_DURATION);

				// 2️⃣ After fade completes → recompute scales & redraw everything
				updateChart(false);
				updateLegend();
			} 
			else {
				activeBrands.add(brand);
				this.style.opacity = "1";
				this.style.filter = "grayscale(0%)";

				// New brand showing — scale update first, then fade-in happens inside updateChart
				updateChart(false);
				updateLegend();
			}
		});

		// Fade a brand out and return a Promise that resolves after transitions finish
		function fadeOutBrand(brandToRemove, duration) {
			const brandIndex = brands.indexOf(brandToRemove);

			const t1 = areaGroup.selectAll(`.area-${brandIndex}`)
				.transition().duration(duration).attr("opacity", 0).end();

			const t2 = lineGroup.selectAll(`.line-${brandIndex}`)
				.transition().duration(duration).attr("opacity", 0).end();

			const t3 = dotGroup.selectAll(`.dots-${brandIndex}`)
				.transition().duration(duration).attr("opacity", 0).end();

			return Promise.all([t1, t2, t3]);  // 👈 ensures updateChart waits
		}


		// New function: animate brand removal without changing scales
		function updateChartRemoveBrand(brandToRemove, duration) {
			const brandIndex = brands.indexOf(brandToRemove);
			
			// Fade out area
			areaGroup.selectAll(`.area-${brandIndex}`)
				.transition()
				.duration(duration)
				.attr("opacity", 0);
			
			// Fade out line
			lineGroup.selectAll(`.line-${brandIndex}`)
				.transition()
				.duration(duration)
				.attr("opacity", 0);
			
			// Fade out dots
			dotGroup.selectAll(`.dots-${brandIndex}`)
				.transition()
				.duration(duration)
				.attr("opacity", 0);
		}

		// Initial render with animation
		updateChart(true);
	};
})();
