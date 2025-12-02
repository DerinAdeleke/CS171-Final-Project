(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide intro-slide">
			<div class="slide-content">
				<div class="intro-content">
					<div class="intro-header">
						<h2 class="intro-title">DID YOU KNOW?</h2>
						<p class="intro-description">
							In 2024, <span class="highlight">$1.7 trillion</span> was spent on luxury goods globally, 
							with <span class="highlight">$473.9 billion</span> dedicated to luxury fashion alone.
						</p>
						<p class="intro-source">Source: Bain & Company Global Luxury Market Analysis 2024</p>
					</div>
					
					<div class="intro-viz-section">
						<div class="intro-left">
							<h3 class="intro-subtitle">The World's Most Valuable Luxury Brands</h3>
							<p class="intro-text">
								<strong style="color: #d4af37;">Louis Vuitton</strong> dominates at $111.9 billion, 
								followed by <strong style="color: #d4af37;">Hermès</strong> at $109.4 billion.
							</p>
							<p class="intro-text">
								But brand value alone doesn't reveal how luxury really works.
							</p>
							
							<div class="brands-focus">
								<h3>We explored three brands that tell very different stories about what luxury can be:</h3>
								<p>
									<strong>Hermès</strong>, <strong>Gucci</strong>, and <strong>Coach</strong>
								</p>
							</div>
						</div>
						
						<div id="luxuryBrandsChart"></div>
					</div>
				</div>
			</div>
		</section>
	`);
})();
