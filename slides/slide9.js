(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-insights">
			<div class="slide-content">
				<h2 class="section-title">The New Geography of Desire</h2>
				<div class="insights-grid">
					<div class="insight-card highlight-card">
						<div class="insight-icon">🇹🇷</div>
						<div class="insight-stat">+38.8%</div>
						<div class="insight-label">Turkey Leads Growth</div>
						<p class="insight-description">
							While the US dominates with 19.8% market share, Turkey is the sleeping giant—
							growing faster than any other market. The future of luxury isn't where you think.
						</p>
					</div>
					
					<div class="insight-card">
						<div class="insight-icon">🌏</div>
						<div class="insight-stat">Asia Rising</div>
						<div class="insight-label">3 of Top 10</div>
						<p class="insight-description">
							India, Japan, and Vietnam collectively represent 18.7% of global traffic. 
							Asia's luxury appetite is reshaping brand strategies worldwide.
						</p>
					</div>
					
					<div class="insight-card">
						<div class="insight-icon">💻</div>
						<div class="insight-stat">Digital First</div>
						<div class="insight-label">The Online Shift</div>
						<p class="insight-description">
							72.8% of all luxury traffic comes from just 10 countries—but it's all happening online. 
							The boutique experience has gone digital, and there's no going back.
						</p>
					</div>
				</div>
			</div>
		</section>
	`);
})();
