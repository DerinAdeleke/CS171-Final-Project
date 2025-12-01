/*
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

	// Create distribution visualization function
	window.createDistributionChart = function() {
		const brandColors = window.brandColors;
		const tooltip = d3.select(".tooltip");
		
		const width = 600;
		const height = 600;
		const radius = Math.min(width, height) / 2 - 30;

		const svg = d3.select("#distribution-chart")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", `translate(${width/2},${height/2})`);

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

		svg.selectAll("path")
			.data(root.descendants().filter(d => d.depth))
			.enter()
			.append("path")
			.attr("d", arc)
			.attr("fill", d => {
				if (d.depth === 1) return color(d.data.name);
				return color(d.parent.data.name);
			})
			.attr("opacity", d => d.depth === 1 ? 0.9 : 0.6)
			.attr("stroke", "#0a0a0a")
			.attr("stroke-width", 2)
			.on("mouseover", function(event, d) {
				d3.select(this).transition().duration(200).attr("opacity", 1);
				const percentage = ((d.value / root.value) * 100).toFixed(1);
				tooltip.style("opacity", 1)
					.html(`<strong>${d.data.name}</strong><br>Items: ${d.value.toLocaleString()}<br>Share: ${percentage}%`)
					.style("left", (event.pageX + 10) + "px")
					.style("top", (event.pageY - 28) + "px");
			})
			.on("mouseout", function(event, d) {
				d3.select(this).transition().duration(200).attr("opacity", d.depth === 1 ? 0.9 : 0.6);
				tooltip.style("opacity", 0);
			})
			.transition().duration(1000).delay((d, i) => i * 50)
			.attrTween("d", function(d) {
				const interpolate = d3.interpolate({x0: 0, x1: 0, y0: 0, y1: 0}, d);
				return function(t) { return arc(interpolate(t)); };
			});

		svg.append("text").attr("text-anchor", "middle").attr("dy", "-0.5em")
			.style("font-size", "2.5em").style("fill", "#d4af37").style("font-weight", "300").text("74K+");

		svg.append("text").attr("text-anchor", "middle").attr("dy", "1.5em")
			.style("font-size", "1.2em").style("fill", "#b8b8b8").style("letter-spacing", "0.1em").text("TOTAL ITEMS");
	};
})();
*/
