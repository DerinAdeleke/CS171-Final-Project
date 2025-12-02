(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide intro-slide">
			<div class="slide-content">
				<div class="intro-content">
					<div class="intro-header">
						<h2 class="section-title">Did You Know?</h2>
						<p class="section-subtitle">
							In 2024, $1.7 trillion was spent on luxury goods globally, 
							with $473.9 billion dedicated to luxury fashion alone.
						</p>
					</div>
					
					<div class="intro-viz-section">
						<div class="intro-left">
							<p class="intro-text">
								<strong style="color: #d4af37;">Louis Vuitton</strong> dominates at $111.9 billion, 
								followed by <strong style="color: #d4af37;">Hermès</strong> at $109.4 billion.
							</p>
							<p class="intro-text">
								But brand value alone doesn't reveal how luxury really works.
							</p>
							
							<div class="brands-focus">
								<h3>We explored three brands that tell very different stories:</h3>
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
