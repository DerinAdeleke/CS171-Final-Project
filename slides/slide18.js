(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-16">
			<div class="slide-content">
				<h2 class="section-title">Acknowledgements</h2>
				<p class="section-subtitle">With gratitude to those who made this project possible</p>
				
				<div class="acknowledgements-content">
					<div class="ack-section">
						<div class="ack-title">CS1710 Course Staff</div>
						<p class="ack-text">
							Special thanks to the teaching assistants and staff of CS1710 for their guidance, 
							support, and invaluable feedback throughout this project.
						</p>
					</div>

					<div class="ack-section">
						<div class="ack-title">Data Sources</div>
						<p class="ack-text">
							This visualization was made possible through publicly available data from:
						</p>
						<ul class="ack-list">
							<li>Vestiaire Collective - Luxury Resale Market Data</li>
							<li>Brand Annual Reports & Financial Disclosures</li>
							<li>Google Trends - Search Interest Data</li>
							<li>Historical Brand Archives & Documentation</li>
						</ul>
					</div>

					<div class="ack-section">
						<div class="ack-title">Tools & Technologies</div>
						<p class="ack-text">
							Built with D3.js, HTML5, CSS3, and a passion for data storytelling.
						</p>
					</div>
				</div>
			</div>
		</section>
	`);
})();
