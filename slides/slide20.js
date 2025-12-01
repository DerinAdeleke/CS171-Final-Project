(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-20">
			<div class="floating-particles"></div>
			<div class="slide-content">
				<div class="conclusion-container">
					<div class="conclusion-header">
						<h2 class="conclusion-title">Your Luxury, Your Way</h2>
						<div class="conclusion-tagline">Three paths. One truth: luxury is personal.</div>
					</div>

					<div class="luxury-paths">
						<div class="path-card path-heritage">
							<div class="path-name">The Heritage Collector</div>
							<div class="path-description">
								For those who see luxury as legacy. You invest in timeless pieces that appreciate, 
								understanding that true luxury is an heirloom, not a trend.
							</div>
							<div class="path-brand">Hermès</div>
						</div>

						<div class="path-card path-cultural">
							<div class="path-name">The Cultural Connoisseur</div>
							<div class="path-description">
								You live where heritage meets hype. Luxury is cultural fluency—owning pieces that 
								speak to both the runway and the street.
							</div>
							<div class="path-brand">Gucci</div>
						</div>

						<div class="path-card path-savvy">
							<div class="path-name">The Savvy Strategist</div>
							<div class="path-description">
								You believe luxury shouldn't require a trust fund. Your approach is smart, intentional, 
								and value-driven—quality over exclusivity.
							</div>
							<div class="path-brand">Coach</div>
						</div>
					</div>

					<div class="final-message">
						<div class="final-message-content">
							<h3>The Verdict</h3>
							<p class="message-main">
								Luxury isn't monolithic—it's a spectrum. Whether you chase exclusivity, cultural relevance, 
								or smart value, <strong>authentic luxury is defined by what resonates with you</strong>, not what tradition dictates.
							</p>
							<p class="message-cta">Choose your journey. Build your closet. Define your luxury.</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	`);

	// Create floating particles
	const particleContainer = document.querySelector('.slide-20 .floating-particles');
	if (particleContainer) {
		for (let i = 0; i < 30; i++) {
			const particle = document.createElement('div');
			particle.className = 'particle';
			particle.style.left = Math.random() * 100 + '%';
			particle.style.animationDelay = Math.random() * 8 + 's';
			particle.style.animationDuration = (8 + Math.random() * 6) + 's';
			particleContainer.appendChild(particle);
		}
	}
})();
