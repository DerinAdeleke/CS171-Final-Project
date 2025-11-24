(function() {
	const container = document.querySelector('.scroll-container');
	if (!container) return;
	container.insertAdjacentHTML('beforeend', `
		<section class="slide slide-3">
			<div class="slide-content">
				<h2 class="section-title">Heritage & Evolution</h2>
				<p class="section-subtitle">A journey through centuries of luxury craftsmanship</p>
				
				<div class="timeline-controls">
					<button class="luxury-button active" data-timeline-brand="all">All Brands</button>
					<button class="luxury-button" data-timeline-brand="Hermès">Hermès (1837)</button>
					<button class="luxury-button" data-timeline-brand="Gucci">Gucci (1921)</button>
					<button class="luxury-button" data-timeline-brand="Coach">Coach (1941)</button>
				</div>

				<div class="timeline-container">
					<div class="timeline-scroll-container">
						<div id="brand-timeline"></div>
					</div>
					
					<div class="timeline-legend">
						<div class="legend-item">
							<div class="legend-dot" style="background: #8B2635; border-color: #8B2635;"></div>
							<div class="legend-label">Hermès (1837)</div>
						</div>
						<div class="legend-item">
							<div class="legend-dot" style="background: #d4af37; border-color: #d4af37;"></div>
							<div class="legend-label">Gucci (1921)</div>
						</div>
						<div class="legend-item">
							<div class="legend-dot" style="background: #8b4513; border-color: #8b4513;"></div>
							<div class="legend-label">Coach (1941)</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	`);

	window.createBrandTimeline = function() {
		const timelineData = [
			// Hermès Timeline
			{year: 1837, brand: "Hermès", title: "Founded in Paris", description: "Thierry Hermès establishes harness workshop on Rue Basse-du-Rempart"},
			{year: 1880, brand: "Hermès", title: "First Leather Goods", description: "Production of high-quality leather goods begins"},
			{year: 1922, brand: "Hermès", title: "Silk Scarves", description: "Introduction of the iconic silk scarves"},
			{year: 1937, brand: "Hermès", title: "The First Handbag", description: "Launch of the first Hermès handbag, the 'Sac à dépêches'"},
			{year: 1956, brand: "Hermès", title: "Kelly Bag", description: "The 'Kelly Bag' is introduced, named after Grace Kelly"},
			{year: 1984, brand: "Hermès", title: "Birkin Bag", description: "Introduction of the 'Birkin Bag', designed for Jane Birkin"},
			{year: 2004, brand: "Hermès", title: "Apple Partnership", description: "Collaboration with Apple to create luxury tech accessories"},
			{year: 2010, brand: "Hermès", title: "Sustainable Initiatives", description: "Hermès begins to emphasize sustainable and ethical practices"},
			{year: 2020, brand: "Hermès", title: "Digital Expansion", description: "Significant expansion of e-commerce and digital presence"},

			// Gucci Timeline
			{year: 1921, brand: "Gucci", title: "Founded in Florence", description: "Guccio Gucci opens his first shop in Florence, selling leather goods and luggage"},
			{year: 1938, brand: "Gucci", title: "The Green-Red-Green Stripe", description: "Introduction of the iconic web stripe, inspired by the saddle girth of Guccio's horse"},
			{year: 1947, brand: "Gucci", title: "The Bamboo Bag", description: "Launch of the 'Bamboo Bag', featuring a distinctive bamboo handle"},
			{year: 1966, brand: "Gucci", title: "The Jackie Bag", description: "Introduction of the 'Jackie Bag', named after Jacqueline Kennedy"},
			{year: 1970, brand: "Gucci", title: "Gucci Watch", description: "Launch of the first Gucci watch collection"},
			{year: 1980, brand: "Gucci", title: "Tom Ford Era", description: "Tom Ford becomes the creative director, revitalizing the brand"},
			{year: 1994, brand: "Gucci", title: "Gucci Group", description: "Formation of the Gucci Group, merging several luxury brands under one umbrella"},
			{year: 2000, brand: "Gucci", title: "New Millennium", description: "Gucci continues to expand globally, opening new stores in key cities"},
			{year: 2015, brand: "Gucci", title: "Alessandro Michele", description: "Alessandro Michele becomes the creative director, introducing a new era of eclectic and romantic designs"},
			{year: 2020, brand: "Gucci", title: "Sustainability Commitment", description: "Gucci announces its commitment to become completely carbon neutral"},

			// Coach Timeline
			{year: 1941, brand: "Coach", title: "Founded in New York", description: "Coach opens as a family-run workshop in New York City"},
			{year: 1961, brand: "Coach", title: "The Original Coach Bag", description: "Introduction of the 'Original Coach Bag', made from hand-cut leather"},
			{year: 1970, brand: "Coach", title: "Signature Canvas", description: "Launch of the Signature Canvas, featuring the iconic 'C' logo"},
			{year: 1985, brand: "Coach", title: "Public Offering", description: "Coach goes public, trading on the New York Stock Exchange"},
			{year: 1996, brand: "Coach", title: "First Store in Japan", description: "Coach opens its first store in Japan, marking its global expansion"},
			{year: 2000, brand: "Coach", title: "Coach Poppy", description: "Introduction of the Coach Poppy collection, targeting a younger audience"},
			{year: 2013, brand: "Coach", title: "Rebranding", description: "Coach undergoes a major rebranding, including a new logo and store design"},
			{year: 2017, brand: "Coach", title: "Acquisition of Kate Spade", description: "Coach acquires Kate Spade & Company, expanding its portfolio"},
			{year: 2019, brand: "Coach", title: "Sustainability Goals", description: "Coach announces ambitious sustainability goals, including carbon neutrality"},
			{year: 2020, brand: "Coach", title: "Inclusive Expression", description: "Campaigns center on diversity, sustainability, and 'Coach Family'"}
		];

		const brandColors = window.brandColors || {
			"Hermès": "#8B2635",
			"Gucci": "#d4af37",
			"Coach": "#8b4513"
		};

		const container = d3.select("#brand-timeline");
		container.html("");

		const minYear = 1830;
		const maxYear = 2025;
		const yearRange = maxYear - minYear;
		const pixelsPerYear = 15;
		const totalWidth = yearRange * pixelsPerYear;

		const timeline = container.append("div")
			.style("position", "relative")
			.style("width", totalWidth + "px")
			.style("min-height", "200px");

		const axis = timeline.append("div")
			.attr("class", "timeline-axis");

		for (let year = 1840; year <= 2020; year += 20) {
			const position = ((year - minYear) / yearRange) * 100;
			timeline.append("div")
				.attr("class", "timeline-year-marker")
				.style("position", "absolute")
				.style("left", position + "%")
				.style("top", "50%")
				.text(year);
		}

		const dots = timeline.selectAll(".timeline-dot")
			.data(timelineData)
			.enter()
			.append("div")
			.attr("class", "timeline-dot")
			.style("left", d => ((d.year - minYear) / yearRange) * 100 + "%")
			.style("background", d => brandColors[d.brand]);

		dots.each(function(d) {
			const dot = d3.select(this);
			const popup = dot.append("div")
				.attr("class", "timeline-popup")
				.style("border-color", brandColors[d.brand]);

			popup.append("div")
				.attr("class", "timeline-brand-label")
				.style("background", brandColors[d.brand])
				.text(d.brand);

			popup.append("div")
				.attr("class", "timeline-title")
				.text(d.title);

			popup.append("div")
				.attr("class", "timeline-description")
				.text(d.description);

			dot.on("mouseover", () => popup.style("opacity", 1))
				.on("mouseout", () => popup.style("opacity", 0));
		});

		dots.transition()
			.duration(500)
			.delay((d, i) => i * 30)
			.style("opacity", 1);

		// Filter functionality
		d3.selectAll(".timeline-controls .luxury-button").on("click", function () {
			const rawBrand = d3.select(this).attr("data-timeline-brand");
			const selected = rawBrand.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

			d3.selectAll(".timeline-controls .luxury-button").classed("active", false);
			d3.select(this).classed("active", true);

			dots.style("opacity", d => {
				const dataBrand = d.brand.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				if (selected === "all") return 1;
				return dataBrand === selected ? 1 : 0.15;
			})
			.style("pointer-events", d => {
				const dataBrand = d.brand.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				if (selected === "all") return "auto";
				return dataBrand === selected ? "auto" : "none";
			});

			dots.each(function (d) {
				const popup = d3.select(this).select(".timeline-popup");
				const dataBrand = d.brand.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				if (selected !== "all" && dataBrand !== selected) {
					popup.style("opacity", 0);
				}
			});
		});
	};
})();
