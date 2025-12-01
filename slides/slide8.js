// HIDDEN - Global Traffic Hub slide
/*
(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-7">
			<div class="slide-content">
				<h2 class="section-title">Global Traffic Hub</h2>
				<p class="section-subtitle">Top 10 countries driving online luxury market engagement in 2024</p>
				
				<div class="viz-container">
					<div id="global-traffic-viz"></div>
					<div class="traffic-insights">
						<div class="insight-box">
							<div class="insight-label">Fastest Growing</div>
							<div class="insight-value">Turkey +38.8%</div>
						</div>
						<div class="insight-box">
							<div class="insight-label">Market Leader</div>
							<div class="insight-value">USA 19.8%</div>
						</div>
						<div class="insight-box">
							<div class="insight-label">Combined Traffic</div>
							<div class="insight-value">72.8%</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	`);

	window.createGlobalTrafficViz = function() {
		const trafficData = [
			{country: "United States", share: 19.80, growth: 11.80, visits: "500M-2B", region: "Americas"},
			{country: "India", share: 7.50, growth: 23, visits: "500M-2B", region: "Asia"},
			{country: "Japan", share: 7.50, growth: 24.20, visits: "300-499M", region: "Asia"},
			{country: "United Kingdom", share: 5.90, growth: 5.40, visits: "300-499M", region: "Europe"},
			{country: "Russia", share: 5.40, growth: 6, visits: "300-499M", region: "Europe"},
			{country: "Turkey", share: 4.40, growth: 38.80, visits: "200-299M", region: "Europe"},
			{country: "Germany", share: 3.90, growth: 10.40, visits: "200-299M", region: "Europe"},
			{country: "France", share: 3.80, growth: 9.60, visits: "200-299M", region: "Europe"},
			{country: "Vietnam", share: 3.70, growth: 17.60, visits: "200-299M", region: "Asia"},
			{country: "Poland", share: 3.40, growth: 18.10, visits: "200-299M", region: "Europe"}
		];

		const margin = {top: 40, right: 200, bottom: 60, left: 200};
		const width = 1400 - margin.left - margin.right;
		const height = 550 - margin.top - margin.bottom;

		const svg = d3.select("#global-traffic-viz")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const regionColors = {"Americas": "#d4af37", "Asia": "#ff6b6b", "Europe": "#4ecdc4"};
		const centerX = width / 2, centerY = height / 2;
		const maxRadius = Math.min(width, height) / 2 - 50;

		const radiusScale = d3.scaleSqrt().domain([0, d3.max(trafficData, d => d.share)]).range([0, maxRadius]);
		const angleScale = d3.scaleLinear().domain([0, trafficData.length]).range([0, 2 * Math.PI]);

		const tooltip = d3.select("#global-traffic-viz")
			.append("div").attr("class", "traffic-tooltip");

		// ...existing visualization code (lines, circles, labels, hover interactions)...
		// (Keep the full implementation from index.html)
	};
})();
