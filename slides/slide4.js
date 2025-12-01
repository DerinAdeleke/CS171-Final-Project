(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-4">
			<div class="slide-content">
				<h2 class="section-title">Our Chosen Three</h2>
				<p class="section-subtitle">Hover to discover why we selected each brand</p>
				
				<div class="brand-flip-grid">
					<!-- Hermès Card -->
					<div class="flip-card">
						<div class="flip-card-inner">
							<div class="flip-card-front hermes-front">
								<div class="brand-logo-section">
									<div class="brand-name-large" style="color: #8B2635;">HERMÈS</div>
									<div class="brand-tagline">The Pinnacle</div>
								</div>
								<div class="decorative-line" style="background: #8B2635;"></div>
								<div class="brand-metric-large">$16.4B</div>
								<div class="stat-label">2024 Revenue</div>
								<div class="brand-tier">Ultra-Luxury Tier</div>
							</div>
							<div class="flip-card-back hermes-back">
								<div class="back-title">Why Hermès?</div>
								<div class="selection-narrative">
									<p>Hermès represents the apex of luxury—a brand where scarcity is strategy and craftsmanship is religion. For nearly two centuries, this family-owned house has refused to compromise, maintaining a production model where a single artisan creates each bag from start to finish. The result? Pieces so coveted they command multi-year waitlists and often appreciate in value.</p>
									<p>In resale markets, Hermès dominates with unmatched value retention, proving that true luxury is both cultural aspiration and financial investment. By studying Hermès, we examine how exclusivity, heritage, and artisanal excellence create enduring desire.</p>
								</div>
								<div class="insight-label">Represents: Exclusivity & Investment</div>
							</div>
						</div>
					</div>

					<!-- Gucci Card -->
					<div class="flip-card">
						<div class="flip-card-inner">
							<div class="flip-card-front gucci-front">
								<div class="brand-logo-section">
									<div class="brand-name-large" style="color: #d4af37;">GUCCI</div>
									<div class="brand-tagline">The Powerhouse</div>
								</div>
								<div class="decorative-line" style="background: #d4af37;"></div>
								<div class="brand-metric-large">$14.9B</div>
								<div class="stat-label">2024 Revenue</div>
								<div class="brand-tier">Mid-Luxury Tier</div>
							</div>
							<div class="flip-card-back gucci-back">
								<div class="back-title">Why Gucci?</div>
								<div class="selection-narrative">
									<p>Gucci is luxury's cultural lightning rod—equally at home on red carpets and in hip-hop lyrics. This Italian powerhouse has mastered the delicate balance between heritage and hype, offering everything from entry-level sneakers to investment-grade handbags. Its omnipresence in pop culture makes it the most recognizable luxury brand globally.</p>
									<p>What makes Gucci essential to our analysis is its versatility. It dominates resale markets not through scarcity, but through volume and desirability across categories. Gucci shows us how modern luxury brands scale prestige while maintaining cultural relevance across generations and demographics.</p>
								</div>
								<div class="insight-label">Represents: Mass Luxury & Cultural Relevance</div>
							</div>
						</div>
					</div>

					<!-- Coach Card -->
					<div class="flip-card">
						<div class="flip-card-inner">
							<div class="flip-card-front coach-front">
								<div class="brand-logo-section">
									<div class="brand-name-large" style="color: #8b4513;">COACH</div>
									<div class="brand-tagline">The Gateway</div>
								</div>
								<div class="decorative-line" style="background: #8b4513;"></div>
								<div class="brand-metric-large">$1.2B</div>
								<div class="stat-label">2024 Revenue</div>
								<div class="brand-tier">Accessible Luxury</div>
							</div>
							<div class="flip-card-back coach-back">
								<div class="back-title">Why Coach?</div>
								<div class="selection-narrative">
									<p><strong>Yes, Coach is luxury.</strong> Since its founding in New York, Coach has represented American craftsmanship and practical elegance—a counterpoint to European extravagance. While skeptics question its luxury credentials, Coach offers something equally valuable: accessibility without sacrificing quality. Its leather goods are meticulously crafted, just attainable.</p>
									<p>Coach is critical to our analysis because it reveals where luxury journeys begin. It democratizes premium ownership, offering entry points that European brands cannot match. By including Coach, we capture the full spectrum of luxury—from aspiration to acquisition to investment—and understand how value, heritage, and accessibility shape consumer choices.</p>
								</div>
								<div class="insight-label">Represents: Attainable Luxury & American Heritage</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	`);
})();
