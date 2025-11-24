(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-10">
			<div class="slide-content">
				<h2 class="section-title">Market Distribution</h2>
				<p class="section-subtitle">Category breakdown reveals strategic positioning</p>
				
				<div class="viz-container">
					<div id="distribution-chart"></div>
				</div>
			</div>
		</section>
	`);

	window.createDistributionChart = function() {
		const brandColors = window.brandColors;
		const tooltip = d3.select(".tooltip");
		
		const width = 800, height = 800;
		const radius = Math.min(width, height) / 2 - 40;

		const svg = d3.select("#distribution-chart")
			.append("svg").attr("width", width).attr("height", height)
			.append("g").attr("transform", `translate(${width/2},${height/2})`);

		const hierarchyData = {
			name: "Luxury Market",
			children: [
				{name: "Hermès", children: [{name: "Accessories", value: 12431}, {name: "Apparel", value: 2247}, {name: "Shoes", value: 5084}]},
				{name: "Gucci", children: [{name: "Accessories", value: 17914}, {name: "Apparel", value: 6668}, {name: "Shoes", value: 17533}]},
				{name: "Coach", children: [{name: "Accessories", value: 1627}, {name: "Apparel", value: 210}, {name: "Shoes", value: 427}]}
			]
		};

		const root = d3.hierarchy(hierarchyData).sum(d => d.value).sort((a, b) => b.value - a.value);
		const partition = d3.partition().size([2 * Math.PI, radius]);
		partition(root);

		const arc = d3.arc()
			.startAngle(d => d.x0).endAngle(d => d.x1)
			.innerRadius(d => d.y0).outerRadius(d => d.y1);

		const color = d3.scaleOrdinal()
			.domain(["Hermès", "Gucci", "Coach"])
			.range([brandColors["Hermès"], brandColors["Gucci"], brandColors["Coach"]]);

		// ...existing path creation and interaction code...
	};
})();
