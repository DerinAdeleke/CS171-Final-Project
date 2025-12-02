(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-1">
			<div class="slide-content">
				<div class="title-container">
					<h1 class="main-title">Luxury</h1>
					<div class="decorative-line"></div>
					<p class="subtitle">A Data Story of Fashion Excellence</p>
					<div class="instructions-container">
						<div class="instruction-item">
							<div class="instruction-icon">⬇️</div>
							<div class="instruction-text">Scroll to Explore</div>
						</div>
						<div class="instruction-item">
							<div class="instruction-icon">👆</div>
							<div class="instruction-text">Hover to Learn More</div>
						</div>
						<div class="instruction-item">
							<div class="instruction-icon">💡</div>
							<div class="instruction-text">Click Lightbulbs for Insights</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	`);
})();
