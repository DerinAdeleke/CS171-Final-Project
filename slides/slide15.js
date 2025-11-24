(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-12">
			<div class="slide-content">
				<h2 class="section-title">Resale Market</h2>
				<p class="section-subtitle">Secondary market reveals brand value retention and desirability</p>
				
				<div class="viz-container">
					<div id="resale-chart"></div>
					<div class="controls">
						<button class="luxury-button active" data-category="all">All Categories</button>
						<button class="luxury-button" data-category="Accessories">Accessories</button>
						<button class="luxury-button" data-category="Apparel">Apparel</button>
						<button class="luxury-button" data-category="Shoes">Shoes</button>
					</div>
				</div>
			</div>
		</section>
	`);

	window.createResaleChart = function() {
		const brandColors = window.brandColors;
		const resaleData = window.resaleData;
		const tooltip = d3.select(".tooltip");

		const margin = {top: 60, right: 120, bottom: 120, left: 100};
		const width = 1200 - margin.left - margin.right;
		const height = 500 - margin.top - margin.bottom;

		// ...existing resale chart implementation...
	};
})();
