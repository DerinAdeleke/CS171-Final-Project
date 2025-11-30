(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-4">
			<div class="slide-content">
				<h2 class="section-title">Our Chosen Three</h2>
				<p class="section-subtitle">Hermès, Gucci, and Coach define distinct segments of luxury</p>
				
				<div class="brand-grid">
					<div class="brand-card">
						<div class="brand-name" style="color: #8B2635;">HERMÈS</div>
						<div class="decorative-line"></div>
						<div class="brand-metric">$16.4B</div>
						<div class="stat-label">2024 Revenue</div>
						<p class="brand-description">Ultra-luxury positioning with exceptional craftsmanship and timeless appeal</p>
					</div>
					<div class="brand-card">
						<div class="brand-name" style="color: #d4af37;">GUCCI</div>
						<div class="decorative-line"></div>
						<div class="brand-metric">$14.9B</div>
						<div class="stat-label">2024 Revenue</div>
						<p class="brand-description">Bold contemporary luxury with mass appeal and cultural relevance</p>
					</div>
					<div class="brand-card">
						<div class="brand-name" style="color: #8b4513;">COACH</div>
						<div class="decorative-line"></div>
						<div class="brand-metric">$1.2B</div>
						<div class="stat-label">2024 Revenue</div>
						<p class="brand-description">Accessible luxury with American heritage and practical elegance</p>
					</div>
				</div>
			</div>
		</section>
	`);
})();
