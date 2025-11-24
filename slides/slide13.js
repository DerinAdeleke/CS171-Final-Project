(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-insights">
			<div class="slide-content">
				<h2 class="section-title">What 74,000 Items Tell Us</h2>
				<div class="insights-grid">
					<div class="insight-card">
						<div class="insight-icon">👟</div>
						<div class="insight-stat">57%</div>
						<div class="insight-label">Gucci's Power Play</div>
						<p class="insight-description">
							Gucci dominates with 42,115 items across categories—that's more than Hermès and Coach 
							combined. Their accessible luxury strategy floods the market with desirability.
						</p>
					</div>
					
					<div class="insight-card highlight-card">
						<div class="insight-icon">💎</div>
						<div class="insight-stat">Accessories Win</div>
						<div class="insight-label">62% of Hermès</div>
						<p class="insight-description">
							For ultra-luxury, it's all about the bag. Hermès' 12,431 accessories (vs. 2,247 apparel) 
							prove that in the stratosphere of luxury, accessories are the ultimate status symbol.
						</p>
					</div>
					
					<div class="insight-card">
						<div class="insight-icon">📊</div>
						<div class="insight-stat">3% Market</div>
						<div class="insight-label">Coach's Challenge</div>
						<p class="insight-description">
							With just 2,264 items (3% of the market), Coach faces an uphill battle. 
							But smaller presence doesn't mean smaller ambition—accessible luxury is still luxury.
						</p>
					</div>
				</div>
			</div>
		</section>
	`);
})();
