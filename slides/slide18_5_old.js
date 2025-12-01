(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-17-5">
			<div class="slide-content">
				<h2 class="section-title">Build Your Luxury Closet</h2>
				<p class="section-subtitle">Curate a personalized investment portfolio</p>
				
				<div class="closet-builder-container">
					<div class="builder-controls">
						<div class="control-group budget-group">
							<label class="control-label">Your Budget</label>
							<div class="budget-display">$<span id="budget-value">3000</span></div>
							<input type="range" id="budget-slider" min="500" max="10000" step="100" value="3000">
							<div class="budget-range">
								<span>$500</span>
								<span>$10,000</span>
							</div>
						</div>
						
						<div class="control-group strategy-group">
							<label class="control-label">Your Investment Priorities</label>
							<div class="strategy-sliders">
								<div class="strategy-slider-row">
									<label class="slider-label">
										<span class="slider-icon">💰</span>
										<span class="slider-name">Value Retention</span>
										<span class="slider-value" id="retention-value">25</span>%
									</label>
									<input type="range" id="retention-slider" class="strategy-range" min="0" max="100" step="5" value="25">
								</div>
								<div class="strategy-slider-row">
									<label class="slider-label">
										<span class="slider-icon">🏆</span>
										<span class="slider-name">Heritage & Prestige</span>
										<span class="slider-value" id="heritage-value">25</span>%
									</label>
									<input type="range" id="heritage-slider" class="strategy-range" min="0" max="100" step="5" value="25">
								</div>
								<div class="strategy-slider-row">
									<label class="slider-label">
										<span class="slider-icon">✨</span>
										<span class="slider-name">Versatility</span>
										<span class="slider-value" id="versatility-value">25</span>%
									</label>
									<input type="range" id="versatility-slider" class="strategy-range" min="0" max="100" step="5" value="25">
								</div>
								<div class="strategy-slider-row">
									<label class="slider-label">
										<span class="slider-icon">💸</span>
										<span class="slider-name">Accessibility</span>
										<span class="slider-value" id="accessibility-value">25</span>%
									</label>
									<input type="range" id="accessibility-slider" class="strategy-range" min="0" max="100" step="5" value="25">
								</div>
							</div>
						</div>
					</div>
					
					<div class="visualization-area">
						<div id="radar-chart-container"></div>
						<div class="journey-label">
							<h3 id="journey-title">The Balanced Curator</h3>
							<p id="journey-description">You appreciate quality across all tiers, building a diverse portfolio.</p>
						</div>
					</div>
					
					<div class="recommendations-area">
						<h3 class="recommendations-title">Your Curated Closet</h3>
						<div id="product-recommendations"></div>
						<div class="portfolio-summary" id="portfolio-summary"></div>
					</div>
				</div>
			</div>
		</section>
	`);

	window.createClosetBuilder = function() {
		const brandColors = window.brandColors || {
			'Hermès': '#8B2635',
			'Gucci': '#d4af37',
			'Coach': '#8b4513'
		};

		// Product database from Vestiaire datasets - representative items with actual data
		const productDatabase = [
			// Coach - Accessible luxury
			{ brand: 'Coach', type: 'Leather handbag', category: 'Accessories', price: 89, condition: 'Very good', retention: 30, heritage: 50, versatility: 90, accessibility: 95 },
			{ brand: 'Coach', type: 'Canvas tote', category: 'Accessories', price: 125, condition: 'Excellent', retention: 35, heritage: 50, versatility: 95, accessibility: 90 },
			{ brand: 'Coach', type: 'Wool jumper', category: 'Apparel', price: 254, condition: 'Very good', retention: 25, heritage: 50, versatility: 80, accessibility: 75 },
			{ brand: 'Coach', type: 'Leather jacket', category: 'Apparel', price: 444, condition: 'Very good', retention: 40, heritage: 50, versatility: 75, accessibility: 60 },
			{ brand: 'Coach', type: 'Leather trainers', category: 'Shoes', price: 91, condition: 'Good', retention: 30, heritage: 50, versatility: 90, accessibility: 95 },
			{ brand: 'Coach', type: 'Trench coat', category: 'Apparel', price: 188, condition: 'Never worn', retention: 45, heritage: 55, versatility: 85, accessibility: 80 },
			
			// Gucci - Mid-tier luxury
			{ brand: 'Gucci', type: 'GG Marmont bag', category: 'Accessories', price: 895, condition: 'Excellent', retention: 70, heritage: 85, versatility: 90, accessibility: 40 },
			{ brand: 'Gucci', type: 'Leather belt', category: 'Accessories', price: 245, condition: 'Very good', retention: 65, heritage: 85, versatility: 95, accessibility: 70 },
			{ brand: 'Gucci', type: 'Silk dress', category: 'Apparel', price: 584, condition: 'Never worn', retention: 60, heritage: 85, versatility: 70, accessibility: 50 },
			{ brand: 'Gucci', type: 'Wool blazer', category: 'Apparel', price: 1252, condition: 'Never worn', retention: 65, heritage: 90, versatility: 80, accessibility: 30 },
			{ brand: 'Gucci', type: 'Ace sneakers', category: 'Shoes', price: 440, condition: 'Very good', retention: 70, heritage: 80, versatility: 95, accessibility: 55 },
			{ brand: 'Gucci', type: 'Loafers', category: 'Shoes', price: 353, condition: 'Very good', retention: 68, heritage: 85, versatility: 90, accessibility: 60 },
			{ brand: 'Gucci', type: 'Leather handbag', category: 'Accessories', price: 650, condition: 'Good', retention: 65, heritage: 85, versatility: 85, accessibility: 45 },
			
			// Hermès - Ultra luxury
			{ brand: 'Hermès', type: 'Birkin 30', category: 'Accessories', price: 8500, condition: 'Excellent', retention: 95, heritage: 100, versatility: 60, accessibility: 5 },
			{ brand: 'Hermès', type: 'Kelly bag', category: 'Accessories', price: 7200, condition: 'Very good', retention: 92, heritage: 100, versatility: 65, accessibility: 8 },
			{ brand: 'Hermès', type: 'Constance bag', category: 'Accessories', price: 4500, condition: 'Excellent', retention: 90, heritage: 100, versatility: 70, accessibility: 12 },
			{ brand: 'Hermès', type: 'Leather belt', category: 'Accessories', price: 450, condition: 'Very good', retention: 75, heritage: 100, versatility: 90, accessibility: 50 },
			{ brand: 'Hermès', type: 'Cashmere cardigan', category: 'Apparel', price: 767, condition: 'Very good', retention: 80, heritage: 100, versatility: 85, accessibility: 40 },
			{ brand: 'Hermès', type: 'Silk dress', category: 'Apparel', price: 1533, condition: 'Very good', retention: 85, heritage: 100, versatility: 60, accessibility: 20 },
			{ brand: 'Hermès', type: 'Silk scarf', category: 'Accessories', price: 280, condition: 'Excellent', retention: 70, heritage: 100, versatility: 95, accessibility: 65 },
			{ brand: 'Hermès', type: 'Leather sandals', category: 'Shoes', price: 440, condition: 'Never worn', retention: 75, heritage: 100, versatility: 75, accessibility: 50 },
			{ brand: 'Hermès', type: 'Oran sandals', category: 'Shoes', price: 385, condition: 'Very good', retention: 78, heritage: 100, versatility: 80, accessibility: 55 }
		];

		// Brand metrics for radar chart baseline
		const brandBaseMetrics = {
			'Coach': { retention: 35, heritage: 50, versatility: 85, accessibility: 90 },
			'Gucci': { retention: 65, heritage: 85, versatility: 95, accessibility: 70 },
			'Hermès': { retention: 90, heritage: 100, versatility: 60, accessibility: 25 }
		};

		const metrics = ['Value Retention', 'Heritage', 'Versatility', 'Accessibility'];
		let currentBudget = 3000;
		let currentWeights = { retention: 25, heritage: 25, versatility: 25, accessibility: 25 };


		// Recommendation engine - score products based on user preferences
		function scoreProduct(product, weights, budget) {
			// Price fit score (higher if within budget, penalty if over)
			const priceFit = product.price <= budget ? 100 : Math.max(0, 100 - ((product.price - budget) / budget * 100));
			
			// Weighted score based on user priorities
			const weightedScore = (
				(product.retention / 100) * weights.retention +
				(product.heritage / 100) * weights.heritage +
				(product.versatility / 100) * weights.versatility +
				(product.accessibility / 100) * weights.accessibility
			) / 100;
			
			// Combined score
			return (weightedScore * 0.7) + (priceFit * 0.3);
		}

		function recommendProducts(budget, weights) {
			// Score all products
			const scoredProducts = productDatabase.map(product => ({
				...product,
				score: scoreProduct(product, weights, budget)
			}));
			
			// Sort by score
			scoredProducts.sort((a, b) => b.score - a.score);
			
			// Greedy knapsack: select products that fit budget
			const selected = [];
			let remaining = budget;
			
			for (const product of scoredProducts) {
				if (product.price <= remaining && selected.length < 5) {
					selected.push(product);
					remaining -= product.price;
				}
			}
			
			// Ensure at least 3 items (even if over budget slightly)
			while (selected.length < 3 && scoredProducts.length > selected.length) {
				const nextBest = scoredProducts.find(p => !selected.includes(p));
				if (nextBest) selected.push(nextBest);
			}
			
			return selected.slice(0, 5); // Max 5 items
		}

		// Calculate closet profile from selected products
		function calculateClosetProfile(products) {
			if (products.length === 0) return brandBaseMetrics['Gucci'];
			
			const avgMetrics = {
				retention: 0,
				heritage: 0,
				versatility: 0,
				accessibility: 0
			};
			
			products.forEach(p => {
				avgMetrics.retention += p.retention;
				avgMetrics.heritage += p.heritage;
				avgMetrics.versatility += p.versatility;
				avgMetrics.accessibility += p.accessibility;
			});
			
			const count = products.length;
			return {
				retention: Math.round(avgMetrics.retention / count),
				heritage: Math.round(avgMetrics.heritage / count),
				versatility: Math.round(avgMetrics.versatility / count),
				accessibility: Math.round(avgMetrics.accessibility / count)
			};
		}

		// Determine fashion journey archetype
		function determineJourney(weights, closetProfile) {
			const { retention, heritage, versatility, accessibility } = weights;
			
			// Heritage Collector
			if (heritage > 40 && retention > 30) {
				return {
					title: 'The Heritage Collector',
					description: 'You invest in iconic pieces from storied houses. Your closet is a museum of craftsmanship and legacy.',
					emoji: '🏛️'
				};
			}
			
			// Savvy Investor
			if (retention > 40) {
				return {
					title: 'The Savvy Investor',
					description: 'You prioritize value retention and smart acquisitions. Your wardrobe is a financial asset.',
					emoji: '💼'
				};
			}
			
			// Accessible Trendsetter
			if (accessibility > 40 && versatility > 30) {
				return {
					title: 'The Accessible Trendsetter',
					description: 'You believe luxury should be attainable. You maximize style impact per dollar spent.',
					emoji: '✨'
				};
			}
			
			// Versatile Curator
			if (versatility > 40) {
				return {
					title: 'The Versatile Curator',
					description: 'You build a wardrobe that works hard. Every piece transitions seamlessly across occasions.',
					emoji: '🎭'
				};
			}
			
			// Balanced Curator (default)
			return {
				title: 'The Balanced Curator',
				description: 'You appreciate quality across all tiers, building a diverse and thoughtful portfolio.',
				emoji: '⚖️'
			};
		}

		// Render product recommendations
		function renderRecommendations(products, totalSpent, budget) {
			const html = products.map(p => `
				<div class="product-card" style="border-left: 4px solid ${brandColors[p.brand]}">
					<div class="product-header">
						<span class="product-brand" style="color: ${brandColors[p.brand]}">${p.brand}</span>
						<span class="product-price">$${p.price.toLocaleString()}</span>
					</div>
					<div class="product-name">${p.type}</div>
					<div class="product-details">
						<span class="product-category">${p.category}</span>
						<span class="product-condition">${p.condition}</span>
					</div>
					<div class="product-scores">
						<div class="score-badge" title="Value Retention">💰 ${p.retention}%</div>
						<div class="score-badge" title="Heritage">🏆 ${p.heritage}%</div>
						<div class="score-badge" title="Versatility">✨ ${p.versatility}%</div>
					</div>
				</div>
			`).join('');
			
			d3.select('#product-recommendations').html(html);
			
			// Portfolio summary
			const brandCounts = {};
			const categoryCounts = {};
			products.forEach(p => {
				brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
				categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
			});
			
			const summaryHtml = `
				<div class="summary-stat">
					<span class="stat-label">Items Selected:</span>
					<span class="stat-value">${products.length}</span>
				</div>
				<div class="summary-stat">
					<span class="stat-label">Total Spent:</span>
					<span class="stat-value">$${totalSpent.toLocaleString()}</span>
				</div>
				<div class="summary-stat">
					<span class="stat-label">Remaining:</span>
					<span class="stat-value ${budget - totalSpent >= 0 ? 'positive' : 'negative'}">$${(budget - totalSpent).toLocaleString()}</span>
				</div>
				<div class="summary-brands">
					${Object.entries(brandCounts).map(([brand, count]) => 
						`<span style="color: ${brandColors[brand]}">${brand} (${count})</span>`
					).join(' • ')}
				</div>
			`;
			
			d3.select('#portfolio-summary').html(summaryHtml);
		}

		// Radar chart setup
		const width = 450;
		const height = 450;
		const margin = 80;
		const radius = Math.min(width, height) / 2 - margin;

		const svg = d3.select('#radar-chart-container')
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width/2}, ${height/2})`);

		// Scale for radar
		const radialScale = d3.scaleLinear()
			.domain([0, 100])
			.range([0, radius]);

		// Draw circular grid
		const levels = 5;
		for (let i = 1; i <= levels; i++) {
			const levelRadius = radius * (i / levels);
			svg.append('circle')
				.attr('r', levelRadius)
				.attr('fill', 'none')
				.attr('stroke', 'rgba(212, 175, 55, 0.2)')
				.attr('stroke-width', 1);
			
			// Level labels
			if (i === levels) {
				svg.append('text')
					.attr('x', 5)
					.attr('y', -levelRadius)
					.style('font-size', '10px')
					.style('fill', '#888')
					.text('100');
			}
		}

		// Draw axes
		const angleSlice = (Math.PI * 2) / metrics.length;
		
		metrics.forEach((metric, i) => {
			const angle = angleSlice * i - Math.PI / 2;
			const x = radius * Math.cos(angle);
			const y = radius * Math.sin(angle);
			
			// Axis line
			svg.append('line')
				.attr('x1', 0)
				.attr('y1', 0)
				.attr('x2', x)
				.attr('y2', y)
				.attr('stroke', 'rgba(212, 175, 55, 0.3)')
				.attr('stroke-width', 1);
			
			// Label
			const labelRadius = radius + 35;
			const labelX = labelRadius * Math.cos(angle);
			const labelY = labelRadius * Math.sin(angle);
			
			svg.append('text')
				.attr('x', labelX)
				.attr('y', labelY)
				.attr('text-anchor', 'middle')
				.attr('dominant-baseline', 'middle')
				.style('font-size', '13px')
				.style('fill', '#d4af37')
				.style('font-weight', '600')
				.text(metric);
		});

		// Function to create radar path
		function radarPath(data) {
			return d3.lineRadial()
				.angle((d, i) => angleSlice * i)
				.radius(d => radialScale(d))
				.curve(d3.curveLinearClosed)(data);
		}

		// Initial closet path (will be updated)
		const closetPath = svg.append('path')
			.attr('class', 'closet-radar-path')
			.attr('fill', '#d4af37')
			.attr('fill-opacity', 0.3)
			.attr('stroke', '#d4af37')
			.attr('stroke-width', 3);

		// Update function
		function updateVisualization() {
			const recommendations = recommendProducts(currentBudget, currentWeights);
			const closetProfile = calculateClosetProfile(recommendations);
			const journey = determineJourney(currentWeights, closetProfile);
			
			// Update radar chart
			const values = [
				closetProfile.retention,
				closetProfile.heritage,
				closetProfile.versatility,
				closetProfile.accessibility
			];
			
			closetPath
				.transition()
				.duration(500)
				.attr('d', radarPath(values));
			
			// Update journey label
			d3.select('#journey-title').html(`${journey.emoji} ${journey.title}`);
			d3.select('#journey-description').text(journey.description);
			
			// Update recommendations
			const totalSpent = recommendations.reduce((sum, p) => sum + p.price, 0);
			renderRecommendations(recommendations, totalSpent, currentBudget);
		}

		// Budget slider interaction
		const budgetSlider = document.getElementById('budget-slider');
		const budgetValue = document.getElementById('budget-value');
		
		budgetSlider.addEventListener('input', (e) => {
			currentBudget = +e.target.value;
			budgetValue.textContent = currentBudget.toLocaleString();
			updateVisualization();
		});

		// Strategy sliders interaction
		const strategySliders = {
			retention: document.getElementById('retention-slider'),
			heritage: document.getElementById('heritage-slider'),
			versatility: document.getElementById('versatility-slider'),
			accessibility: document.getElementById('accessibility-slider')
		};

		Object.entries(strategySliders).forEach(([key, slider]) => {
			slider.addEventListener('input', (e) => {
				const value = +e.target.value;
				currentWeights[key] = value;
				document.getElementById(`${key}-value`).textContent = value;
				updateVisualization();
			});
		});

		// Initial render
		updateVisualization();
	};
})();
		const radialScale = d3.scaleLinear()
			.domain([0, 100])
			.range([0, radius]);

		// Draw circular grid
		const levels = 5;
		for (let i = 1; i <= levels; i++) {
			const levelRadius = radius * (i / levels);
			svg.append('circle')
				.attr('r', levelRadius)
				.attr('fill', 'none')
				.attr('stroke', 'rgba(212, 175, 55, 0.2)')
				.attr('stroke-width', 1);
		}

		// Draw axes
		const angleSlice = (Math.PI * 2) / metrics.length;
		
		metrics.forEach((metric, i) => {
			const angle = angleSlice * i - Math.PI / 2;
			const x = radius * Math.cos(angle);
			const y = radius * Math.sin(angle);
			
			// Axis line
			svg.append('line')
				.attr('x1', 0)
				.attr('y1', 0)
				.attr('x2', x)
				.attr('y2', y)
				.attr('stroke', 'rgba(212, 175, 55, 0.3)')
				.attr('stroke-width', 1);
			
			// Label
			const labelRadius = radius + 30;
			const labelX = labelRadius * Math.cos(angle);
			const labelY = labelRadius * Math.sin(angle);
			
			svg.append('text')
				.attr('x', labelX)
				.attr('y', labelY)
				.attr('text-anchor', 'middle')
				.attr('dominant-baseline', 'middle')
				.style('font-size', '12px')
				.style('fill', '#d4af37')
				.style('font-weight', '500')
				.text(metric);
		});

		// Function to create radar path
		function radarPath(data) {
			return d3.lineRadial()
				.angle((d, i) => angleSlice * i)
				.radius(d => radialScale(d))
				.curve(d3.curveLinearClosed)(data);
		}

		// Draw brand polygons
		brands.forEach((brand, idx) => {
			const values = metrics.map(m => brandMetrics[brand][m]);
			
			svg.append('path')
				.datum(values)
				.attr('d', radarPath)
				.attr('fill', brandColors[brand])
				.attr('fill-opacity', 0.15)
				.attr('stroke', brandColors[brand])
				.attr('stroke-width', 2)
				.attr('class', `radar-path-${brand.toLowerCase()}`)
				.style('cursor', 'pointer')
				.on('mouseover', function() {
					d3.select(this)
						.attr('fill-opacity', 0.3)
						.attr('stroke-width', 3);
					updateInsights(brand);
				})
				.on('mouseout', function() {
					d3.select(this)
						.attr('fill-opacity', 0.15)
						.attr('stroke-width', 2);
				});
		});

		// Legend
		const legend = svg.append('g')
			.attr('transform', `translate(${-radius}, ${radius - 40})`);

		brands.forEach((brand, i) => {
			const legendRow = legend.append('g')
				.attr('transform', `translate(0, ${i * 25})`);
			
			legendRow.append('rect')
				.attr('width', 20)
				.attr('height', 20)
				.attr('fill', brandColors[brand])
				.attr('opacity', 0.7);
			
			legendRow.append('text')
				.attr('x', 30)
				.attr('y', 15)
				.style('font-size', '14px')
				.style('fill', '#f5f5f5')
				.text(brand);
		});

		// Update insights panel
		function updateInsights(brand) {
			const avgPrice = (resaleData[brand].accessories + resaleData[brand].apparel + resaleData[brand].shoes) / 3;
			const metrics = brandMetrics[brand];
			
			const html = `
				<div class="metric-row">
					<span class="metric-label">Average Resale Price:</span>
					<span class="metric-value">$${avgPrice.toFixed(0)}</span>
				</div>
				<div class="metric-row">
					<span class="metric-label">Accessories:</span>
					<span class="metric-value">$${resaleData[brand].accessories.toFixed(0)}</span>
				</div>
				<div class="metric-row">
					<span class="metric-label">Apparel:</span>
					<span class="metric-value">$${resaleData[brand].apparel.toFixed(0)}</span>
				</div>
				<div class="metric-row">
					<span class="metric-label">Shoes:</span>
					<span class="metric-value">$${resaleData[brand].shoes.toFixed(0)}</span>
				</div>
				<div class="metric-row highlight">
					<span class="metric-label">Value Retention Score:</span>
					<span class="metric-value">${metrics['Value Retention']}/100</span>
				</div>
			`;
			
			d3.select('#portfolio-metrics').html(html);
		}

		// Initial insights
		updateInsights('Gucci');

		// Budget slider interaction
		const budgetSlider = document.getElementById('budget-slider');
		const budgetValue = document.getElementById('budget-value');
		
		budgetSlider.addEventListener('input', (e) => {
			budgetValue.textContent = (+e.target.value).toLocaleString();
		});

		// Strategy button interaction
		document.querySelectorAll('.strategy-btn').forEach(btn => {
			btn.addEventListener('click', function() {
				document.querySelectorAll('.strategy-btn').forEach(b => b.classList.remove('active'));
				this.classList.add('active');
				
				const strategy = this.dataset.strategy;
				
				// Highlight different brands based on strategy
				brands.forEach(brand => {
					const path = svg.select(`.radar-path-${brand.toLowerCase()}`);
					
					if (strategy === 'value' && brand === 'Coach') {
						path.attr('fill-opacity', 0.4).attr('stroke-width', 4);
					} else if (strategy === 'heritage' && brand === 'Hermès') {
						path.attr('fill-opacity', 0.4).attr('stroke-width', 4);
					} else if (strategy === 'balanced' && brand === 'Gucci') {
						path.attr('fill-opacity', 0.4).attr('stroke-width', 4);
					} else {
						path.attr('fill-opacity', 0.15).attr('stroke-width', 2);
					}
				});
			});
		});
	};
})();
