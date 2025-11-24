(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-vestiaire">
			<div class="slide-content">
				<h2 class="section-title">The Vestiaire Marketplace</h2>
				<p class="section-subtitle">Real-time pricing data from 62,000+ luxury resale items</p>
				
				<div class="viz-container">
					<div id="vestiaire-viz"></div>
					<div class="vestiaire-controls">
						<button class="luxury-button active" data-vestiaire-view="violin">Price Distribution</button>
						<button class="luxury-button" data-vestiaire-view="condition">By Condition</button>
						<button class="luxury-button" data-vestiaire-view="volume">Market Volume</button>
					</div>
				</div>
			</div>
		</section>
	`);

	window.createVestiaireViz = async function() {
		const brandColors = window.brandColors;
		
		const [coachData, gucciData, hermesData] = await Promise.all([
			d3.csv("vestiaire-coach.csv"),
			d3.csv("vestiaire-gucci.csv"),
			d3.csv("vestiaire-hermes.csv")
		]);

		// ...existing vestiaire implementation...
	};
})();
