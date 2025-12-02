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
							<div class="instruction-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M9 18l6-6-6-6"/>
								</svg>
							</div>
							<div class="instruction-text">Hover over elements</div>
						</div>
						<div class="instruction-item">
							<div class="instruction-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<circle cx="12" cy="12" r="5"/>
									<line x1="12" y1="1" x2="12" y2="3"/>
									<line x1="12" y1="21" x2="12" y2="23"/>
									<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
									<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
									<line x1="1" y1="12" x2="3" y2="12"/>
									<line x1="21" y1="12" x2="23" y2="12"/>
									<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
									<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
								</svg>
							</div>
							<div class="instruction-text">Click lightbulbs for insights</div>
						</div>
						<div class="instruction-item">
							<div class="instruction-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M12 5v14M5 12l7 7 7-7"/>
								</svg>
							</div>
							<div class="instruction-text">Scroll to continue</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	`);
})();
