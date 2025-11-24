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
					<div class="scroll-hint">
						<div class="scroll-indicator"></div>
						Scroll to Explore
					</div>
				</div>
			</div>
		</section>
	`);
})();
